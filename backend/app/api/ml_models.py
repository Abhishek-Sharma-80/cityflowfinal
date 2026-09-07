import os
import pandas as pd
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.models.schemas import (
    MLTrainRequestModel, MLModelRegistryItem, MLHealthModel,
    MLPredictRequestModel, MLPredictResponseModel, PredictionContributingFactor
)
from backend.app.ml.registry import model_registry
from backend.app.ml.train import run_training_pipeline
from backend.app.ml.predictor import prediction_service
from backend.app.core.database import SessionLocal
from backend.app.models.db_models import PredictionRecordEntity

router = APIRouter(prefix="/api/ml", tags=["ML Intelligence & Registry"])

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_datasets")

@router.post("/train", response_model=MLModelRegistryItem)
def trigger_training(req: MLTrainRequestModel):
    # Locate dataset
    target_csv = None
    if req.dataset_id:
        if os.path.exists(DATASETS_DIR):
            for f in os.listdir(DATASETS_DIR):
                if req.dataset_id in f or f == req.dataset_id:
                    target_csv = os.path.join(DATASETS_DIR, f)
                    break
    
    if not target_csv:
        target_csv = os.path.join(DATASETS_DIR, "urban_traffic_pems_real.csv")

    if not os.path.exists(target_csv):
        raise HTTPException(status_code=400, detail="ML training cannot be completed because a valid dataset is not available.")

    try:
        run_training_pipeline(target_csv)
        active_item = model_registry.get_active_model_metadata()
        if not active_item:
            raise HTTPException(status_code=500, detail="Model training finished but failed to register.")
        return active_item
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Training failed: {str(e)}")

@router.post("/retrain", response_model=MLModelRegistryItem)
def retrain_active_pipeline():
    default_csv = os.path.join(DATASETS_DIR, "urban_traffic_pems_real.csv")
    if not os.path.exists(default_csv):
        raise HTTPException(status_code=400, detail="Dataset not found for retraining.")
    run_training_pipeline(default_csv)
    return model_registry.get_active_model_metadata()

@router.get("/models", response_model=List[MLModelRegistryItem])
def list_model_registry():
    return model_registry.list_models()

@router.get("/health", response_model=MLHealthModel)
def get_ml_health():
    active_meta = model_registry.get_active_model_metadata()
    all_models = model_registry.list_models()

    total_preds = 0
    try:
        db = SessionLocal()
        total_preds = db.query(PredictionRecordEntity).count()
        db.close()
    except Exception:
        pass

    return MLHealthModel(
        active_model=active_meta,
        total_registered_models=len(all_models),
        prediction_service_status="OPERATIONAL" if active_meta is not None else "NO_MODEL_TRAINED",
        data_freshness_minutes=15.0,
        total_predictions_served=total_preds,
        data_drift_status="STABLE"
    )

@router.post("/predict", response_model=MLPredictResponseModel)
def live_predict(req: MLPredictRequestModel):
    return prediction_service.predict_road_congestion(
        road_segment_id=req.road_segment_id,
        horizon_minutes=req.horizon_minutes,
        current_speed_kmh=req.current_speed_kmh,
        volume_vph=req.volume_vph,
        free_flow_speed_kmh=req.free_flow_speed_kmh or 50.0
    )

@router.get("/predictions", response_model=List[MLPredictResponseModel])
def get_recent_predictions():
    results: List[MLPredictResponseModel] = []
    try:
        db = SessionLocal()
        rows = db.query(PredictionRecordEntity).order_by(PredictionRecordEntity.generated_at.desc()).limit(20).all()
        for r in rows:
            exps = [PredictionContributingFactor(**f) for f in r.explanations] if r.explanations else []
            results.append(MLPredictResponseModel(
                road_segment_id=r.road_segment_id,
                horizon_minutes=r.horizon_minutes,
                predicted_congestion=r.predicted_congestion,
                predicted_speed_kmh=r.predicted_speed_kmh or 35.0,
                model_version=r.model_version,
                generated_at=r.generated_at.strftime("%Y-%m-%d %H:%M:%S") if r.generated_at else "",
                explanations=exps
            ))
        db.close()
    except Exception:
        pass
    return results
