import os
import pandas as pd
from fastapi import APIRouter
from typing import Dict, Any
from backend.app.data.validation.quality_checker import QualityChecker
from backend.app.ml.drift_detector import DataDriftDetector
from backend.app.models.schemas import DataQualityReportModel

router = APIRouter(prefix="/api/data-quality", tags=["Data Quality & Integrity"])

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_datasets")

@router.get("", response_model=DataQualityReportModel)
def get_system_data_quality():
    default_csv = os.path.join(DATASETS_DIR, "urban_traffic_pems_real.csv")
    
    if not os.path.exists(default_csv):
        return DataQualityReportModel(
            total_datasets=0,
            total_observations=0,
            valid_observations=0,
            rejected_observations=0,
            average_quality_score=0.0,
            available_road_segments_count=0,
            active_road_segment_ids=[],
            time_range={"start": None, "end": None, "span_hours": 0.0},
            data_drift_detected=False,
            drift_metrics={},
            missing_value_summary={},
            last_observation_timestamp=None
        )

    df = pd.read_csv(default_csv)
    checker = QualityChecker()
    q_rep = checker.check(df)

    # Drift check comparing first half with second half of observations
    drift_det = DataDriftDetector()
    mid = len(df) // 2
    b_df = df.iloc[:mid]
    c_df = df.iloc[mid:]
    drift_res = drift_det.calculate_drift(b_df, c_df)

    return DataQualityReportModel(
        total_datasets=len([f for f in os.listdir(DATASETS_DIR) if f.endswith(".csv")]),
        total_observations=q_rep["total_rows"],
        valid_observations=q_rep["valid_rows"],
        rejected_observations=q_rep["invalid_rows"],
        average_quality_score=q_rep["quality_score_pct"],
        available_road_segments_count=q_rep["unique_road_segments"],
        active_road_segment_ids=q_rep["road_segment_ids"],
        time_range=q_rep["time_range"],
        data_drift_detected=drift_res["data_drift_detected"],
        drift_metrics=drift_res["feature_metrics"],
        missing_value_summary=q_rep["missing_values_by_column"],
        last_observation_timestamp=q_rep["time_range"]["end"]
    )
