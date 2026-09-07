import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

def test_datasets_api():
    resp = client.get("/api/datasets")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_data_quality_api():
    resp = client.get("/api/data-quality")
    assert resp.status_code == 200
    data = resp.json()
    assert "quality_score_pct" in str(data) or "average_quality_score" in data
    assert data["total_observations"] > 0

def test_ml_health_api():
    resp = client.get("/api/ml/health")
    assert resp.status_code == 200
    data = resp.json()
    assert "active_model" in data

def test_ml_predict_api():
    resp = client.post("/api/ml/predict", json={
        "road_segment_id": "R-02",
        "horizon_minutes": 15,
        "current_speed_kmh": 65.0,
        "volume_vph": 2500.0,
        "free_flow_speed_kmh": 80.0
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["road_segment_id"] == "R-02"
    assert "predicted_congestion" in data
    assert "explanations" in data

def test_dashboard_kpis():
    resp = client.get("/api/dashboard/kpis")
    assert resp.status_code == 200
    data = resp.json()
    assert "city_pressure_index" in data
