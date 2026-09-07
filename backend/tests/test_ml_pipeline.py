import os
import pandas as pd
import pytest
from backend.app.ml.pipeline import MLDataPipeline
from backend.app.ml.trainer import ModelTrainer
from backend.app.ml.registry import model_registry
from backend.app.ml.predictor import prediction_service

def test_ml_pipeline_execution():
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "app", "data", "sample_datasets", "urban_traffic_pems_real.csv"
    )
    df = pd.read_csv(csv_path)
    pipeline = MLDataPipeline(min_samples_required=50)
    split_datasets, active_feats, meta = pipeline.prepare_training_dataset(df.iloc[:800], horizons=["15m", "30m"])
    assert "15m" in split_datasets
    assert len(active_feats) > 0
    X_train, y_train, X_val, y_val, X_test, y_test = split_datasets["15m"]
    assert len(X_train) > 0
    assert len(X_test) > 0
    assert len(X_train) > len(X_test)

def test_model_training_and_metrics():
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "app", "data", "sample_datasets", "urban_traffic_pems_real.csv"
    )
    df = pd.read_csv(csv_path)
    pipeline = MLDataPipeline(min_samples_required=50)
    split_datasets, active_feats, meta = pipeline.prepare_training_dataset(df.iloc[:1000], horizons=["15m"])
    trainer = ModelTrainer()
    pack = trainer.train_and_evaluate(split_datasets, active_feats, candidate_model_names=["RandomForest", "HistGradientBoosting"])
    assert "trained_models" in pack
    assert "15m" in pack["evaluation_results"]
    best = pack["primary_metrics"]
    assert best["r2"] > 0.50
    assert best["mae"] >= 0.0

def test_prediction_service():
    res = prediction_service.predict_road_congestion(
        road_segment_id="R-01",
        horizon_minutes=15,
        current_speed_kmh=28.0,
        volume_vph=1600.0,
        free_flow_speed_kmh=50.0
    )
    assert res.road_segment_id == "R-01"
    assert 0.0 <= res.predicted_congestion <= 1.0
    assert res.predicted_speed_kmh > 0
    assert len(res.explanations) > 0
