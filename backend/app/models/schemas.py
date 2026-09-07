from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class PressureClass(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    CRITICAL = "Critical"

class VehicleType(str, Enum):
    ELECTRIC_VAN = "ELECTRIC_VAN"
    DIESEL_LCV = "DIESEL_LCV"
    CNG_TRUCK = "CNG_TRUCK"
    CARGO_EV_2W = "CARGO_EV_2W"
    HEAVY_FREIGHT = "HEAVY_FREIGHT"

class VehicleStatus(str, Enum):
    IN_TRANSIT = "IN_TRANSIT"
    LOADING = "LOADING"
    UNLOADING = "UNLOADING"
    IDLE = "IDLE"
    REROUTED_EMERGENCY = "REROUTED_EMERGENCY"

class PriorityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL_URGENT = "CRITICAL_URGENT"

class DeliveryStatus(str, Enum):
    PENDING = "PENDING"
    SCHEDULED = "SCHEDULED"
    IN_DELIVERY = "IN_DELIVERY"
    COMPLETED = "COMPLETED"
    DELAYED = "DELAYED"

class RouteMode(str, Enum):
    FASTEST = "FASTEST"
    CHEAPEST = "CHEAPEST"
    GREENEST = "GREENEST"
    BALANCED = "BALANCED"

class IncidentType(str, Enum):
    ACCIDENT = "ACCIDENT"
    ROAD_CLOSURE = "ROAD_CLOSURE"
    FESTIVAL_EVENT = "FESTIVAL_EVENT"
    CONSTRUCTION = "CONSTRUCTION"
    WATERLOGGING = "WATERLOGGING"

class InfraCategory(str, Enum):
    NEW_LOADING_BAY = "NEW_LOADING_BAY"
    EV_CHARGER = "EV_CHARGER"
    ROAD_WIDENING = "ROAD_WIDENING"
    DELIVERY_MICRO_HUB = "DELIVERY_MICRO_HUB"
    SMART_SIGNAL = "SMART_SIGNAL"

class ZoneModel(BaseModel):
    id: str
    name: str
    category: str
    center: List[float] # [lat, lng]
    polygon: List[List[float]] # List of [lat, lng]
    road_utilization: float = Field(..., ge=0, le=1)
    traffic_density: float = Field(..., ge=0, le=1)
    logistics_demand: float = Field(..., ge=0, le=100)
    parking_pressure: float = Field(..., ge=0, le=1)
    avg_speed_kmh: float
    free_flow_speed_kmh: float
    incident_count: int = 0
    environmental_index: float = Field(..., ge=0, le=100)
    pressure_score: float = Field(..., ge=0, le=100)
    pressure_class: PressureClass
    active_deliveries: int = 0
    active_vehicles: int = 0
    loading_bay_capacity: int = 20
    loading_bay_occupied: int = 10
    peak_hours: str = "17:00 - 20:00"

class RoadSegmentModel(BaseModel):
    id: str
    name: str
    from_zone_id: str
    to_zone_id: str
    coordinates: List[List[float]] # List of [lat, lng]
    length_km: float
    free_flow_speed_kmh: float
    current_speed_kmh: float
    capacity_vph: int
    current_volume_vph: int
    congestion_level: float = Field(..., ge=0, le=1)
    status: str = "NORMAL" # NORMAL, CONGESTED, BLOCKED, EMERGENCY_PRIORITY
    lane_count: int = 2
    emissions_factor: float = 1.0

class VehicleModel(BaseModel):
    id: str
    plate_number: str
    vehicle_type: VehicleType
    driver_name: str
    fuel_or_battery_pct: float
    lat: float
    lng: float
    heading: float = 0.0
    current_speed_kmh: float
    status: VehicleStatus
    current_zone_id: str
    destination_zone_id: Optional[str] = None
    max_payload_kg: float
    current_payload_kg: float
    assigned_orders_count: int = 0
    co2_emission_rate_g_km: float

class DeliveryRequestModel(BaseModel):
    id: str
    tracking_code: str
    customer_name: str
    origin_zone_id: str
    destination_zone_id: str
    destination_coords: List[float] # [lat, lng]
    package_weight_kg: float
    priority: PriorityLevel
    preferred_window_start: str
    preferred_window_end: str
    assigned_slot_start: Optional[str] = None
    assigned_slot_end: Optional[str] = None
    assigned_vehicle_id: Optional[str] = None
    assigned_loading_zone_id: Optional[str] = None
    status: DeliveryStatus = DeliveryStatus.PENDING
    travel_time_mins: float = 25.0
    estimated_co2_kg: float = 1.8
    delay_risk_score: float = 0.2

class LoadingZoneModel(BaseModel):
    id: str
    name: str
    zone_id: str
    zone_name: str
    location: List[float] # [lat, lng]
    total_bays: int
    occupied_bays: int
    reserved_bays: int
    available_bays: int
    queue_count: int = 0
    avg_dwell_time_mins: int = 25
    ev_charging_available: bool = True
    max_vehicle_height_m: float = 3.8
    operating_hours: str = "06:00 - 23:00"
    walking_radius_m: int = 350
    current_utilization_pct: float = 0.0

class IncidentModel(BaseModel):
    id: str
    type: IncidentType
    title: str
    description: str
    location: List[float] # [lat, lng]
    affected_road_ids: List[str]
    affected_zone_ids: List[str]
    severity: str # MINOR, MODERATE, SEVERE, CRITICAL
    start_time: str
    estimated_clearance_time: str
    active: bool = True

class PredictionContributingFactor(BaseModel):
    factor: str
    impact_pct: float
    description: str
    impact_direction: Optional[str] = "INCREASING_CONGESTION"
    feature_name: Optional[str] = None
    weight_pct: Optional[float] = None


class ZonePredictionModel(BaseModel):
    zone_id: str
    zone_name: str
    current_congestion_pct: float
    pred_15m_pct: float
    pred_30m_pct: float
    pred_60m_pct: float
    confidence_score: float
    peak_risk_window: str
    risk_level: str
    ai_recommendation: str
    contributing_factors: List[PredictionContributingFactor]

class RouteOptionModel(BaseModel):
    id: str
    name: str
    mode: RouteMode
    waypoints: List[List[float]]
    road_ids: List[str]
    distance_km: float
    estimated_duration_mins: float
    congestion_index: float
    fuel_consumption: float # Liters or kWh
    fuel_unit: str = "L"
    co2_emissions_kg: float
    eco_score: float # 0 to 100
    toll_cost_inr: float
    explainability_text: str
    is_recommended: bool = False

class WhatIfScenarioInput(BaseModel):
    name: str
    description: str
    road_closures: List[str] = []
    accident_zones: List[str] = []
    festival_zones: List[str] = []
    demand_multiplier: float = 1.0
    traffic_multiplier: float = 1.0
    add_loading_zones: List[str] = []
    temporary_construction_roads: List[str] = []

class SimulationMetricDiff(BaseModel):
    metric: str
    before_value: float
    after_value: float
    delta_pct: float
    unit: str
    favorable_direction: str = "DECREASE" # DECREASE or INCREASE

class SimulationResultModel(BaseModel):
    scenario_name: str
    timestamp: str
    travel_time_change_pct: float
    congestion_change_pct: float
    logistics_delay_change_pct: float
    co2_change_pct: float
    fuel_change_pct: float
    metrics: List[SimulationMetricDiff]
    affected_zones: List[str]
    critical_bottlenecks: List[str]
    recommended_actions: List[str]
    before_pressure_map: Dict[str, float]
    after_pressure_map: Dict[str, float]

class EmergencyRequestInput(BaseModel):
    emergency_type: str = "AMBULANCE" # AMBULANCE, FIRE_RESPONSE, POLICE
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    vehicle_callsign: str = "EMERG-MED-09"

class EmergencyCorridorResponse(BaseModel):
    id: str
    status: str
    vehicle_callsign: str
    origin: List[float]
    destination: List[float]
    corridor_waypoints: List[List[float]]
    cleared_intersections: List[str]
    diverted_logistics_vehicles_count: int
    active_corridor_length_km: float
    original_eta_mins: float
    optimized_eta_mins: float
    time_saved_mins: float
    green_wave_active: bool = True
    active_since: str

class InfraRecommendationModel(BaseModel):
    id: str
    zone_id: str
    zone_name: str
    category: InfraCategory
    priority: str
    title: str
    description: str
    reasoning: str
    estimated_capex_inr: float
    annual_co2_saving_tons: float
    daily_delay_reduction_hours: float
    roi_score: float # 0 to 10
    implementation_weeks: int
    recommended_bays_or_units: int

class KPIDashboardModel(BaseModel):
    city_pressure_index: float
    pressure_trend: str
    active_vehicles: int
    congested_zones_count: int
    total_zones: int
    avg_travel_time_mins: float
    deliveries_today_count: int
    on_time_delivery_rate_pct: float
    co2_saved_today_kg: float
    fuel_saved_today_liters: float
    live_incidents_count: int
    loading_zone_occupancy_pct: float
    ai_insights: List[str]

class SlotOptimizationResult(BaseModel):
    original_peak_load_deliveries: int
    optimized_peak_load_deliveries: int
    peak_reduction_pct: float
    avg_dwell_reduction_mins: float
    estimated_co2_reduction_kg: float
    reallocated_deliveries_count: int
    original_schedule: List[Dict[str, Any]]
    optimized_schedule: List[Dict[str, Any]]
    zone_slot_utilization: List[Dict[str, Any]]

class DataTypeEnum(str, Enum):
    OBSERVED = "OBSERVED"
    PREDICTED = "PREDICTED"
    SIMULATED = "SIMULATED"

class DatasetSummaryModel(BaseModel):
    dataset_id: str
    source_id: Optional[str] = None
    filename: str
    row_count: int
    valid_rows: int
    invalid_rows: int
    quality_score_pct: float
    time_range_start: Optional[str] = None
    time_range_end: Optional[str] = None
    span_hours: Optional[float] = 0.0
    features: List[str] = []
    status: str
    created_at: str

class DataQualityReportModel(BaseModel):
    total_datasets: int
    total_observations: int
    valid_observations: int
    rejected_observations: int
    average_quality_score: float
    available_road_segments_count: int
    active_road_segment_ids: List[str]
    time_range: Dict[str, Any]
    data_drift_detected: bool = False
    drift_metrics: Dict[str, Any] = {}
    missing_value_summary: Dict[str, int] = {}
    last_observation_timestamp: Optional[str] = None

class MLTrainRequestModel(BaseModel):
    dataset_id: Optional[str] = None
    target_variable: str = "future_congestion"
    horizons: List[str] = ["15m", "30m", "60m"]
    candidate_models: List[str] = ["RandomForest", "GradientBoosting", "HistGradientBoosting"]

class CandidateEvaluationModel(BaseModel):
    model_name: str
    mae: float
    rmse: float
    r2: float
    is_best: bool = False

class MLModelRegistryItem(BaseModel):
    model_id: str
    version: str
    model_type: str
    dataset_id: Optional[str] = None
    target_variable: str
    horizons_supported: List[str]
    features: List[str]
    training_samples: int
    validation_samples: int
    test_samples: int
    test_mae: float
    test_rmse: float
    test_r2: float
    candidate_metrics: Dict[str, Any]
    status: str
    prediction_count: int
    created_at: str

class MLHealthModel(BaseModel):
    active_model: Optional[MLModelRegistryItem] = None
    total_registered_models: int
    prediction_service_status: str
    data_freshness_minutes: Optional[float] = None
    total_predictions_served: int
    data_drift_status: str

class MLPredictRequestModel(BaseModel):
    road_segment_id: str
    horizon_minutes: int = 15
    current_speed_kmh: Optional[float] = None
    volume_vph: Optional[float] = None
    free_flow_speed_kmh: Optional[float] = 50.0

class MLPredictResponseModel(BaseModel):
    road_segment_id: str
    road_name: Optional[str] = None
    horizon_minutes: int
    predicted_congestion: float
    predicted_speed_kmh: float
    model_version: str
    generated_at: str
    data_type: DataTypeEnum = DataTypeEnum.PREDICTED
    explanations: List[PredictionContributingFactor] = []

