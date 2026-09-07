from fastapi import APIRouter
from typing import Dict, Any
from backend.app.models.schemas import EmergencyRequestInput, EmergencyCorridorResponse
from backend.app.simulation.emergency_controller import emergency_controller

router = APIRouter(prefix="/api/emergency", tags=["Emergency Corridor"])

@router.post("/activate", response_model=EmergencyCorridorResponse)
def activate_emergency_corridor(req: EmergencyRequestInput):
    return emergency_controller.activate_emergency_corridor(req)

@router.post("/clear")
@router.post("/deactivate")
def deactivate_emergency_corridor() -> Dict[str, Any]:
    return emergency_controller.deactivate_emergency_corridor()

@router.get("/status")
def get_emergency_status() -> Dict[str, Any]:
    return {
        "active": emergency_controller.active_corridor is not None,
        "corridor": emergency_controller.active_corridor
    }
