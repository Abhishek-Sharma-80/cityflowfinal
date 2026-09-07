from fastapi import APIRouter
from backend.app.core.city_twin import city_twin
from datetime import datetime

router = APIRouter(prefix="/api/live", tags=["Live Data"])

@router.get("/snapshot")
def get_live_snapshot():
    """Lightweight live snapshot of evolving city state for frontend polling."""
    zones_snapshot = [
        {
            "id": z.id,
            "pressure_score": round(z.pressure_score, 1),
            "pressure_class": z.pressure_class,
            "traffic_density": round(z.traffic_density, 3),
            "road_utilization": round(z.road_utilization, 3),
            "avg_speed_kmh": round(z.avg_speed_kmh, 1),
            "active_deliveries": z.active_deliveries,
            "active_vehicles": z.active_vehicles,
        }
        for z in city_twin.zones.values()
    ]

    vehicles_snapshot = [
        {
            "id": v.id,
            "lat": round(v.lat, 6),
            "lng": round(v.lng, 6),
            "status": v.status,
            "speed_kmh": round(v.current_speed_kmh, 1),
        }
        for v in list(city_twin.vehicles.values())[:20]
    ]

    roads_snapshot = [
        {
            "id": r.id,
            "congestion_level": round(r.congestion_level, 3),
            "current_speed_kmh": round(r.current_speed_kmh, 1),
            "status": r.status,
        }
        for r in city_twin.roads.values()
    ]

    total_pressure = sum(z.pressure_score for z in city_twin.zones.values())
    zone_count = max(len(city_twin.zones), 1)

    return {
        "timestamp": datetime.now().isoformat(),
        "tick_count": getattr(city_twin, "tick_count", 0),
        "is_emergency_active": city_twin.is_emergency_active,
        "zones": zones_snapshot,
        "vehicles": vehicles_snapshot,
        "roads": roads_snapshot,
        "city_pressure_index": round(total_pressure / zone_count, 1),
    }

@router.get("/status")
def get_live_status():
    return {
        "status": "LIVE",
        "tick_count": getattr(city_twin, "tick_count", 0),
        "zones_count": len(city_twin.zones),
        "vehicles_count": len(city_twin.vehicles),
        "is_emergency_active": city_twin.is_emergency_active,
    }

