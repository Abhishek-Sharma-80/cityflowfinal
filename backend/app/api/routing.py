from fastapi import APIRouter, Query
from typing import List, Optional
from backend.app.models.schemas import RouteOptionModel, VehicleType
from backend.app.optimization.routing_engine import routing_engine

router = APIRouter(prefix="/api/routes", tags=["Route Optimization"])

@router.get("/optimize", response_model=List[RouteOptionModel])
def optimize_route(
    origin: str = Query("Z-04", description="Origin Zone ID"),
    destination: str = Query("Z-01", description="Destination Zone ID"),
    vehicle_type: VehicleType = Query(VehicleType.ELECTRIC_VAN, description="Vehicle Type"),
    cargo_weight_kg: float = Query(250.0, description="Payload weight in kg")
):
    return routing_engine.compute_all_modes(
        origin_zone_id=origin,
        destination_zone_id=destination,
        vehicle_type=vehicle_type,
        cargo_weight_kg=cargo_weight_kg
    )
