from fastapi import APIRouter
from typing import Dict, Any
from backend.app.simulation.demo_scenario import demo_runner

router = APIRouter(prefix="/api/demo", tags=["Demo Mode"])

@router.post("/run-surge", response_model=Dict[str, Any])
def run_evening_surge_demo():
    return demo_runner.run_evening_surge_demo()
