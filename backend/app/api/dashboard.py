from fastapi import APIRouter
from typing import Dict, Any, List
from backend.app.models.schemas import KPIDashboardModel
from backend.app.analytics.dashboard_kpi import kpi_aggregator

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/kpis", response_model=KPIDashboardModel)
def get_dashboard_kpis():
    return kpi_aggregator.compute_kpis()

@router.get("/trends")
def get_dashboard_trends() -> Dict[str, Any]:
    hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
    return {
        "traffic_trend": [
            {"time": "08:00", "traffic_volume": 1420, "congestion_index": 55, "avg_speed": 32},
            {"time": "10:00", "traffic_volume": 2840, "congestion_index": 82, "avg_speed": 18},
            {"time": "12:00", "traffic_volume": 2100, "congestion_index": 64, "avg_speed": 26},
            {"time": "14:00", "traffic_volume": 1950, "congestion_index": 58, "avg_speed": 29},
            {"time": "16:00", "traffic_volume": 2650, "congestion_index": 76, "avg_speed": 21},
            {"time": "18:00", "traffic_volume": 3400, "congestion_index": 92, "avg_speed": 12},
            {"time": "20:00", "traffic_volume": 2200, "congestion_index": 68, "avg_speed": 25},
            {"time": "22:00", "traffic_volume": 1200, "congestion_index": 38, "avg_speed": 40},
        ],
        "logistics_demand_trend": [
            {"time": "08:00", "parcel_orders": 310, "freight_trucks": 42},
            {"time": "10:00", "parcel_orders": 740, "freight_trucks": 95},
            {"time": "12:00", "parcel_orders": 890, "freight_trucks": 120},
            {"time": "14:00", "parcel_orders": 620, "freight_trucks": 85},
            {"time": "16:00", "parcel_orders": 1050, "freight_trucks": 140},
            {"time": "18:00", "parcel_orders": 1480, "freight_trucks": 190},
            {"time": "20:00", "parcel_orders": 920, "freight_trucks": 110},
            {"time": "22:00", "parcel_orders": 410, "freight_trucks": 50},
        ],
        "co2_savings_trend": [
            {"time": "08:00", "co2_saved_kg": 42.0, "fuel_saved_l": 15.6},
            {"time": "10:00", "co2_saved_kg": 118.0, "fuel_saved_l": 44.0},
            {"time": "12:00", "co2_saved_kg": 185.0, "fuel_saved_l": 69.0},
            {"time": "14:00", "co2_saved_kg": 230.0, "fuel_saved_l": 85.8},
            {"time": "16:00", "co2_saved_kg": 340.0, "fuel_saved_l": 126.8},
            {"time": "18:00", "co2_saved_kg": 490.0, "fuel_saved_l": 182.8},
            {"time": "20:00", "co2_saved_kg": 590.0, "fuel_saved_l": 220.1},
            {"time": "22:00", "co2_saved_kg": 640.0, "fuel_saved_l": 238.8},
        ]
    }
