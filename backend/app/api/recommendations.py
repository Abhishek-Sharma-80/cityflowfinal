from fastapi import APIRouter
from typing import List
from backend.app.models.schemas import InfraRecommendationModel
from backend.app.analytics.infra_recommender import infra_engine

router = APIRouter(prefix="/api/recommendations", tags=["Infrastructure Recommendations"])

@router.get("", response_model=List[InfraRecommendationModel])
def list_infrastructure_recommendations():
    return infra_engine.generate_recommendations()
