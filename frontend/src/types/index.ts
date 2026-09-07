export type PressureClass = 'Low' | 'Moderate' | 'High' | 'Critical';

export type VehicleType = 
  | 'ELECTRIC_VAN' 
  | 'DIESEL_LCV' 
  | 'CNG_TRUCK' 
  | 'CARGO_EV_2W' 
  | 'HEAVY_FREIGHT';

export type VehicleStatus = 
  | 'IN_TRANSIT' 
  | 'LOADING' 
  | 'UNLOADING' 
  | 'IDLE' 
  | 'REROUTED_EMERGENCY';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_URGENT';

export type DeliveryStatus = 'PENDING' | 'SCHEDULED' | 'IN_DELIVERY' | 'COMPLETED' | 'DELAYED';

export type RouteMode = 'FASTEST' | 'CHEAPEST' | 'GREENEST' | 'BALANCED';

export type IncidentType = 'ACCIDENT' | 'ROAD_CLOSURE' | 'FESTIVAL_EVENT' | 'CONSTRUCTION' | 'WATERLOGGING';

export type InfraCategory = 'NEW_LOADING_BAY' | 'EV_CHARGER' | 'ROAD_WIDENING' | 'DELIVERY_MICRO_HUB' | 'SMART_SIGNAL';

export interface ZoneModel {
  id: string;
  name: string;
  category: string;
  center: [number, number];
  polygon: [number, number][];
  road_utilization: number;
  traffic_density: number;
  logistics_demand: number;
  parking_pressure: number;
  avg_speed_kmh: number;
  free_flow_speed_kmh: number;
  incident_count: number;
  environmental_index: number;
  pressure_score: number;
  pressure_class: PressureClass;
  active_deliveries: number;
  active_vehicles: number;
  loading_bay_capacity: number;
  loading_bay_occupied: number;
  peak_hours: string;
}

export interface RoadSegmentModel {
  id: string;
  name: string;
  from_zone_id: string;
  to_zone_id: string;
  coordinates: [number, number][];
  length_km: number;
  free_flow_speed_kmh: number;
  current_speed_kmh: number;
  capacity_vph: number;
  current_volume_vph: number;
  congestion_level: number;
  status: 'NORMAL' | 'CONGESTED' | 'BLOCKED' | 'EMERGENCY_PRIORITY';
  lane_count: number;
  emissions_factor: number;
}

export interface VehicleModel {
  id: string;
  plate_number: string;
  vehicle_type: VehicleType;
  driver_name: string;
  fuel_or_battery_pct: number;
  lat: number;
  lng: number;
  heading: number;
  current_speed_kmh: number;
  status: VehicleStatus;
  current_zone_id: string;
  destination_zone_id?: string;
  max_payload_kg: number;
  current_payload_kg: number;
  assigned_orders_count: number;
  co2_emission_rate_g_km: number;
}

export interface DeliveryRequestModel {
  id: string;
  tracking_code: string;
  customer_name: string;
  origin_zone_id: string;
  destination_zone_id: string;
  destination_coords: [number, number];
  package_weight_kg: number;
  priority: PriorityLevel;
  preferred_window_start: string;
  preferred_window_end: string;
  assigned_slot_start?: string;
  assigned_slot_end?: string;
  assigned_vehicle_id?: string;
  assigned_loading_zone_id?: string;
  status: DeliveryStatus;
  travel_time_mins: number;
  estimated_co2_kg: number;
  delay_risk_score: number;
}

export interface LoadingZoneModel {
  id: string;
  name: string;
  zone_id: string;
  zone_name: string;
  location: [number, number];
  total_bays: number;
  occupied_bays: number;
  reserved_bays: number;
  available_bays: number;
  queue_count: number;
  avg_dwell_time_mins: number;
  ev_charging_available: boolean;
  max_vehicle_height_m: number;
  operating_hours: string;
  walking_radius_m: number;
  current_utilization_pct: number;
}

export interface IncidentModel {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  location: [number, number];
  affected_road_ids: string[];
  affected_zone_ids: string[];
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  start_time: string;
  estimated_clearance_time: string;
  active: boolean;
}

export interface PredictionContributingFactor {
  factor: string;
  impact_pct: number;
  description: string;
  impact_direction?: string;
  feature_name?: string;
  weight_pct?: number;
}

export interface ZonePredictionModel {
  zone_id: string;
  zone_name: string;
  current_congestion_pct: number;
  pred_15m_pct: number;
  pred_30m_pct: number;
  pred_60m_pct: number;
  confidence_score: number;
  peak_risk_window: string;
  risk_level: string;
  ai_recommendation: string;
  contributing_factors: PredictionContributingFactor[];
}

export interface RouteOptionModel {
  id: string;
  name: string;
  mode: RouteMode;
  waypoints: [number, number][];
  road_ids: string[];
  distance_km: number;
  estimated_duration_mins: number;
  congestion_index: number;
  fuel_consumption: number;
  fuel_unit: string;
  co2_emissions_kg: number;
  eco_score: number;
  toll_cost_inr: number;
  explainability_text: string;
  is_recommended?: boolean;
}

export interface WhatIfScenarioInput {
  name: string;
  description: string;
  road_closures: string[];
  accident_zones: string[];
  festival_zones: string[];
  demand_multiplier: number;
  traffic_multiplier: number;
  add_loading_zones: string[];
  temporary_construction_roads: string[];
}

export interface SimulationMetricDiff {
  metric: string;
  before_value: number;
  after_value: number;
  delta_pct: number;
  unit: string;
  favorable_direction: 'DECREASE' | 'INCREASE';
}

export interface SimulationResultModel {
  scenario_name: string;
  timestamp: string;
  travel_time_change_pct: number;
  congestion_change_pct: number;
  logistics_delay_change_pct: number;
  co2_change_pct: number;
  fuel_change_pct: number;
  metrics: SimulationMetricDiff[];
  affected_zones: string[];
  critical_bottlenecks: string[];
  recommended_actions: string[];
  before_pressure_map: Record<string, number>;
  after_pressure_map: Record<string, number>;
}

export interface EmergencyRequestInput {
  emergency_type: string;
  origin_lat: number;
  origin_lng: number;
  destination_lat: number;
  destination_lng: number;
  vehicle_callsign: string;
}

export interface EmergencyCorridorResponse {
  id: string;
  status: string;
  vehicle_callsign: string;
  origin: [number, number];
  destination: [number, number];
  corridor_waypoints: [number, number][];
  cleared_intersections: string[];
  diverted_logistics_vehicles_count: number;
  active_corridor_length_km: number;
  original_eta_mins: number;
  optimized_eta_mins: number;
  time_saved_mins: number;
  green_wave_active: boolean;
  active_since: string;
}

export interface InfraRecommendationModel {
  id: string;
  zone_id: string;
  zone_name: string;
  category: InfraCategory;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  reasoning: string;
  estimated_capex_inr: number;
  annual_co2_saving_tons: number;
  daily_delay_reduction_hours: number;
  roi_score: number;
  implementation_weeks: number;
  recommended_bays_or_units: number;
}

export interface KPIDashboardModel {
  city_pressure_index: number;
  pressure_trend: string;
  active_vehicles: number;
  congested_zones_count: number;
  total_zones: number;
  avg_travel_time_mins: number;
  deliveries_today_count: number;
  on_time_delivery_rate_pct: number;
  co2_saved_today_kg: number;
  fuel_saved_today_liters: number;
  live_incidents_count: number;
  loading_zone_occupancy_pct: number;
  ai_insights: string[];
}

export interface SlotOptimizationResult {
  original_peak_load_deliveries: number;
  optimized_peak_load_deliveries: number;
  peak_reduction_pct: number;
  avg_dwell_reduction_mins: number;
  estimated_co2_reduction_kg: number;
  reallocated_deliveries_count: number;
  original_schedule: Array<{
    delivery_id: string;
    tracking_code: string;
    customer: string;
    destination_zone: string;
    priority: string;
    assigned_slot: string;
    loading_zone: string;
    status: string;
    estimated_queue_mins: number;
    co2_impact_kg: number;
  }>;
  optimized_schedule: Array<{
    delivery_id: string;
    tracking_code: string;
    customer: string;
    destination_zone: string;
    priority: string;
    assigned_slot: string;
    loading_zone: string;
    status: string;
    estimated_queue_mins: number;
    co2_impact_kg: number;
  }>;
  zone_slot_utilization: Array<{
    slot_interval: string;
    original_deliveries: number;
    optimized_deliveries: number;
    variance_pct: number;
  }>;
}

export interface DemoRunResult {
  scenario: string;
  execution_status: string;
  active_simulated_vehicles: number;
  simulated_inputs: {
    demand_increase: string;
    road_closure: string;
    public_event: string;
    congested_arterials: string[];
  };
  system_actions_taken: string[];
  final_impact_metrics: {
    travel_time_reduction_pct: number;
    congestion_reduction_pct: number;
    fuel_saving_pct: number;
    co2_reduction_pct: number;
    delivery_delay_reduction_pct: number;
  };
  before_vs_after_comparison: Array<{
    metric: string;
    unmanaged_surge: string;
    cityflow_optimized: string;
    improvement: string;
  }>;
  zone_predictions: Record<string, ZonePredictionModel>;
  slot_optimization_summary: SlotOptimizationResult;
  simulation_result: SimulationResultModel;
}

export type DataType = 'OBSERVED' | 'PREDICTED' | 'SIMULATED';

export interface DatasetSummaryModel {
  dataset_id: string;
  source_id?: string;
  filename: string;
  row_count: number;
  valid_rows: number;
  invalid_rows: number;
  quality_score_pct: number;
  time_range_start?: string;
  time_range_end?: string;
  span_hours?: number;
  features: string[];
  status: string;
  created_at: string;
}

export interface DataQualityReportModel {
  total_datasets: number;
  total_observations: number;
  valid_observations: number;
  rejected_observations: number;
  average_quality_score: number;
  available_road_segments_count: number;
  active_road_segment_ids: string[];
  time_range: {
    start?: string;
    end?: string;
    span_hours?: number;
  };
  data_drift_detected: boolean;
  drift_metrics: Record<string, {
    baseline_mean: number;
    current_mean: number;
    normalized_mean_shift: number;
    drift_detected: boolean;
  }>;
  missing_value_summary: Record<string, number>;
  last_observation_timestamp?: string;
}

export interface CandidateEvaluationModel {
  model_name: string;
  mae: number;
  rmse: number;
  r2: number;
  is_best?: boolean;
}

export interface MLModelRegistryItem {
  model_id: string;
  version: string;
  model_type: string;
  dataset_id?: string;
  target_variable: string;
  horizons_supported: string[];
  features: string[];
  training_samples: number;
  validation_samples: number;
  test_samples: number;
  test_mae: number;
  test_rmse: number;
  test_r2: number;
  candidate_metrics: Record<string, any>;
  status: string;
  prediction_count: number;
  created_at: string;
}

export interface MLHealthModel {
  active_model?: MLModelRegistryItem | null;
  total_registered_models: number;
  prediction_service_status: string;
  data_freshness_minutes?: number;
  total_predictions_served: number;
  data_drift_status: string;
}

export interface MLPredictRequestModel {
  road_segment_id: string;
  horizon_minutes?: number;
  current_speed_kmh?: number;
  volume_vph?: number;
  free_flow_speed_kmh?: number;
}

export interface MLPredictResponseModel {
  road_segment_id: string;
  road_name?: string;
  horizon_minutes: number;
  predicted_congestion: number;
  predicted_speed_kmh: number;
  model_version: string;
  generated_at: string;
  data_type: DataType;
  explanations: PredictionContributingFactor[];
}

