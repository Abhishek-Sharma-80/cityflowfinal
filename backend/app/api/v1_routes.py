from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List
import asyncio
import json
from datetime import datetime
from backend.app.core.city_twin import city_twin
from backend.app.models.schemas import WhatIfScenarioInput, SimulationResultModel, ZoneModel, VehicleModel
from backend.app.simulation.simulator import simulator_engine
from backend.app.api.settings import AlgorithmWeightsModel, update_weights

router = APIRouter(tags=["SIH V1 & Telemetry Endpoints"])

@router.post("/api/v1/recalibrate")
def recalibrate_weights_v1(weights: AlgorithmWeightsModel):
    """Dynamic recalibration of City Pressure Index algorithm weights."""
    return update_weights(weights)

@router.get("/api/telemetry/fleet", response_model=List[VehicleModel])
def get_telemetry_fleet():
    """Real-time dynamic telemetry feed for active logistics & emergency fleet."""
    return list(city_twin.vehicles.values())

@router.get("/api/gis/zones", response_model=List[ZoneModel])
def get_gis_zones():
    """Real-time GIS digital twin sector boundaries, coordinates, and pressure indices."""
    return list(city_twin.zones.values())

@router.post("/api/simulator/shockwave", response_model=SimulationResultModel)
def run_shockwave_simulator(scenario: WhatIfScenarioInput):
    """Run mathematical shockwave propagation simulation across all digital-twin sectors."""
    return simulator_engine.run_scenario(scenario)

@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """High-frequency (10Hz-100Hz capable) WebSocket telemetry stream for vehicles and city telemetry."""
    await websocket.accept()
    try:
        while True:
            # Broadcast dynamic vehicle positions, dwell times, and city pressure
            telemetry_payload = {
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3],
                "tick_count": getattr(city_twin, "tick_count", 0),
                "is_emergency_active": city_twin.is_emergency_active,
                "city_pressure_index": round(sum(z.pressure_score for z in city_twin.zones.values()) / max(1, len(city_twin.zones)), 1),
                "vehicles": [
                    {
                        "id": v.id,
                        "callsign": v.callsign,
                        "type": v.type,
                        "lat": round(v.lat, 6),
                        "lng": round(v.lng, 6),
                        "speed_kmh": round(v.current_speed_kmh, 1),
                        "battery_pct": round(v.battery_pct, 1),
                        "fuel_pct": round(v.fuel_pct, 1),
                        "status": v.status,
                        "current_zone_id": v.current_zone_id,
                        "dwell_time_mins": v.dwell_time_mins
                    }
                    for v in list(city_twin.vehicles.values())[:30]
                ],
                "zones_pressure": {
                    z.id: {
                        "name": z.name,
                        "pressure_score": round(z.pressure_score, 1),
                        "avg_speed_kmh": round(z.avg_speed_kmh, 1),
                        "traffic_density": round(z.traffic_density, 3)
                    }
                    for z in city_twin.zones.values()
                }
            }
            await websocket.send_text(json.dumps(telemetry_payload))
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
