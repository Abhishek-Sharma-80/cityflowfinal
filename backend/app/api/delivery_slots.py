from fastapi import APIRouter
from backend.app.models.schemas import SlotOptimizationResult
from backend.app.optimization.slot_optimizer import slot_optimizer

router = APIRouter(prefix="/api/slots", tags=["Delivery Slots"])

@router.get("/optimize", response_model=SlotOptimizationResult)
def get_optimized_delivery_slots():
    return slot_optimizer.optimize_delivery_schedule()
