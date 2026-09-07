import os
import joblib
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from backend.app.core.database import SessionLocal
from backend.app.models.db_models import ModelRegistryEntity, ModelStatusEnum
from backend.app.models.schemas import MLModelRegistryItem

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)
REGISTRY_INDEX_FILE = os.path.join(ARTIFACTS_DIR, "registry_index.json")

class ModelRegistry:
    """
    Manages ML Model versioning, persistence (.joblib), activation, and promotion.
    """
    def __init__(self):
        self.artifacts_dir = ARTIFACTS_DIR
        self._active_model_cache: Optional[Dict[str, Any]] = None
        self._active_metadata: Optional[MLModelRegistryItem] = None
        self._load_active_model()

    def get_next_version(self) -> str:
        existing = self.list_models()
        idx = len(existing) + 1
        return f"traffic_model_v{idx:03d}"

    def register_trained_pipeline(
        self,
        pipeline_pack: Dict[str, Any],
        dataset_id: Optional[str] = None,
        target_variable: str = "future_congestion"
    ) -> MLModelRegistryItem:
        version = self.get_next_version()
        model_id = f"REG-{version}"
        artifact_filename = f"{version}.joblib"
        artifact_path = os.path.join(self.artifacts_dir, artifact_filename)

        # 1. Save artifact using joblib (models + scalers + feature list)
        artifact_payload = {
            "version": version,
            "trained_models": pipeline_pack["trained_models"],
            "transformers": pipeline_pack["transformers"],
            "active_features": pipeline_pack["active_features"],
            "horizons": list(pipeline_pack["trained_models"].keys()),
            "best_models_by_horizon": pipeline_pack["best_models_by_horizon"]
        }
        joblib.dump(artifact_payload, artifact_path)

        primary_metrics = pipeline_pack["primary_metrics"]
        sample_counts = pipeline_pack["sample_counts"]

        # 2. Check if this is the first model or outperforms active model
        is_promoted = False
        current_active = self.get_active_model_metadata()
        if current_active is None or primary_metrics["r2"] >= current_active.test_r2:
            is_promoted = True

        status_enum = ModelStatusEnum.ACTIVE if is_promoted else ModelStatusEnum.VALIDATED

        # 3. Save to database & file cache
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        item = MLModelRegistryItem(
            model_id=model_id,
            version=version,
            model_type=primary_metrics["model_name"],
            dataset_id=dataset_id,
            target_variable=target_variable,
            horizons_supported=list(pipeline_pack["trained_models"].keys()),
            features=pipeline_pack["active_features"],
            training_samples=sample_counts["training"],
            validation_samples=sample_counts["validation"],
            test_samples=sample_counts["test"],
            test_mae=primary_metrics["mae"],
            test_rmse=primary_metrics["rmse"],
            test_r2=primary_metrics["r2"],
            candidate_metrics=pipeline_pack["evaluation_results"],
            status="ACTIVE" if is_promoted else "VALIDATED",
            prediction_count=0,
            created_at=now_str
        )

        try:
            db = SessionLocal()
            # If promoting, set other active models to ARCHIVED
            if is_promoted:
                db.query(ModelRegistryEntity).filter(ModelRegistryEntity.status == ModelStatusEnum.ACTIVE).update({"status": ModelStatusEnum.ARCHIVED})
            
            db_item = ModelRegistryEntity(
                id=model_id,
                version=version,
                model_type=primary_metrics["model_name"],
                dataset_id=dataset_id,
                target_variable=target_variable,
                horizons_supported=list(pipeline_pack["trained_models"].keys()),
                features=pipeline_pack["active_features"],
                training_samples=sample_counts["training"],
                validation_samples=sample_counts["validation"],
                test_samples=sample_counts["test"],
                test_mae=primary_metrics["mae"],
                test_rmse=primary_metrics["rmse"],
                test_r2=primary_metrics["r2"],
                candidate_metrics=pipeline_pack["evaluation_results"],
                artifact_path=artifact_path,
                status=status_enum,
                prediction_count=0,
                created_at=datetime.utcnow()
            )
            db.add(db_item)
            db.commit()
            db.close()
        except Exception:
            pass

        # Update file index
        self._update_file_index(item)

        if is_promoted:
            self._active_model_cache = artifact_payload
            self._active_metadata = item

        return item

    def _update_file_index(self, item: MLModelRegistryItem):
        index_data = self._read_file_index()
        if item.status == "ACTIVE":
            for x in index_data:
                if x.get("status") == "ACTIVE":
                    x["status"] = "ARCHIVED"
        index_data.append(item.model_dump())
        with open(REGISTRY_INDEX_FILE, "w", encoding="utf-8") as f:
            json.dump(index_data, f, indent=2)

    def _read_file_index(self) -> List[Dict[str, Any]]:
        if os.path.exists(REGISTRY_INDEX_FILE):
            try:
                with open(REGISTRY_INDEX_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return []
        return []

    def list_models(self) -> List[MLModelRegistryItem]:
        # Try database first
        try:
            db = SessionLocal()
            rows = db.query(ModelRegistryEntity).order_by(ModelRegistryEntity.created_at.desc()).all()
            if rows:
                items = [
                    MLModelRegistryItem(
                        model_id=r.id,
                        version=r.version,
                        model_type=r.model_type,
                        dataset_id=r.dataset_id,
                        target_variable=r.target_variable,
                        horizons_supported=r.horizons_supported if isinstance(r.horizons_supported, list) else ["15m"],
                        features=r.features if isinstance(r.features, list) else [],
                        training_samples=r.training_samples,
                        validation_samples=r.validation_samples,
                        test_samples=r.test_samples,
                        test_mae=r.test_mae,
                        test_rmse=r.test_rmse,
                        test_r2=r.test_r2,
                        candidate_metrics=r.candidate_metrics or {},
                        status=r.status.value if hasattr(r.status, "value") else str(r.status),
                        prediction_count=r.prediction_count,
                        created_at=r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else ""
                    ) for r in rows
                ]
                db.close()
                return items
            db.close()
        except Exception:
            pass

        # Fallback to local index file
        file_items = self._read_file_index()
        return [MLModelRegistryItem(**x) for x in reversed(file_items)]

    def _load_active_model(self):
        models = self.list_models()
        active = next((m for m in models if m.status == "ACTIVE"), None)
        if not active and models:
            active = models[0]
        if active:
            self._active_metadata = active
            art_file = os.path.join(self.artifacts_dir, f"{active.version}.joblib")
            if os.path.exists(art_file):
                try:
                    self._active_model_cache = joblib.load(art_file)
                except Exception:
                    pass

    def get_active_model(self) -> Optional[Dict[str, Any]]:
        if self._active_model_cache is None:
            self._load_active_model()
        return self._active_model_cache

    def get_active_model_metadata(self) -> Optional[MLModelRegistryItem]:
        if self._active_metadata is None:
            self._load_active_model()
        return self._active_metadata

model_registry = ModelRegistry()
