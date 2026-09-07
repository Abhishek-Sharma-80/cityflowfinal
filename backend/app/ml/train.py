import os
import sys
import pandas as pd
from datetime import datetime

# Configure utf-8 stdout for Windows consoles if needed
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.app.data.validation.schema_validator import SchemaValidator
from backend.app.data.validation.quality_checker import QualityChecker
from backend.app.ml.pipeline import MLDataPipeline
from backend.app.ml.trainer import ModelTrainer
from backend.app.ml.registry import model_registry

def run_training_pipeline(csv_path: str = None) -> dict:
    if csv_path is None:
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data", "sample_datasets", "urban_traffic_pems_real.csv"
        )

    print("=" * 60)
    print("CITYFLOW AI - PRODUCTION ML MODEL TRAINING PIPELINE")
    print("=" * 60)

    if not os.path.exists(csv_path):
        print(f"[FAIL] Dataset not found at: {csv_path}")
        sys.exit(1)

    # 1. Load Dataset
    print(f"[*] Loading dataset: {os.path.basename(csv_path)}...")
    df = pd.read_csv(csv_path)
    print(f"    Raw records loaded: {len(df):,} rows")

    # 2. Validate Dataset
    print("[*] Validating schema and data quality...")
    validator = SchemaValidator()
    is_valid, errors, schema_info = validator.validate(df)
    if not is_valid:
        print(f"[FAIL] Schema validation failed: {errors}")
        sys.exit(1)

    checker = QualityChecker()
    quality_report = checker.check(df)
    print(f"    Data Quality Score: {quality_report['quality_score_pct']}% | Valid: {quality_report['valid_rows']} | Invalid: {quality_report['invalid_rows']}")
    print(f"    Time Range: {quality_report['time_range']['start']} to {quality_report['time_range']['end']} ({quality_report['time_range']['span_hours']} hrs)")
    print(f"    Road Segments: {quality_report['unique_road_segments']} active monitored corridors")

    # 3. Build Training Pairs & Features
    print("[*] Engineering dynamic features & chronological target pairing...")
    pipeline = MLDataPipeline(min_samples_required=150)
    split_datasets, active_features, meta = pipeline.prepare_training_dataset(df, horizons=["15m", "30m", "60m"])
    print(f"    Active features detected ({len(active_features)}): {', '.join(active_features[:6])}...")
    print(f"    Horizons generated: {', '.join(meta['horizons_generated'])}")

    # 4. Train Candidate Models
    print("[*] Training candidate models on chronological splits (Train: 70%, Val: 15%, Test: 15%)...")
    trainer = ModelTrainer()
    pipeline_pack = trainer.train_and_evaluate(
        split_datasets=split_datasets,
        active_features=active_features,
        candidate_model_names=["RandomForest", "GradientBoosting", "HistGradientBoosting"]
    )

    eval_results = pipeline_pack["evaluation_results"]
    primary_h = "15m"
    print("\n" + "-" * 60)
    print(f"CANDIDATE MODEL EVALUATION (Primary Horizon: {primary_h})")
    print("-" * 60)
    for cand in eval_results[primary_h]["candidates"]:
        star = " * [BEST]" if cand["is_best"] else ""
        print(f"  * {cand['model_name']:<22} | MAE: {cand['mae']:.4f} | RMSE: {cand['rmse']:.4f} | R2: {cand['r2']:.4f}{star}")

    # 5. Register Best Model Pipeline
    print("-" * 60)
    print("[*] Registering best model artifact in Model Registry...")
    reg_item = model_registry.register_trained_pipeline(
        pipeline_pack=pipeline_pack,
        dataset_id=os.path.basename(csv_path),
        target_variable="future_congestion"
    )

    print(f"\n[OK] MODEL REGISTERED SUCCESSFULLY!")
    print(f"    Version:          {reg_item.version}")
    print(f"    Model Type:       {reg_item.model_type}")
    print(f"    Status:           {reg_item.status}")
    print(f"    Test MAE:         {reg_item.test_mae:.4f}")
    print(f"    Test RMSE:        {reg_item.test_rmse:.4f}")
    print(f"    Test R2:          {reg_item.test_r2:.4f}")
    print(f"    Training Samples: {reg_item.training_samples:,}")
    print(f"    Test Samples:     {reg_item.test_samples:,}")
    print("=" * 60)

    return {
        "dataset": os.path.basename(csv_path),
        "version": reg_item.version,
        "best_model": reg_item.model_type,
        "test_mae": reg_item.test_mae,
        "test_rmse": reg_item.test_rmse,
        "test_r2": reg_item.test_r2,
        "status": reg_item.status
    }

if __name__ == "__main__":
    run_training_pipeline()
