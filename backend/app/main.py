import asyncio
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.city_twin import city_twin
from backend.app.core.database import Base, engine
from backend.app.ml.registry import model_registry
from backend.app.api import (
    dashboard, zones, fleet, routing, delivery_slots,
    loading_zones, predictions, simulator, emergency,
    recommendations, demo, datasets, data_quality, ml_models, settings,
    v1_routes
)
from backend.app.api import live as live_router

# Initialize database schema tables
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

async def _city_ticker():
    """Background task: evolves city state every 15 seconds."""
    while True:
        await asyncio.sleep(15)
        try:
            city_twin.tick()
        except Exception:
            pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_city_ticker())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title="CityFlow AI - Urban Logistics & Digital-Twin Platform",
    description="Production-grade Urban Digital-Twin, End-to-End Machine Learning Platform, Dynamic Slot Allocation & Multi-Objective Routing — SIH 2026.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(zones.router)
app.include_router(fleet.router)
app.include_router(routing.router)
app.include_router(delivery_slots.router)
app.include_router(loading_zones.router)
app.include_router(predictions.router)
app.include_router(simulator.router)
app.include_router(emergency.router)
app.include_router(recommendations.router)
app.include_router(demo.router)
app.include_router(datasets.router)
app.include_router(data_quality.router)
app.include_router(ml_models.router)
app.include_router(settings.router)
app.include_router(live_router.router)
app.include_router(v1_routes.router)

@app.get("/")
def root():
    return {
        "platform": "CityFlow AI Digital-Twin & ML Intelligence Platform",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "live_tick": city_twin.tick_count,
        "docs_url": "/docs",
    }

@app.get("/health")
def health_check():
    active_meta = model_registry.get_active_model_metadata()
    return {
        "status": "healthy",
        "backend": "healthy",
        "database": "healthy",
        "database_engine": engine.url.drivername,
        "ml_model": "active" if active_meta is not None else "no_model_trained",
        "active_model_version": active_meta.version if active_meta else None,
        "test_r2": active_meta.test_r2 if active_meta else None,
        "tick_count": city_twin.tick_count,
        "zones_count": len(city_twin.zones),
        "roads_count": len(city_twin.roads),
        "vehicles_count": len(city_twin.vehicles),
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%SZ")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8001, reload=True)
