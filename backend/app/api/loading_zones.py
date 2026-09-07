from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from backend.app.models.schemas import LoadingZoneModel
from backend.app.core.city_twin import city_twin

router = APIRouter(prefix="/api/loading-zones", tags=["Loading Zones"])

@router.get("", response_model=List[LoadingZoneModel])
def list_loading_zones():
    return list(city_twin.loading_zones.values())

@router.get("/nearest")
def get_nearest_loading_zone(
    lat: float = Query(..., description="Target Latitude"),
    lng: float = Query(..., description="Target Longitude"),
    zone_id: str = Query(None, description="Optional Zone ID filter")
) -> Dict[str, Any]:
    lz = city_twin.find_nearest_loading_zone([lat, lng], zone_id)
    if not lz:
        raise HTTPException(status_code=404, detail="No loading zones available")

    walking_distance = city_twin.compute_walking_distance_meters([lat, lng], lz.location)
    walking_time_mins = round(walking_distance / 80.0, 1) # ~4.8 km/h pedestrian speed

    return {
        "loading_zone": lz,
        "walking_distance_meters": walking_distance,
        "walking_time_mins": walking_time_mins,
        "availability_status": "AVAILABLE" if lz.available_bays > 0 else "QUEUED",
        "conflict_prevention_check": "PASS_CLEARED" if lz.available_bays > 0 else "STAGGER_REQUIRED"
    }
