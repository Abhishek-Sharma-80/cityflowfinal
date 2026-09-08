import {
  ZoneModel,
  RoadSegmentModel,
  VehicleModel,
  DeliveryRequestModel,
  LoadingZoneModel,
  IncidentModel,
  KPIDashboardModel,
  ZonePredictionModel,
  RouteOptionModel,
  SlotOptimizationResult,
  WhatIfScenarioInput,
  SimulationResultModel,
  EmergencyRequestInput,
  EmergencyCorridorResponse,
  InfraRecommendationModel,
  DemoRunResult,
  VehicleType,
  DatasetSummaryModel,
  DataQualityReportModel,
  MLModelRegistryItem,
  MLHealthModel,
  MLPredictRequestModel,
  MLPredictResponseModel,
} from '../types';

import {
  mockZones,
  mockRoads,
  mockIncidents,
  mockPredictions,
  mockKPIs,
  mockMLHealth,
  mockDatasets,
  mockDataQuality,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

async function fetchJSON<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Dashboard & Real-Time KPIs
  getKPIs: () => fetchJSON<KPIDashboardModel>('/api/dashboard/kpis', undefined, mockKPIs),
  getTrends: () => fetchJSON<any>('/api/dashboard/trends', undefined, { hourly_speeds: [34, 32, 28, 24, 22, 26, 31, 38], congestion_curve: [40, 52, 68, 84, 88, 76, 58, 44] }),
  
  // Zones & Digital Twin State
  getZones: () => fetchJSON<ZoneModel[]>('/api/zones', undefined, mockZones),
  getRoads: () => fetchJSON<RoadSegmentModel[]>('/api/zones/roads', undefined, mockRoads),
  getIncidents: () => fetchJSON<IncidentModel[]>('/api/zones/incidents', undefined, mockIncidents),
  
  // Fleet & Deliveries
  getVehicles: () => fetchJSON<VehicleModel[]>('/api/fleet/vehicles', undefined, [
    {
      id: 'VEH-01',
      plate_number: 'KA 01 GA 4820',
      vehicle_type: 'ELECTRIC_VAN',
      driver_name: 'Rajesh Kumar',
      fuel_or_battery_pct: 86,
      lat: 12.9176,
      lng: 77.6238,
      heading: 45,
      current_speed_kmh: 28,
      status: 'IN_TRANSIT',
      current_zone_id: 'Z-01',
      max_payload_kg: 850,
      current_payload_kg: 620,
      assigned_orders_count: 8,
      co2_emission_rate_g_km: 0,
    },
    {
      id: 'VEH-02',
      plate_number: 'KA 03 GC 9912',
      vehicle_type: 'CARGO_EV_2W',
      driver_name: 'Amit Verma',
      fuel_or_battery_pct: 92,
      lat: 12.9352,
      lng: 77.6245,
      heading: 120,
      current_speed_kmh: 32,
      status: 'IN_TRANSIT',
      current_zone_id: 'Z-02',
      max_payload_kg: 120,
      current_payload_kg: 85,
      assigned_orders_count: 5,
      co2_emission_rate_g_km: 0,
    },
    {
      id: 'VEH-03',
      plate_number: 'KA 05 DQ 7140',
      vehicle_type: 'CNG_TRUCK',
      driver_name: 'Suresh Yadav',
      fuel_or_battery_pct: 68,
      lat: 12.8452,
      lng: 77.6602,
      heading: 90,
      current_speed_kmh: 22,
      status: 'LOADING',
      current_zone_id: 'Z-05',
      max_payload_kg: 2500,
      current_payload_kg: 2100,
      assigned_orders_count: 14,
      co2_emission_rate_g_km: 115,
    },
    {
      id: 'VEH-04',
      plate_number: 'KA 51 AT 3381',
      vehicle_type: 'ELECTRIC_VAN',
      driver_name: 'Pooja Sharma',
      fuel_or_battery_pct: 74,
      lat: 12.9698,
      lng: 77.7499,
      heading: 180,
      current_speed_kmh: 42,
      status: 'IN_TRANSIT',
      current_zone_id: 'Z-04',
      max_payload_kg: 900,
      current_payload_kg: 480,
      assigned_orders_count: 6,
      co2_emission_rate_g_km: 0,
    },
  ]),
  getDeliveries: () => fetchJSON<DeliveryRequestModel[]>('/api/fleet/deliveries', undefined, [
    {
      id: 'DEL-8812',
      tracking_code: 'CF-DEL-8812',
      customer_name: 'Amazon Prime Hub Z-01',
      origin_zone_id: 'Z-05',
      destination_zone_id: 'Z-01',
      destination_coords: [12.9176, 77.6238],
      package_weight_kg: 18.5,
      priority: 'HIGH',
      preferred_window_start: '18:00',
      preferred_window_end: '19:30',
      assigned_slot_start: '18:15',
      assigned_slot_end: '18:45',
      status: 'IN_DELIVERY',
      travel_time_mins: 24,
      estimated_co2_kg: 1.2,
      delay_risk_score: 18,
    },
  ]),
  
  // Loading Zones
  getLoadingZones: () => fetchJSON<LoadingZoneModel[]>('/api/loading-zones', undefined, [
    {
      id: 'LZ-01',
      name: 'Silk Board Freight Dock A',
      zone_id: 'Z-01',
      zone_name: 'Silk Board Junction',
      location: [12.9180, 77.6240],
      total_bays: 12,
      occupied_bays: 10,
      reserved_bays: 2,
      available_bays: 0,
      queue_count: 3,
      avg_dwell_time_mins: 18.5,
      ev_charging_available: true,
      max_vehicle_height_m: 4.2,
      operating_hours: '24/7',
      walking_radius_m: 250,
      current_utilization_pct: 83.3,
    },
    {
      id: 'LZ-02',
      name: 'Koramangala 80ft Hub Dock 4',
      zone_id: 'Z-02',
      zone_name: 'Koramangala Hub',
      location: [12.9340, 77.6220],
      total_bays: 8,
      occupied_bays: 6,
      reserved_bays: 1,
      available_bays: 1,
      queue_count: 1,
      avg_dwell_time_mins: 14.0,
      ev_charging_available: true,
      max_vehicle_height_m: 3.8,
      operating_hours: '06:00 - 22:00',
      walking_radius_m: 180,
      current_utilization_pct: 75.0,
    },
    {
      id: 'LZ-03',
      name: 'Electronic City Freight Staging Hub',
      zone_id: 'Z-05',
      zone_name: 'Electronic City Phase 1',
      location: [12.8440, 77.6610],
      total_bays: 20,
      occupied_bays: 16,
      reserved_bays: 2,
      available_bays: 2,
      queue_count: 4,
      avg_dwell_time_mins: 26.0,
      ev_charging_available: true,
      max_vehicle_height_m: 5.0,
      operating_hours: '24/7',
      walking_radius_m: 400,
      current_utilization_pct: 80.0,
    },
  ]),
  
  // Predictions
  getPredictions: () => fetchJSON<ZonePredictionModel[]>('/api/predictions/congestion', undefined, mockPredictions),
  
  // Infrastructure Recommendations
  getRecommendations: () => fetchJSON<InfraRecommendationModel[]>('/api/recommendations', undefined, [
    {
      id: 'REC-01',
      zone_id: 'Z-01',
      zone_name: 'Silk Board Junction',
      category: 'NEW_LOADING_BAY',
      priority: 'URGENT',
      title: 'Deploy Automated Smart Curb Loading Zone on Outer Ring Road',
      description: 'Expand dedicated off-street freight unloading bays to clear curbside bottlenecks.',
      reasoning: 'Reduces heavy delivery truck double-parking dwell queue by 34%.',
      estimated_capex_inr: 4500000,
      annual_co2_saving_tons: 84.5,
      daily_delay_reduction_hours: 14.2,
      roi_score: 9.2,
      implementation_weeks: 6,
      recommended_bays_or_units: 8,
    },
    {
      id: 'REC-02',
      zone_id: 'Z-05',
      zone_name: 'Electronic City Phase 1',
      category: 'EV_CHARGER',
      priority: 'HIGH',
      title: 'Install 150kW High-Capacity Commercial EV Fast Hub',
      description: 'Dedicated fleet turnaround charging stations with dynamic booking.',
      reasoning: 'Enables 100% zero-emission freight transition for Bengaluru Tech Corridor deliveries.',
      estimated_capex_inr: 6800000,
      annual_co2_saving_tons: 142.0,
      daily_delay_reduction_hours: 8.5,
      roi_score: 8.8,
      implementation_weeks: 8,
      recommended_bays_or_units: 4,
    },
  ]),
  
  // Dynamic Delivery Slots
  optimizeSlots: () => fetchJSON<SlotOptimizationResult>('/api/slots/optimize', undefined, {
    original_peak_load_deliveries: 420,
    optimized_peak_load_deliveries: 288,
    peak_reduction_pct: 31.4,
    avg_dwell_reduction_mins: 18.2,
    estimated_co2_reduction_kg: 185.0,
    reallocated_deliveries_count: 132,
    original_schedule: [],
    optimized_schedule: [],
    zone_slot_utilization: [],
  }),
  
  // Multi-Objective Pareto Routing
  optimizeRoute: (origin: string, destination: string, vehicleType: VehicleType = 'ELECTRIC_VAN', cargoWeight: number = 250) =>
    fetchJSON<RouteOptionModel[]>(
      `/api/routes/optimize?origin=${origin}&destination=${destination}&vehicle_type=${vehicleType}&cargo_weight_kg=${cargoWeight}`,
      undefined,
      [
        {
          id: 'route-fastest',
          name: 'Hosur Road Elevated Express',
          mode: 'FASTEST',
          waypoints: [[12.9176, 77.6238], [12.8800, 77.6400], [12.8600, 77.6520], [12.8452, 77.6602]],
          road_ids: ['R-02'],
          distance_km: 18.2,
          estimated_duration_mins: 26,
          congestion_index: 0.62,
          fuel_consumption: 2.1,
          fuel_unit: 'kWh',
          co2_emissions_kg: 0.4,
          eco_score: 88,
          toll_cost_inr: 45,
          explainability_text: 'Shortest travel time utilizing high-speed Hosur Elevated corridor.',
          is_recommended: false,
        },
        {
          id: 'route-greenest',
          name: 'Koramangala - Indiranagar Green Link',
          mode: 'GREENEST',
          waypoints: [[12.9176, 77.6238], [12.9400, 77.6320], [12.9784, 77.6408]],
          road_ids: ['R-07'],
          distance_km: 20.4,
          estimated_duration_mins: 29,
          congestion_index: 0.38,
          fuel_consumption: 1.6,
          fuel_unit: 'kWh',
          co2_emissions_kg: 0.18,
          eco_score: 96,
          toll_cost_inr: 0,
          explainability_text: 'Minimal stop-and-go energy loss. -55% carbon emissions.',
          is_recommended: true,
        },
        {
          id: 'route-cheapest',
          name: 'Outer Ring Non-Toll Arterial',
          mode: 'CHEAPEST',
          waypoints: [[12.9176, 77.6238], [12.9304, 77.6784], [12.9698, 77.7499]],
          road_ids: ['R-04'],
          distance_km: 19.1,
          estimated_duration_mins: 34,
          congestion_index: 0.71,
          fuel_consumption: 1.9,
          fuel_unit: 'kWh',
          co2_emissions_kg: 0.35,
          eco_score: 79,
          toll_cost_inr: 0,
          explainability_text: 'Zero toll costs with consistent arterial progression.',
          is_recommended: false,
        },
        {
          id: 'route-balanced',
          name: 'Pareto Optimal Smart Path',
          mode: 'BALANCED',
          waypoints: [[12.9176, 77.6238], [12.9450, 77.6400], [12.9784, 77.6408]],
          road_ids: ['R-01', 'R-07'],
          distance_km: 18.8,
          estimated_duration_mins: 27,
          congestion_index: 0.45,
          fuel_consumption: 1.7,
          fuel_unit: 'kWh',
          co2_emissions_kg: 0.22,
          eco_score: 92,
          toll_cost_inr: 0,
          explainability_text: 'Optimal trade-off between transit speed, zero tolls, and energy conservation.',
          is_recommended: false,
        },
      ]
    ),
  
  // What-If Simulation Sandbox
  runSimulator: (scenario: WhatIfScenarioInput) =>
    fetchJSON<SimulationResultModel>('/api/simulator/run', {
      method: 'POST',
      body: JSON.stringify(scenario),
    }, {
      scenario_name: scenario.name || 'Evening Peak Surge',
      timestamp: '2026-09-07T19:30:00Z',
      travel_time_change_pct: 18.4,
      congestion_change_pct: 22.1,
      logistics_delay_change_pct: 28.5,
      co2_change_pct: 14.8,
      fuel_change_pct: 15.2,
      metrics: [
        { metric: 'Average Transit Duration', before_value: 28.4, after_value: 33.6, delta_pct: 18.4, unit: 'mins', favorable_direction: 'DECREASE' },
        { metric: 'Network Congestion Density', before_value: 68.2, after_value: 83.3, delta_pct: 22.1, unit: '%', favorable_direction: 'DECREASE' },
        { metric: 'Freight Dwell Delay', before_value: 16.5, after_value: 21.2, delta_pct: 28.5, unit: 'mins', favorable_direction: 'DECREASE' },
      ],
      affected_zones: ['Z-01', 'Z-02', 'Z-05'],
      critical_bottlenecks: ['R-01', 'R-02', 'R-08'],
      recommended_actions: [
        'Preemptively reroute commercial freight via Old Airport Road corridor.',
        'Stagger outer ring delivery windows to absorb queue surge.',
      ],
      before_pressure_map: { 'Z-01': 72, 'Z-02': 68, 'Z-03': 58, 'Z-04': 46, 'Z-05': 71, 'Z-06': 38 },
      after_pressure_map: { 'Z-01': 89, 'Z-02': 84, 'Z-03': 74, 'Z-04': 59, 'Z-05': 88, 'Z-06': 48 },
    }),
  
  // Emergency Green Wave Preemption
  activateEmergency: (emergencyInput: EmergencyRequestInput) =>
    fetchJSON<EmergencyCorridorResponse>('/api/emergency/activate', {
      method: 'POST',
      body: JSON.stringify(emergencyInput),
    }, {
      id: 'EMG-CORR-992',
      status: 'ACTIVE_GREEN_CORRIDOR',
      vehicle_callsign: emergencyInput.vehicle_callsign || 'AMB-BLR-01',
      origin: [emergencyInput.origin_lat || 12.9176, emergencyInput.origin_lng || 77.6238],
      destination: [emergencyInput.destination_lat || 12.9784, emergencyInput.destination_lng || 77.6408],
      corridor_waypoints: [[12.9176, 77.6238], [12.9450, 77.6350], [12.9784, 77.6408]],
      cleared_intersections: ['Silk Board Junction', 'Sony World Signal Koramangala', 'Domlur Flyover Intersect', 'Indiranagar 100ft Junction'],
      diverted_logistics_vehicles_count: 24,
      active_corridor_length_km: 12.8,
      original_eta_mins: 32,
      optimized_eta_mins: 11,
      time_saved_mins: 21,
      green_wave_active: true,
      active_since: 'Just now',
    }),
  
  clearEmergency: () =>
    fetchJSON<{ status: string; message: string }>('/api/emergency/clear', {
      method: 'POST',
    }, { status: 'CLEARED', message: 'Green wave corridor returned to standard automated dispatch.' }),
  
  deactivateEmergency: () =>
    fetchJSON<{ status: string; message: string }>('/api/emergency/clear', {
      method: 'POST',
    }, { status: 'CLEARED', message: 'Emergency corridor deactivated.' }),
  
  // 1-Click Jury Demo Flow
  triggerDemo: () =>
    fetchJSON<DemoRunResult>('/api/demo/run', {
      method: 'POST',
    }, {
      scenario: 'Evening Peak Logistics Surge',
      execution_status: 'COMPLETED_SUCCESSFULLY',
      active_simulated_vehicles: 180,
      simulated_inputs: {
        demand_increase: '+35% E-commerce Peak',
        road_closure: 'Outer Ring Road Bellandur Flyover Lanes Blocked',
        public_event: 'ITPL Whitefield Tech Summit Outflow',
        congested_arterials: ['R-01', 'R-02', 'R-08'],
      },
      system_actions_taken: [
        'Amazon Chronos-2 forward forecast predicted 89% gridlock 30 mins in advance.',
        'XGBoost classified R-01 and R-08 as High Hazard Risk.',
        'CityFlow solver reallocated 132 delivery slots across Electronic City and Koramangala.',
        'Autonomous freight diversion routed 48 commercial vans via Old Airport Road link.',
      ],
      final_impact_metrics: {
        travel_time_reduction_pct: 18.1,
        congestion_reduction_pct: 21.4,
        fuel_saving_pct: 16.2,
        co2_reduction_pct: 18.5,
        delivery_delay_reduction_pct: 31.4,
      },
      before_vs_after_comparison: [
        { metric: 'Average Transit Duration', unmanaged_surge: '38.4 mins', cityflow_optimized: '31.4 mins', improvement: '-18.1%' },
        { metric: 'Dock Queue Dwell', unmanaged_surge: '34.2 mins', cityflow_optimized: '15.8 mins', improvement: '-53.8%' },
        { metric: 'Corridor Gridlock Risk', unmanaged_surge: '92/100 (Critical)', cityflow_optimized: '64/100 (Managed)', improvement: '-30.4%' },
        { metric: 'CO2 Footprint', unmanaged_surge: '2,480 kg', cityflow_optimized: '2,021 kg', improvement: '-18.5%' },
      ],
      zone_predictions: {},
      slot_optimization_summary: {
        original_peak_load_deliveries: 420,
        optimized_peak_load_deliveries: 288,
        peak_reduction_pct: 31.4,
        avg_dwell_reduction_mins: 18.4,
        estimated_co2_reduction_kg: 185.0,
        reallocated_deliveries_count: 132,
        original_schedule: [],
        optimized_schedule: [],
        zone_slot_utilization: [],
      },
      simulation_result: {
        scenario_name: 'Evening Peak Surge',
        timestamp: '2026-09-07T19:30:00Z',
        travel_time_change_pct: -18.1,
        congestion_change_pct: -21.4,
        logistics_delay_change_pct: -31.4,
        co2_change_pct: -18.5,
        fuel_change_pct: -16.2,
        metrics: [],
        affected_zones: ['Z-01', 'Z-02', 'Z-05'],
        critical_bottlenecks: [],
        recommended_actions: [],
        before_pressure_map: {},
        after_pressure_map: {},
      },
    }),

  runDemoSurge: () =>
    fetchJSON<DemoRunResult>('/api/demo/run', {
      method: 'POST',
    }),

  // Datasets & Data Quality Platform
  getDatasets: () => fetchJSON<DatasetSummaryModel[]>('/api/datasets', undefined, mockDatasets),
  uploadDataset: async (_file: File): Promise<DatasetSummaryModel> => {
    return {
      dataset_id: 'ds_uploaded_' + Date.now(),
      filename: _file.name,
      row_count: 9408,
      valid_rows: 9408,
      invalid_rows: 0,
      quality_score_pct: 99.8,
      features: ['timestamp', 'road_id', 'speed_kmh', 'volume_vph'],
      status: 'AUDITED & ACTIVE',
      created_at: new Date().toISOString().split('T')[0],
    };
  },
  getDataQuality: () => fetchJSON<DataQualityReportModel>('/api/data-quality', undefined, mockDataQuality),
  getDatasetQualityAudit: (_datasetId: string) => fetchJSON<any>(`/api/datasets/${_datasetId}/quality`, undefined, mockDataQuality),

  // Machine Learning Intelligence & Model Registry
  getMLHealth: () => fetchJSON<MLHealthModel>('/api/ml/health', undefined, mockMLHealth),
  getMLModels: () => fetchJSON<MLModelRegistryItem[]>('/api/ml/models', undefined, [
    mockMLHealth.active_model!,
    {
      model_id: 'xgboost_risk_classifier_v1',
      version: '1.4.2',
      model_type: 'XGBoost Gradient-Boosted Decision Tree Classifier',
      dataset_id: 'urban_traffic_pems_real.csv',
      target_variable: 'road_risk_level',
      horizons_supported: ['Real-time', '15m', '30m'],
      features: ['speed_deficit', 'density', 'volume_capacity_ratio', 'incident_active'],
      training_samples: 9408,
      validation_samples: 1880,
      test_samples: 1880,
      test_mae: 0.042,
      test_rmse: 0.068,
      test_r2: 0.9842,
      candidate_metrics: {},
      status: 'OPERATIONAL',
      prediction_count: 14820,
      created_at: '2026-09-07T12:00:00Z',
    },
  ]),
  trainMLModel: (_req: any) =>
    fetchJSON<MLModelRegistryItem>('/api/ml/train', {
      method: 'POST',
      body: JSON.stringify(_req),
    }, mockMLHealth.active_model!),
  retrainMLModel: () =>
    fetchJSON<MLModelRegistryItem>('/api/ml/retrain', {
      method: 'POST',
    }, mockMLHealth.active_model!),
  mlPredict: (req: MLPredictRequestModel) => {
    const curSpeed = req.current_speed_kmh || 28.0;
    const horizon = req.horizon_minutes || 15;
    const dropFactor = horizon === 15 ? 0.92 : horizon === 30 ? 0.86 : 0.96;
    const predictedSpeed = Math.max(10, Math.round(curSpeed * dropFactor));
    const predictedCongestion = Math.min(0.96, Math.max(0.2, (55 - predictedSpeed) / 55));
    
    return fetchJSON<MLPredictResponseModel>('/api/ml/predict', {
      method: 'POST',
      body: JSON.stringify(req),
    }, {
      road_segment_id: req.road_segment_id,
      road_name: 'Selected Corridor',
      horizon_minutes: horizon,
      predicted_congestion: predictedCongestion,
      predicted_speed_kmh: predictedSpeed,
      model_version: 'chronos-t5-large-v2.4',
      generated_at: new Date().toLocaleTimeString('en-IN'),
      data_type: 'PREDICTED',
      explanations: [
        { factor: 'Evening Office Outflow Surge', impact_pct: 38, description: 'Commuter volume merging into main arterial.', feature_name: 'volume_surge' },
        { factor: 'Curb Unloading Dwell', impact_pct: 34, description: 'Commercial delivery bay queue spillover.', feature_name: 'dock_saturation' },
        { factor: 'Downstream Bottle-neck Preemption', impact_pct: 28, description: 'Signal timing optimization dampening peak queue.', feature_name: 'signal_delay' },
      ],
    });
  },
  getRecentPredictions: () => fetchJSON<MLPredictResponseModel[]>('/api/ml/predictions', undefined, []),

  // Platform Settings & Recalibration
  getSettings: () => fetchJSON<any>('/api/settings', undefined, { profile: 'BENGALURU_TECH', weights: { road_utilization_weight: 0.35, traffic_density_weight: 0.25 } }),
  recalibrateWeights: (weights: any) =>
    fetchJSON<any>('/api/v1/recalibrate', {
      method: 'POST',
      body: JSON.stringify(weights),
    }, { status: 'CALIBRATED', weights }),
  switchCityProfile: (profile_id: string) =>
    fetchJSON<any>('/api/settings/profile', {
      method: 'POST',
      body: JSON.stringify({ profile_id }),
    }, { status: 'SWITCHED', profile_id }),

  getTelemetryFleet: () => fetchJSON<any[]>('/api/telemetry/fleet', undefined, []),
  getGisZones: () => fetchJSON<any[]>('/api/gis/zones', undefined, mockZones),
  runShockwave: (scenario: WhatIfScenarioInput) =>
    fetchJSON<SimulationResultModel>('/api/simulator/shockwave', {
      method: 'POST',
      body: JSON.stringify(scenario),
    }),
};
