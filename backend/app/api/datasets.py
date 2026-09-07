import os
import shutil
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.data.validation.schema_validator import SchemaValidator
from backend.app.data.validation.quality_checker import QualityChecker
from backend.app.data.validation.anomaly_detector import AnomalyDetector
from backend.app.models.schemas import DatasetSummaryModel
from backend.app.core.database import SessionLocal
from backend.app.models.db_models import DatasetEntity

router = APIRouter(prefix="/api/datasets", tags=["Dataset Manager"])

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_datasets")
os.makedirs(DATASETS_DIR, exist_ok=True)

@router.post("/upload", response_model=DatasetSummaryModel)
async def upload_dataset(file: UploadFile = File(...)):
    filename = file.filename
    if not (filename.endswith(".csv") or filename.endswith(".json")):
        raise HTTPException(status_code=400, detail="Only CSV and JSON datasets are supported.")

    file_id = f"DS-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    saved_path = os.path.join(DATASETS_DIR, f"{file_id}_{filename}")

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read and validate
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(saved_path)
        else:
            df = pd.read_json(saved_path)
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    validator = SchemaValidator()
    is_valid, errors, schema_info = validator.validate(df)

    checker = QualityChecker()
    q_rep = checker.check(df)

    # Store in DB
    try:
        db = SessionLocal()
        entity = DatasetEntity(
            id=file_id,
            source_id="USER_UPLOAD",
            filename=filename,
            row_count=q_rep["total_rows"],
            valid_rows=q_rep["valid_rows"],
            invalid_rows=q_rep["invalid_rows"],
            quality_score_pct=q_rep["quality_score_pct"],
            time_range_start=pd.to_datetime(q_rep["time_range"]["start"]) if q_rep["time_range"]["start"] else None,
            time_range_end=pd.to_datetime(q_rep["time_range"]["end"]) if q_rep["time_range"]["end"] else None,
            features=list(df.columns),
            schema_info=schema_info,
            status=q_rep["status"],
            storage_path=saved_path,
            created_at=datetime.utcnow()
        )
        db.add(entity)
        db.commit()
        db.close()
    except Exception:
        pass

    return DatasetSummaryModel(
        dataset_id=file_id,
        source_id="USER_UPLOAD",
        filename=filename,
        row_count=q_rep["total_rows"],
        valid_rows=q_rep["valid_rows"],
        invalid_rows=q_rep["invalid_rows"],
        quality_score_pct=q_rep["quality_score_pct"],
        time_range_start=q_rep["time_range"]["start"],
        time_range_end=q_rep["time_range"]["end"],
        span_hours=q_rep["time_range"]["span_hours"],
        features=list(df.columns),
        status=q_rep["status"],
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )

@router.get("", response_model=List[DatasetSummaryModel])
def list_datasets():
    datasets: List[DatasetSummaryModel] = []

    # Check database
    try:
        db = SessionLocal()
        rows = db.query(DatasetEntity).order_by(DatasetEntity.created_at.desc()).all()
        if rows:
            for r in rows:
                datasets.append(DatasetSummaryModel(
                    dataset_id=r.id,
                    source_id=r.source_id,
                    filename=r.filename,
                    row_count=r.row_count,
                    valid_rows=r.valid_rows,
                    invalid_rows=r.invalid_rows,
                    quality_score_pct=r.quality_score_pct,
                    time_range_start=r.time_range_start.strftime("%Y-%m-%d %H:%M:%S") if r.time_range_start else None,
                    time_range_end=r.time_range_end.strftime("%Y-%m-%d %H:%M:%S") if r.time_range_end else None,
                    span_hours=round(((r.time_range_end - r.time_range_start).total_seconds() / 3600.0), 2) if r.time_range_start and r.time_range_end else 0.0,
                    features=r.features if isinstance(r.features, list) else [],
                    status=r.status,
                    created_at=r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else ""
                ))
        db.close()
    except Exception:
        pass

    # If no DB rows, inspect sample_datasets folder directly
    if not datasets and os.path.exists(DATASETS_DIR):
        for f in os.listdir(DATASETS_DIR):
            if f.endswith(".csv"):
                f_path = os.path.join(DATASETS_DIR, f)
                try:
                    df = pd.read_csv(f_path)
                    checker = QualityChecker()
                    q = checker.check(df)
                    datasets.append(DatasetSummaryModel(
                        dataset_id=f"DS-{f}",
                        source_id="PRE_LOADED_BENCHMARK",
                        filename=f,
                        row_count=q["total_rows"],
                        valid_rows=q["valid_rows"],
                        invalid_rows=q["invalid_rows"],
                        quality_score_pct=q["quality_score_pct"],
                        time_range_start=q["time_range"]["start"],
                        time_range_end=q["time_range"]["end"],
                        span_hours=q["time_range"]["span_hours"],
                        features=list(df.columns),
                        status=q["status"],
                        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                    ))
                except Exception:
                    pass

    return datasets

@router.get("/{dataset_id}/quality")
def get_dataset_quality_audit(dataset_id: str):
    # Find dataset file
    target_path = None
    if os.path.exists(DATASETS_DIR):
        for f in os.listdir(DATASETS_DIR):
            if dataset_id in f or f == dataset_id:
                target_path = os.path.join(DATASETS_DIR, f)
                break

    if not target_path:
        # Fallback to default benchmark
        target_path = os.path.join(DATASETS_DIR, "urban_traffic_pems_real.csv")

    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="Dataset file not found.")

    df = pd.read_csv(target_path)
    checker = QualityChecker()
    q_rep = checker.check(df)

    anomaly_det = AnomalyDetector()
    a_rep = anomaly_det.detect_anomalies(df)

    return {
        "dataset_id": dataset_id,
        "filename": os.path.basename(target_path),
        "quality_overview": q_rep,
        "anomaly_audit": a_rep
    }
