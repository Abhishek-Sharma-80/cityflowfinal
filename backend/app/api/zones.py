from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.models.schemas import ZoneModel, RoadSegmentModel, IncidentModel
from backend.app.core.city_twin import city_twin

router = APIRouter(prefix="/api/zones", tags=["Zones"])

@router.get("", response_model=List[ZoneModel])
def list_zones():
    return list(city_twin.zones.values())

@router.get("/roads", response_model=List[RoadSegmentModel])
def list_roads():
    return list(city_twin.roads.values())

@router.get("/incidents", response_model=List[IncidentModel])
def list_incidents():
    return list(city_twin.incidents.values())

@router.get("/{zone_id}", response_model=ZoneModel)
def get_zone(zone_id: str):
    if zone_id not in city_twin.zones:
        raise HTTPException(status_code=404, detail="Zone not found")
    return city_twin.zones[zone_id]
