from fastapi import APIRouter
from typing import List
from backend.app.models.schemas import VehicleModel, DeliveryRequestModel
from backend.app.core.city_twin import city_twin

router = APIRouter(prefix="/api/fleet", tags=["Fleet & Deliveries"])

@router.get("/vehicles", response_model=List[VehicleModel])
def list_vehicles():
    return list(city_twin.vehicles.values())

@router.get("/deliveries", response_model=List[DeliveryRequestModel])
def list_deliveries():
    return list(city_twin.deliveries.values())
