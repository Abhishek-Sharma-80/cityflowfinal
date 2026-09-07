import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional
from backend.app.ml.registry import model_registry
from backend.app.ml.explainability import xai_explainer
from backend.app.models.schemas import MLPredictResponseModel, DataTypeEnum, PredictionContributingFactor
from backend.app.core.database import SessionLocal
from backend.app.models.db_models import PredictionRecordEntity

class PredictionService:
    """
    Live Machine Learning Inference Service.
    Loads active serialized model from ModelRegistry and generates multi-horizon predictions.
    """
    def __init__(self):
        pass

    def predict_road_congestion(
        self,
        road_segment_id: str,
        road_name: Optional[str] = None,
        horizon_minutes: int = 15,
        current_speed_kmh: Optional[float] = None,
        volume_vph: Optional[float] = None,
        free_flow_speed_kmh: float = 50.0,
        incident_active: bool = False,
        incident_severity: float = 0.0,
        rainfall_mm: float = 0.0
    ) -> MLPredictResponseModel:
        active_pipeline = model_registry.get_active_model()
        active_meta = model_registry.get_active_model_metadata()

        now = datetime.utcnow()
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")

        # If no trained model exists in registry
        if active_pipeline is None or active_meta is None:
            # Baseline deterministic calculation when model is not yet trained
            speed = current_speed_kmh if current_speed_kmh is not None else 35.0
            ratio = speed / max(1.0, free_flow_speed_kmh)
            cong = max(0.0, min(1.0, 1.0 - ratio))
            return MLPredictResponseModel(
                road_segment_id=road_segment_id,
                road_name=road_name or road_segment_id,
                horizon_minutes=horizon_minutes,
                predicted_congestion=round(cong, 4),
                predicted_speed_kmh=round(speed, 1),
                model_version="NO_TRAINED_MODEL",
                generated_at=now_str,
                data_type=DataTypeEnum.PREDICTED,
                explanations=[
                    PredictionContributingFactor(
                        factor="baseline_speed",
                        impact_pct=100.0,
                        feature_name="baseline_speed",
                        weight_pct=100.0,
                        impact_direction="INCREASING_CONGESTION" if cong > 0.5 else "DECREASING_CONGESTION",
                        description="Deterministic estimate (train a model in ML Intelligence to enable ML predictions)."
                    )
                ]
            )

        # Map horizon to supported keys
        h_key = f"{horizon_minutes}m"
        if h_key not in active_pipeline["trained_models"]:
            h_key = "15m" if "15m" in active_pipeline["trained_models"] else list(active_pipeline["trained_models"].keys())[0]

        model = active_pipeline["trained_models"][h_key]
        transformer = active_pipeline["transformers"].get(h_key)
        features = active_pipeline["active_features"]

        # Assemble feature dict
        hour_val = now.hour + (now.minute / 60.0)
        day_val = now.weekday()
        is_weekend = 1.0 if day_val >= 5 else 0.0
        speed = current_speed_kmh if current_speed_kmh is not None else 35.0
        vol = volume_vph if volume_vph is not None else 1800.0
        speed_ratio = float(speed / max(1.0, free_flow_speed_kmh))
        base_cong = float(max(0.0, min(1.0, 1.0 - speed_ratio)))

        sample_dict: Dict[str, float] = {
            "hour_of_day": hour_val,
            "day_of_week": float(day_val),
            "is_weekend": is_weekend,
            "sin_hour": float(np.sin(2 * np.pi * hour_val / 24.0)),
            "cos_hour": float(np.cos(2 * np.pi * hour_val / 24.0)),
            "current_speed_kmh": speed,
            "volume_vph": vol,
            "speed_ratio": speed_ratio,
            "congestion_level": base_cong,
            "traffic_density": min(0.98, vol / 3000.0),
            "occupancy_pct": base_cong * 85.0 + 5.0,
            "temperature_c": 26.0,
            "rainfall_mm": rainfall_mm,
            "visibility_km": 10.0,
            "incident_active": 1.0 if incident_active else 0.0,
            "incident_severity": incident_severity,
            "logistics_volume_norm": 0.65,
            "parking_pressure": 0.60,
            "lag_1_speed": speed,
            "lag_1_volume": vol
        }

        # Build feature dataframe
        feature_vector = {f: sample_dict.get(f, 0.0) for f in features}
        df_sample = pd.DataFrame([feature_vector])

        # Apply scaling
        if transformer:
            df_sample_t = transformer.transform(df_sample)
        else:
            df_sample_t = df_sample

        # Predict
        raw_pred = float(model.predict(df_sample_t)[0])
        pred_cong = float(np.clip(raw_pred, 0.0, 1.0))
        pred_speed = float(np.clip(free_flow_speed_kmh * (1.0 - pred_cong), 5.0, free_flow_speed_kmh))

        # Explain
        explanations = xai_explainer.explain_prediction(
            model=model,
            feature_names=features,
            sample_values=sample_dict,
            predicted_congestion=pred_cong
        )

        # Log prediction record to DB
        try:
            db = SessionLocal()
            record = PredictionRecordEntity(
                model_version=active_meta.version,
                road_segment_id=road_segment_id,
                horizon_minutes=horizon_minutes,
                predicted_congestion=pred_cong,
                predicted_speed_kmh=pred_speed,
                explanations=[f.model_dump() for f in explanations],
                data_type="PREDICTED",
                generated_at=now
            )
            db.add(record)
            db.commit()
            db.close()
        except Exception:
            pass

        return MLPredictResponseModel(
            road_segment_id=road_segment_id,
            road_name=road_name or road_segment_id,
            horizon_minutes=horizon_minutes,
            predicted_congestion=round(pred_cong, 4),
            predicted_speed_kmh=round(pred_speed, 1),
            model_version=active_meta.version,
            generated_at=now_str,
            data_type=DataTypeEnum.PREDICTED,
            explanations=explanations
        )

prediction_service = PredictionService()
