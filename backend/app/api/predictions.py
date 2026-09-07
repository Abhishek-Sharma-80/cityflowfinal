from fastapi import APIRouter
from typing import List
from backend.app.models.schemas import ZonePredictionModel
from backend.app.core.city_twin import city_twin
from backend.app.ml.congestion_model import congestion_ml_predictor

router = APIRouter(prefix="/api/predictions", tags=["AI Predictions"])

@router.get("/congestion", response_model=List[ZonePredictionModel])
def get_all_zone_predictions():
    results: List[ZonePredictionModel] = []
    for z in city_twin.zones.values():
        pred = congestion_ml_predictor.predict_zone_congestion(
            zone_id=z.id,
            zone_name=z.name,
            current_congestion=z.road_utilization,
            traffic_density=z.traffic_density,
            logistics_demand=z.logistics_demand,
            parking_pressure=z.parking_pressure,
            incident_count=z.incident_count,
            hour=17,
            day_of_week=3,
            rain_mm=0.0,
            event_active=(z.id in ["Z-01", "Z-02"])
        )
        results.append(pred)
    return results

@router.get("/congestion/{zone_id}", response_model=ZonePredictionModel)
def get_single_zone_prediction(zone_id: str):
    z = city_twin.zones.get(zone_id)
    if not z:
        z = list(city_twin.zones.values())[0]
    return congestion_ml_predictor.predict_zone_congestion(
        zone_id=z.id,
        zone_name=z.name,
        current_congestion=z.road_utilization,
        traffic_density=z.traffic_density,
        logistics_demand=z.logistics_demand,
        parking_pressure=z.parking_pressure,
        incident_count=z.incident_count,
        hour=17,
        day_of_week=3,
        rain_mm=0.0,
        event_active=(z.id in ["Z-01", "Z-02"])
    )
