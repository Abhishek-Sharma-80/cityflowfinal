from fastapi import APIRouter
from backend.app.models.schemas import WhatIfScenarioInput, SimulationResultModel
from backend.app.simulation.simulator import simulator_engine

router = APIRouter(prefix="/api/simulator", tags=["What-If Simulator"])

@router.post("/run", response_model=SimulationResultModel)
def run_simulation(scenario: WhatIfScenarioInput):
    return simulator_engine.run_scenario(scenario)
