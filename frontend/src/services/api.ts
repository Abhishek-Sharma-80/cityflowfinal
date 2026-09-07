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
  RouteMode,
  VehicleType,
  DatasetSummaryModel,
  DataQualityReportModel,
  MLModelRegistryItem,
  MLHealthModel,
  MLPredictRequestModel,
  MLPredictResponseModel
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
  }
  return await res.json();
}

export const api = {
  // Dashboard & Real-Time KPIs
  getKPIs: () => fetchJSON<KPIDashboardModel>('/api/dashboard/kpis'),
  getTrends: () => fetchJSON<any>('/api/dashboard/trends'),
  
  // Zones & Digital Twin State
  getZones: () => fetchJSON<ZoneModel[]>('/api/zones'),
  getRoads: () => fetchJSON<RoadSegmentModel[]>('/api/zones/roads'),
  getIncidents: () => fetchJSON<IncidentModel[]>('/api/zones/incidents'),
  
  // Fleet & Deliveries
  getVehicles: () => fetchJSON<VehicleModel[]>('/api/fleet/vehicles'),
  getDeliveries: () => fetchJSON<DeliveryRequestModel[]>('/api/fleet/deliveries'),
  
  // Loading Zones
  getLoadingZones: () => fetchJSON<LoadingZoneModel[]>('/api/loading-zones'),
  
  // Predictions
  getPredictions: () => fetchJSON<ZonePredictionModel[]>('/api/predictions/congestion'),
  
  // Infrastructure Recommendations
  getRecommendations: () => fetchJSON<InfraRecommendationModel[]>('/api/recommendations'),
  
  // Dynamic Delivery Slots
  optimizeSlots: () => fetchJSON<SlotOptimizationResult>('/api/slots/optimize'),
  
  // Multi-Objective Pareto Routing
  optimizeRoute: (origin: string, destination: string, vehicleType: VehicleType = 'ELECTRIC_VAN', cargoWeight: number = 250) =>
    fetchJSON<RouteOptionModel[]>(
      `/api/routes/optimize?origin=${origin}&destination=${destination}&vehicle_type=${vehicleType}&cargo_weight_kg=${cargoWeight}`
    ),
  
  // What-If Simulation Sandbox
  runSimulator: (scenario: WhatIfScenarioInput) =>
    fetchJSON<SimulationResultModel>('/api/simulator/run', {
      method: 'POST',
      body: JSON.stringify(scenario),
    }),
  
  // Emergency Green Wave Preemption
  activateEmergency: (emergencyInput: EmergencyRequestInput) =>
    fetchJSON<EmergencyCorridorResponse>('/api/emergency/activate', {
      method: 'POST',
      body: JSON.stringify(emergencyInput),
    }),
  
  clearEmergency: () =>
    fetchJSON<{ status: string; message: string }>('/api/emergency/clear', {
      method: 'POST',
    }),
  deactivateEmergency: () =>
    fetchJSON<{ status: string; message: string }>('/api/emergency/clear', {
      method: 'POST',
    }),
  
  // 1-Click Jury Demo Flow
  triggerDemo: () =>
    fetchJSON<DemoRunResult>('/api/demo/run', {
      method: 'POST',
    }),
  runDemoSurge: () =>
    fetchJSON<DemoRunResult>('/api/demo/run', {
      method: 'POST',
    }),

  // Datasets & Data Quality Platform
  getDatasets: () => fetchJSON<DatasetSummaryModel[]>('/api/datasets'),
  uploadDataset: async (file: File): Promise<DatasetSummaryModel> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/datasets/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }
    return await res.json();
  },
  getDataQuality: () => fetchJSON<DataQualityReportModel>('/api/data-quality'),
  getDatasetQualityAudit: (datasetId: string) => fetchJSON<any>(`/api/datasets/${datasetId}/quality`),

  // Machine Learning Intelligence & Model Registry
  getMLHealth: () => fetchJSON<MLHealthModel>('/api/ml/health'),
  getMLModels: () => fetchJSON<MLModelRegistryItem[]>('/api/ml/models'),
  trainMLModel: (req: { dataset_id?: string; target_variable?: string; candidate_models?: string[] }) =>
    fetchJSON<MLModelRegistryItem>('/api/ml/train', {
      method: 'POST',
      body: JSON.stringify(req),
    }),
  retrainMLModel: () =>
    fetchJSON<MLModelRegistryItem>('/api/ml/retrain', {
      method: 'POST',
    }),
  mlPredict: (req: MLPredictRequestModel) =>
    fetchJSON<MLPredictResponseModel>('/api/ml/predict', {
      method: 'POST',
      body: JSON.stringify(req),
    }),
  getRecentPredictions: () => fetchJSON<MLPredictResponseModel[]>('/api/ml/predictions'),

  // Platform Settings & Recalibration
  getSettings: () => fetchJSON<any>('/api/settings'),
  recalibrateWeights: (weights: {
    road_utilization_weight: number;
    traffic_density_weight: number;
    freight_demand_weight: number;
    parking_pressure_weight: number;
    speed_deficit_weight: number;
    incident_weight?: number;
    environmental_weight?: number;
  }) =>
    fetchJSON<any>('/api/v1/recalibrate', {
      method: 'POST',
      body: JSON.stringify(weights),
    }),
  switchCityProfile: (profile_id: string) =>
    fetchJSON<any>('/api/settings/profile', {
      method: 'POST',
      body: JSON.stringify({ profile_id }),
    }),

  // Dedicated Telemetry & GIS Endpoints
  getTelemetryFleet: () => fetchJSON<any[]>('/api/telemetry/fleet'),
  getGisZones: () => fetchJSON<any[]>('/api/gis/zones'),
  runShockwave: (scenario: WhatIfScenarioInput) =>
    fetchJSON<SimulationResultModel>('/api/simulator/shockwave', {
      method: 'POST',
      body: JSON.stringify(scenario),
    }),
};
