import os
import pandas as pd
import pytest
from backend.app.data.ingestion.csv_connector import CSVConnector
from backend.app.data.validation.schema_validator import SchemaValidator
from backend.app.data.validation.quality_checker import QualityChecker
from backend.app.data.preprocessing.cleaner import DataCleaner

def test_csv_connector():
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "app", "data", "sample_datasets", "urban_traffic_pems_real.csv"
    )
    connector = CSVConnector(file_path=csv_path)
    df = connector.fetch()
    assert len(df) > 0
    assert "road_segment_id" in df.columns
    assert "volume_vph" in df.columns

def test_schema_validator():
    validator = SchemaValidator()
    valid_df = pd.DataFrame({
        "timestamp": ["2026-03-01 10:00:00"],
        "road_segment_id": ["R-01"],
        "volume_vph": [1500.0],
        "current_speed_kmh": [40.0]
    })
    is_valid, errors, info = validator.validate(valid_df)
    assert is_valid is True
    assert len(errors) == 0

    invalid_df = pd.DataFrame({"random_col": [1, 2, 3]})
    is_valid_inv, errors_inv, _ = validator.validate(invalid_df)
    assert is_valid_inv is False
    assert len(errors_inv) > 0

def test_quality_checker():
    checker = QualityChecker()
    df = pd.DataFrame({
        "timestamp": ["2026-03-01 10:00:00", "2026-03-01 10:15:00"],
        "road_segment_id": ["R-01", "R-01"],
        "volume_vph": [1200.0, 1400.0],
        "current_speed_kmh": [45.0, 42.0]
    })
    rep = checker.check(df)
    assert rep["total_rows"] == 2
    assert rep["quality_score_pct"] > 80.0
    assert rep["duplicate_count"] == 0

def test_data_cleaner():
    cleaner = DataCleaner()
    dirty_df = pd.DataFrame({
        "timestamp": ["2026-03-01 10:00:00", "2026-03-01 10:00:00", "invalid_ts"],
        "road_segment_id": ["R-01", "R-01", "R-02"],
        "volume_vph": [1000.0, 1000.0, None],
        "current_speed_kmh": [40.0, 40.0, 30.0]
    })
    cleaned, final_count, dropped = cleaner.clean(dirty_df)
    assert final_count == 1
    assert dropped == 2
