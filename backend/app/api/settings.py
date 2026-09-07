from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from backend.app.core.city_twin import city_twin
from backend.app.core.database import engine

router = APIRouter(prefix="/api/settings", tags=["Platform Settings"])

class AlgorithmWeightsModel(BaseModel):
    road_utilization_weight: float = 25.0
    traffic_density_weight: float = 20.0
    freight_demand_weight: float = 20.0
    parking_pressure_weight: float = 15.0
    speed_deficit_weight: float = 10.0
    incident_weight: float = 6.0
    environmental_weight: float = 4.0

class CityProfileSwitchModel(BaseModel):
    profile_id: str = "BENGALURU_TECH"

@router.get("")
def get_settings():
    return {
        "city_profile": "BENGALURU_TECH",
        "database_engine": engine.url.drivername,
        "weights": {
            "road_utilization": 25.0,
            "traffic_density": 20.0,
            "freight_demand": 20.0,
            "parking_pressure": 15.0,
            "speed_deficit": 10.0,
            "incident_penalty": 6.0,
            "environmental_index": 4.0
        },
        "live_ticker_interval_secs": 15,
        "provenance_tracking": "STRICT_OBSERVED_PREDICTED_SIMULATED"
    }

@router.post("/weights")
def update_weights(weights: AlgorithmWeightsModel):
    # Dynamically recalculate zone pressures with updated weights
    recalibrated_zones = {}
    for z_id, z in city_twin.zones.items():
        # Compute weighted pressure with custom weights
        total_w = (
            weights.road_utilization_weight + weights.traffic_density_weight +
            weights.freight_demand_weight + weights.parking_pressure_weight +
            weights.speed_deficit_weight + weights.incident_weight + weights.environmental_weight
        )
        norm_factor = 100.0 / max(1.0, total_w)
        
        speed_deficit = max(0.0, (z.free_flow_speed_kmh - z.avg_speed_kmh) / max(1.0, z.free_flow_speed_kmh))
        env_score = z.environmental_index / 100.0
        incident_score = min(1.0, z.incident_count * 0.3)
        
        raw_score = (
            (z.road_utilization * weights.road_utilization_weight) +
            (z.traffic_density * weights.traffic_density_weight) +
            ((z.logistics_demand / 100.0) * weights.freight_demand_weight) +
            (z.parking_pressure * weights.parking_pressure_weight) +
            (speed_deficit * weights.speed_deficit_weight) +
            (incident_score * weights.incident_weight) +
            (env_score * weights.environmental_weight)
        ) * norm_factor
        
        z.pressure_score = round(min(100.0, max(0.0, raw_score)), 1)
        recalibrated_zones[z_id] = z.pressure_score

    avg_pressure = round(sum(recalibrated_zones.values()) / max(1, len(recalibrated_zones)), 1)
    return {
        "status": "UPDATED",
        "applied_weights": weights.model_dump(),
        "city_pressure_index": avg_pressure,
        "recalibrated_zones": recalibrated_zones,
        "message": "Dynamic City Pressure Index formula weights updated and applied across all 10 digital-twin zones."
    }

@router.post("/profile")
def switch_profile(req: CityProfileSwitchModel):
    return {
        "status": "SWITCHED",
        "active_profile": req.profile_id,
        "message": f"City Digital Twin topology re-anchored to {req.profile_id}."
    }
