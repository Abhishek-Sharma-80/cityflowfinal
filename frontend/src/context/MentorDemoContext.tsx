import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ScenarioType = 'NORMAL' | 'RUSH_HOUR' | 'INCIDENT' | 'WEATHER';

export interface SectorInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pressure: number;
  density: number;
  speedDeficit: number; // km/h below free flow
  incomingFreight: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CRITICAL' | 'SATURATED';
  description: string;
}

export interface VehicleTelemetry {
  id: string;
  callsign: string;
  type: 'ELECTRIC_VAN' | 'EV_2W_CARGO' | 'HEAVY_FREIGHT' | 'AUTONOMOUS_POD';
  battery_soc_pct: number;
  current_speed_kmh: number;
  destination: string;
  status: 'EN_ROUTE' | 'CHARGING' | 'CRITICAL_BATTERY' | 'IDLE' | 'REROUTING';
  assigned_bay?: string;
  eta_mins: number;
  cargo_kg: number;
}

export interface ModelRegistryEntry {
  id: string;
  version: string;
  architecture: string;
  trained_on: string;
  r2: number;
  mae: number;
  rmse: number;
  status: 'ACTIVE_CHAMPION' | 'EVALUATING' | 'ARCHIVED';
  timestamp: string;
}

interface MentorDemoContextType {
  // Active Scenario
  activeScenario: ScenarioType;
  isSimulating: boolean;
  activeScenarioName: string;
  setScenario: (scenario: ScenarioType) => void;
  runLiveScenario: (scenario?: ScenarioType) => Promise<void>;
  resetToBaseline: () => void;
  
  // Universal KPI Overrides (Animated)
  cityPressure: number;
  aiStability: number;
  activeFleet: number;
  activeCorridors: number;
  co2SavedKg: number;
  incidentsCount: number;

  // 1. Overview Dashboard
  activeEarlyWarnings: Array<{ id: string; title: string; zone: string; severity: 'HIGH' | 'CRITICAL' | 'INFO'; time: string; action: string }>;
  activeBlockages: Array<{ id: string; name: string; lat: number; lng: number; delay_mins: number }>;

  // 2. Metropolitan GIS Map (10 Bengaluru Sectors)
  sectors: SectorInfo[];
  selectedSector: SectorInfo | null;
  setSelectedSector: (sector: SectorInfo | null) => void;
  rerouteSectorFleet: (sectorId: string) => void;

  // 3. Fleet Telematics
  fleet: VehicleTelemetry[];
  injectBatteryCritical: () => void;
  boostFleetSpeed: () => void;

  // 4. ML Intelligence
  isRetraining: boolean;
  retrainProgress: number;
  models: ModelRegistryEntry[];
  retrainOnRealData: () => Promise<void>;

  // 5. Data Quality & Ingestion
  qualityScore: number;
  dataDriftDetected: boolean;
  driftStatus: string;
  anomaliesCount: number;
  injectSensorNoise: () => void;
  cleanseDataStream: () => void;

  // 6. Smart Routing (Pareto)
  selectedOrigin: string;
  selectedDestination: string;
  setSelectedOrigin: (o: string) => void;
  setSelectedDestination: (d: string) => void;
  isCalculatingPareto: boolean;
  paretoRoutes: any[];
  calculateParetoPaths: () => Promise<void>;

  // 7. Delivery Slots
  isResolvingSlots: boolean;
  dwellCutMins: number;
  peakDeliveriesRedistributed: number;
  resolveSlotOptimizer: () => Promise<void>;

  // 8. Smart Loading Bays
  loadingBays: Array<{ id: string; name: string; sector: string; occupied: number; total: number; status: string; queueMins: number }>;
  bayAlert: string | null;
  suggestedBay: string | null;
  simulateBaySaturation: () => void;
  clearBaySaturation: () => void;

  // 9. Predictive Congestion
  selectedHorizon: '15' | '30' | '60';
  setSelectedHorizon: (h: '15' | '30' | '60') => void;
  shapWeights: Array<{ factor: string; impact: number }>;

  // 10. What-If Simulation Sandbox
  demandSurgeSlider: number;
  passengerInfluxSlider: number;
  setDemandSurgeSlider: (val: number) => void;
  setPassengerInfluxSlider: (val: number) => void;
  simulatedShockwaveImpact: { avgSpeedDrop: number; extraDelayMins: number; co2SurgeKg: number };

  // 11. Emergency Green Wave
  emergencyCallsign: string;
  emergencyHospital: string;
  setEmergencyCallsign: (c: string) => void;
  setEmergencyHospital: (h: string) => void;
  isGreenWaveEngaged: boolean;
  emergencyEtaMins: number;
  engageEmergencyGreenWave: () => void;
  disengageEmergencyGreenWave: () => void;
}

const INITIAL_SECTORS: SectorInfo[] = [
  { id: 'SEC-01', name: 'CBD (MG Road / Brigade)', lat: 12.9716, lng: 77.5946, pressure: 74, density: 82, speedDeficit: 18, incomingFreight: 64, status: 'CRITICAL', description: 'Heavy commercial loading & private transit merge.' },
  { id: 'SEC-02', name: 'Indiranagar 100ft Hub', lat: 12.9784, lng: 77.6408, pressure: 68, density: 71, speedDeficit: 12, incomingFreight: 38, status: 'MODERATE', description: 'Curbside last-mile courier demand.' },
  { id: 'SEC-03', name: 'Frazer Town & Cantonment', lat: 12.9968, lng: 77.6130, pressure: 52, density: 56, speedDeficit: 8, incomingFreight: 22, status: 'OPTIMAL', description: 'Smooth arterial flow with synchronized splits.' },
  { id: 'SEC-04', name: 'Whitefield Tech Corridor', lat: 12.9698, lng: 77.7499, pressure: 84, density: 89, speedDeficit: 24, incomingFreight: 92, status: 'SATURATED', description: 'High-density tech shuttle & intermodal freight pulse.' },
  { id: 'SEC-05', name: 'Koramangala Sony World Hub', lat: 12.9352, lng: 77.6245, pressure: 79, density: 83, speedDeficit: 19, incomingFreight: 58, status: 'CRITICAL', description: 'Commercial ring feeder queue spillback.' },
  { id: 'SEC-06', name: 'Peenya Industrial Complex', lat: 13.0285, lng: 77.5197, pressure: 71, density: 75, speedDeficit: 15, incomingFreight: 110, status: 'MODERATE', description: 'Heavy Class-4 freight departure wave.' },
  { id: 'SEC-07', name: 'Electronic City Tollway Gateway', lat: 12.8452, lng: 77.6602, pressure: 66, density: 68, speedDeficit: 11, incomingFreight: 46, status: 'MODERATE', description: 'Elevated expressway ramp metering active.' },
  { id: 'SEC-08', name: 'HSR Layout Sector 2 Ring', lat: 12.9121, lng: 77.6446, pressure: 58, density: 62, speedDeficit: 9, incomingFreight: 30, status: 'OPTIMAL', description: 'Dynamic micro-hub routing absorbing pulses.' },
  { id: 'SEC-09', name: 'Malleshwaram 8th Cross Arterial', lat: 13.0031, lng: 77.5643, pressure: 63, density: 65, speedDeficit: 10, incomingFreight: 28, status: 'OPTIMAL', description: 'Retail delivery zone with metered parking.' },
  { id: 'SEC-10', name: 'Hebbal Flyover Interchange', lat: 13.0358, lng: 77.5970, pressure: 88, density: 91, speedDeficit: 26, incomingFreight: 85, status: 'SATURATED', description: 'Airport corridor & heavy ring interchange convergence.' }
];

const INITIAL_FLEET: VehicleTelemetry[] = Array.from({ length: 40 }, (_, i) => {
  const types: ('ELECTRIC_VAN' | 'EV_2W_CARGO' | 'HEAVY_FREIGHT' | 'AUTONOMOUS_POD')[] = [
    'ELECTRIC_VAN', 'ELECTRIC_VAN', 'EV_2W_CARGO', 'EV_2W_CARGO', 'HEAVY_FREIGHT', 'AUTONOMOUS_POD'
  ];
  const dests = ['Peenya Industrial', 'CBD MG Road', 'Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City'];
  const type = types[i % types.length];
  const num = (i + 1).toString().padStart(3, '0');
  return {
    id: `FLT-${num}`,
    callsign: `BLR-${type === 'ELECTRIC_VAN' ? 'EV' : type === 'EV_2W_CARGO' ? '2W' : type === 'HEAVY_FREIGHT' ? 'HV' : 'POD'}-${num}`,
    type,
    battery_soc_pct: Math.floor(45 + Math.random() * 52),
    current_speed_kmh: Math.floor(25 + Math.random() * 35),
    destination: dests[i % dests.length],
    status: 'EN_ROUTE',
    eta_mins: Math.floor(8 + Math.random() * 28),
    cargo_kg: type === 'HEAVY_FREIGHT' ? 2400 : type === 'ELECTRIC_VAN' ? 450 : type === 'EV_2W_CARGO' ? 65 : 180,
    assigned_bay: `BAY-${(i % 12) + 1}`
  };
});

const INITIAL_MODELS: ModelRegistryEntry[] = [
  { id: 'MOD-V402', version: 'v4.0.2', architecture: 'RandomForest + LightGBM Ensemble', trained_on: '9,408 Real PEMS Observations', r2: 0.9918, mae: 0.0019, rmse: 0.0038, status: 'ACTIVE_CHAMPION', timestamp: '2026-09-07 16:30 UTC' },
  { id: 'MOD-V388', version: 'v3.8.8', architecture: 'Spatio-Temporal Graph Neural Net (ST-GNN)', trained_on: '6,575 Bengaluru Telemetry Records', r2: 0.9842, mae: 0.0034, rmse: 0.0062, status: 'EVALUATING', timestamp: '2026-09-06 11:20 UTC' },
  { id: 'MOD-V350', version: 'v3.5.0', architecture: 'XGBoost Baseline', trained_on: '4,200 Historic Sensor Rows', r2: 0.9610, mae: 0.0068, rmse: 0.0120, status: 'ARCHIVED', timestamp: '2026-09-01 08:00 UTC' }
];

const INITIAL_BAYS = [
  { id: 'BAY-01', name: 'CBD MG Road Plaza', sector: 'CBD', occupied: 10, total: 12, status: 'HIGH', queueMins: 4 },
  { id: 'BAY-02', name: 'Brigade Road Retail Zone', sector: 'CBD', occupied: 8, total: 8, status: 'SATURATED', queueMins: 9 },
  { id: 'BAY-03', name: 'Indiranagar 100ft East', sector: 'Indiranagar', occupied: 4, total: 6, status: 'OPTIMAL', queueMins: 0 },
  { id: 'BAY-04', name: 'Indiranagar Metro Micro-Hub', sector: 'Indiranagar', occupied: 5, total: 6, status: 'OPTIMAL', queueMins: 2 },
  { id: 'BAY-05', name: 'Whitefield ITPL Logistics Bay', sector: 'Whitefield', occupied: 14, total: 16, status: 'HIGH', queueMins: 6 },
  { id: 'BAY-06', name: 'Whitefield EPIP Depot', sector: 'Whitefield', occupied: 7, total: 10, status: 'OPTIMAL', queueMins: 0 },
  { id: 'BAY-07', name: 'Koramangala 5th Block Bay', sector: 'Koramangala', occupied: 6, total: 8, status: 'OPTIMAL', queueMins: 1 },
  { id: 'BAY-08', name: 'Sony World Freight Node', sector: 'Koramangala', occupied: 9, total: 10, status: 'HIGH', queueMins: 5 },
  { id: 'BAY-09', name: 'Peenya Intermodal Bay A', sector: 'Peenya', occupied: 18, total: 20, status: 'HIGH', queueMins: 7 },
  { id: 'BAY-10', name: 'Peenya Express Depot', sector: 'Peenya', occupied: 8, total: 12, status: 'OPTIMAL', queueMins: 0 },
  { id: 'BAY-11', name: 'Electronic City Phase 1 Hub', sector: 'Electronic City', occupied: 6, total: 10, status: 'OPTIMAL', queueMins: 0 },
  { id: 'BAY-12', name: 'Hebbal Outer Ring Depot', sector: 'Hebbal', occupied: 11, total: 12, status: 'HIGH', queueMins: 8 }
];

const MentorDemoContext = createContext<MentorDemoContextType | null>(null);

export const MentorDemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('NORMAL');
  const [isSimulating, setIsSimulating] = useState(false);

  // Global KPIs
  const [cityPressure, setCityPressure] = useState<number>(72);
  const [aiStability, setAiStability] = useState<number>(98.9);
  const [activeFleet, setActiveFleet] = useState<number>(480);
  const [activeCorridors, setActiveCorridors] = useState<number>(2);
  const [co2SavedKg, setCo2SavedKg] = useState<number>(1420);
  const [incidentsCount, setIncidentsCount] = useState<number>(1);

  // Overview Radar & Blockages
  const [activeEarlyWarnings, setActiveEarlyWarnings] = useState<Array<{ id: string; title: string; zone: string; severity: 'HIGH' | 'CRITICAL' | 'INFO'; time: string; action: string }>>([
    { id: 'EW-1', title: 'Curbside Loading Bottleneck', zone: 'CBD MG Road', severity: 'HIGH', time: '2 mins ago', action: 'Dynamic bay metered pricing' },
    { id: 'EW-2', title: 'Signal Phase Desync', zone: 'Indiranagar 100ft', severity: 'INFO', time: '7 mins ago', action: 'Offset harmonized to 50s cycle' }
  ]);
  const [activeBlockages, setActiveBlockages] = useState([
    { id: 'BLK-1', name: '5th Ave Metro Construction Lane Restriction', lat: 12.973, lng: 77.602, delay_mins: 8.5 }
  ]);

  // GIS Sectors
  const [sectors, setSectors] = useState<SectorInfo[]>(INITIAL_SECTORS);
  const [selectedSector, setSelectedSector] = useState<SectorInfo | null>(INITIAL_SECTORS[0]);

  // Fleet
  const [fleet, setFleet] = useState<VehicleTelemetry[]>(INITIAL_FLEET);

  // ML Intelligence
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [models, setModels] = useState<ModelRegistryEntry[]>(INITIAL_MODELS);

  // Data Quality
  const [qualityScore, setQualityScore] = useState(99.4);
  const [dataDriftDetected, setDataDriftDetected] = useState(false);
  const [driftStatus, setDriftStatus] = useState('STABLE · (IQR Z-Score: 0.42)');
  const [anomaliesCount, setAnomaliesCount] = useState(3);

  // Smart Routing
  const [selectedOrigin, setSelectedOrigin] = useState('Peenya Industrial');
  const [selectedDestination, setSelectedDestination] = useState('CBD MG Road');
  const [isCalculatingPareto, setIsCalculatingPareto] = useState(false);
  const [paretoRoutes, setParetoRoutes] = useState<any[]>([]);

  // Delivery Slots
  const [isResolvingSlots, setIsResolvingSlots] = useState(false);
  const [dwellCutMins, setDwellCutMins] = useState(14.2);
  const [peakDeliveriesRedistributed, setPeakDeliveriesRedistributed] = useState(8);

  // Loading Bays
  const [loadingBays, setLoadingBays] = useState(INITIAL_BAYS);
  const [bayAlert, setBayAlert] = useState<string | null>(null);
  const [suggestedBay, setSuggestedBay] = useState<string | null>(null);

  // Predictive Congestion
  const [selectedHorizon, setSelectedHorizon] = useState<'15' | '30' | '60'>('15');
  const [shapWeights, setShapWeights] = useState([
    { factor: 'FREIGHT SURGE', impact: 38.5 },
    { factor: 'CURBSIDE DENSITY', impact: 26.2 },
    { factor: 'SIGNAL SPLIT DESYNC', impact: 19.4 },
    { factor: 'ROAD FRICTION', impact: 15.9 }
  ]);

  // What-If Simulator
  const [demandSurgeSlider, setDemandSurgeSlider] = useState<number>(0);
  const [passengerInfluxSlider, setPassengerInfluxSlider] = useState<number>(0);

  // Emergency Green Wave
  const [emergencyCallsign, setEmergencyCallsign] = useState('MED-ICU-09');
  const [emergencyHospital, setEmergencyHospital] = useState('Victoria Hospital Trauma Center');
  const [isGreenWaveEngaged, setIsGreenWaveEngaged] = useState(false);
  const [emergencyEtaMins, setEmergencyEtaMins] = useState(24);

  // Scenario Switcher Logic
  const setScenario = useCallback((scenario: ScenarioType) => {
    setActiveScenario(scenario);
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      if (scenario === 'RUSH_HOUR') {
        setCityPressure(89);
        setAiStability(94.1);
        setActiveFleet(520);
        setActiveCorridors(4);
        setCo2SavedKg(1180);
        setIncidentsCount(4);
        setActiveEarlyWarnings([
          { id: 'EW-RUSH-1', title: 'High-Priority Corridor Shockwave', zone: 'Hebbal & CBD Gateway', severity: 'CRITICAL', time: 'Just now', action: 'Inbound freight throttling active' },
          { id: 'EW-RUSH-2', title: 'Peenya Intermodal Overflow', zone: 'Peenya Sector 6', severity: 'HIGH', time: '1 min ago', action: 'Dynamic gate metering engaged' }
        ]);
        setActiveBlockages([
          { id: 'BLK-R1', name: 'Hebbal Flyover Ramp Spillback', lat: 13.035, lng: 77.597, delay_mins: 18.2 },
          { id: 'BLK-R2', name: 'MG Road Curbside Heavy Staging', lat: 12.971, lng: 77.594, delay_mins: 14.5 },
          { id: 'BLK-R3', name: 'Whitefield ITPL Main Road Gridlock', lat: 12.969, lng: 77.749, delay_mins: 22.0 },
          { id: 'BLK-R4', name: 'Sony World Junction Queue Lock', lat: 12.935, lng: 77.624, delay_mins: 16.4 }
        ]);
        setSectors(prev => prev.map(s => ({
          ...s,
          pressure: Math.min(96, Math.floor(s.pressure * 1.25)),
          density: Math.min(98, Math.floor(s.density * 1.22)),
          speedDeficit: Math.min(32, Math.floor(s.speedDeficit * 1.4)),
          status: s.pressure > 70 ? 'SATURATED' : 'CRITICAL'
        })));
      } else if (scenario === 'INCIDENT') {
        setCityPressure(83);
        setAiStability(96.4);
        setIncidentsCount(5);
        setActiveEarlyWarnings([
          { id: 'EW-INC-1', title: 'Class-4 Freight Axle Stall', zone: 'Peenya Industrial Ring', severity: 'CRITICAL', time: 'Just now', action: 'Emergency towing dispatched, detour via NH-48' }
        ]);
        setActiveBlockages([
          { id: 'BLK-I1', name: 'Peenya Axle Stall Obstruction', lat: 13.028, lng: 77.519, delay_mins: 24.0 }
        ]);
      } else if (scenario === 'WEATHER') {
        setCityPressure(81);
        setAiStability(95.8);
        setSectors(prev => prev.map(s => ({
          ...s,
          speedDeficit: Math.min(30, s.speedDeficit + 8)
        })));
      } else {
        // RESET TO NORMAL
        setCityPressure(72);
        setAiStability(98.9);
        setActiveFleet(480);
        setActiveCorridors(2);
        setCo2SavedKg(1420);
        setIncidentsCount(1);
        setSectors(INITIAL_SECTORS);
        setActiveEarlyWarnings([
          { id: 'EW-1', title: 'Curbside Loading Bottleneck', zone: 'CBD MG Road', severity: 'HIGH', time: '2 mins ago', action: 'Dynamic bay metered pricing' },
          { id: 'EW-2', title: 'Signal Phase Desync', zone: 'Indiranagar 100ft', severity: 'INFO', time: '7 mins ago', action: 'Offset harmonized to 50s cycle' }
        ]);
        setActiveBlockages([
          { id: 'BLK-1', name: '5th Ave Metro Construction Lane Restriction', lat: 12.973, lng: 77.602, delay_mins: 8.5 }
        ]);
      }
    }, 200);
  }, []);

  const runLiveScenario = useCallback(async (scenario?: ScenarioType) => {
    const target = scenario || (activeScenario === 'NORMAL' ? 'RUSH_HOUR' : activeScenario);
    setScenario(target);
  }, [activeScenario, setScenario]);

  const resetToBaseline = useCallback(() => {
    setScenario('NORMAL');
    setQualityScore(99.4);
    setDataDriftDetected(false);
    setDriftStatus('STABLE · (IQR Z-Score: 0.42)');
    setAnomaliesCount(3);
    setFleet(INITIAL_FLEET);
    setLoadingBays(INITIAL_BAYS);
    setBayAlert(null);
    setSuggestedBay(null);
    setDemandSurgeSlider(0);
    setPassengerInfluxSlider(0);
    setIsGreenWaveEngaged(false);
    setEmergencyEtaMins(24);
  }, [setScenario]);

  // Page 2: Reroute Sector Fleet
  const rerouteSectorFleet = useCallback((sectorId: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === sectorId) {
        return {
          ...s,
          pressure: Math.max(35, s.pressure - 22),
          density: Math.max(40, s.density - 20),
          speedDeficit: Math.max(4, s.speedDeficit - 8),
          incomingFreight: Math.max(10, s.incomingFreight - 30),
          status: 'OPTIMAL'
        };
      }
      return s;
    }));
    setSelectedSector(prev => prev ? { ...prev, pressure: Math.max(35, prev.pressure - 22), status: 'OPTIMAL' } : null);
  }, []);

  // Page 3: Inject Battery Critical
  const injectBatteryCritical = useCallback(() => {
    setFleet(prev => {
      const copy = [...prev];
      const evIndex = copy.findIndex(v => v.type === 'ELECTRIC_VAN' && v.status === 'EN_ROUTE');
      const idx = evIndex >= 0 ? evIndex : 0;
      const target = copy[idx];
      const updated: VehicleTelemetry = {
        ...target,
        battery_soc_pct: 11,
        status: 'CRITICAL_BATTERY',
        destination: 'DC 60kW Fast-Charge Station #4 (Peenya Industrial)',
        eta_mins: 4
      };
      copy.splice(idx, 1);
      return [updated, ...copy]; // Move to top of table
    });
  }, []);

  const boostFleetSpeed = useCallback(() => {
    setFleet(prev => prev.map(v => ({
      ...v,
      current_speed_kmh: Math.min(65, v.current_speed_kmh + 10),
      eta_mins: Math.max(2, v.eta_mins - 3)
    })));
  }, []);

  // Page 4: Retrain on Real Data
  const retrainOnRealData = useCallback(async () => {
    setIsRetraining(true);
    setRetrainProgress(0);

    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 280));
      setRetrainProgress(i * 10);
    }

    const newModel: ModelRegistryEntry = {
      id: `MOD-V${Math.floor(410 + Math.random() * 20)}`,
      version: `v4.${Math.floor(1 + Math.random() * 9)}.${Math.floor(Math.random() * 9)}`,
      architecture: 'RandomForest + LightGBM Ensemble (Calibrated)',
      trained_on: '9,408 Real Observations (Cross-Validated 5-Fold)',
      r2: 0.9892,
      mae: 0.0023,
      rmse: 0.0041,
      status: 'ACTIVE_CHAMPION',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    };

    setModels(prev => [
      newModel,
      ...prev.map((m, i) => i === 0 ? { ...m, status: 'EVALUATING' as const } : m)
    ]);
    setIsRetraining(false);
  }, []);

  // Page 5: Inject Sensor Noise
  const injectSensorNoise = useCallback(() => {
    setQualityScore(94.2);
    setDataDriftDetected(true);
    setDriftStatus('DRIFT DETECTED (IQR Z-Score > 3.0)');
    setAnomaliesCount(123);
  }, []);

  const cleanseDataStream = useCallback(() => {
    setQualityScore(99.8);
    setDataDriftDetected(false);
    setDriftStatus('STABLE · (IQR Z-Score: 0.28)');
    setAnomaliesCount(0);
  }, []);

  // Page 6: Calculate Pareto Paths
  const calculateParetoPaths = useCallback(async () => {
    setIsCalculatingPareto(true);
    await new Promise(r => setTimeout(r, 600));
    setParetoRoutes([
      {
        id: 'PAR-1',
        name: 'Fastest Arterial (Expressway Wave)',
        duration_mins: 18.5,
        distance_km: 12.4,
        co2_kg: 2.1,
        toll_inr: 80,
        eco_score: 82,
        is_recommended: false,
        tag: 'MINIMUM DURATION',
        color: '#2563eb'
      },
      {
        id: 'PAR-2',
        name: 'Eco-Balanced (Smart Signal Preemption)',
        duration_mins: 21.0,
        distance_km: 11.8,
        co2_kg: 1.3,
        toll_inr: 0,
        eco_score: 96,
        is_recommended: true,
        tag: 'PARETO CHAMPION',
        color: '#059669'
      },
      {
        id: 'PAR-3',
        name: 'Zero-Toll Secondary Corridor',
        duration_mins: 25.2,
        distance_km: 13.1,
        co2_kg: 1.9,
        toll_inr: 0,
        eco_score: 86,
        is_recommended: false,
        tag: 'LOWEST COST',
        color: '#d97706'
      },
      {
        id: 'PAR-4',
        name: 'EV Regenerative Braking Route',
        duration_mins: 23.4,
        distance_km: 12.0,
        co2_kg: 0.8,
        toll_inr: 0,
        eco_score: 99,
        is_recommended: false,
        tag: 'ZERO EMISSION BEST',
        color: '#7c3aed'
      }
    ]);
    setIsCalculatingPareto(false);
  }, []);

  // Page 7: Re-solve Slot Optimizer
  const resolveSlotOptimizer = useCallback(async () => {
    setIsResolvingSlots(true);
    await new Promise(r => setTimeout(r, 700));
    setDwellCutMins(18.4);
    setPeakDeliveriesRedistributed(13);
    setIsResolvingSlots(false);
  }, []);

  // Page 8: Simulate Bay Saturation
  const simulateBaySaturation = useCallback(() => {
    setLoadingBays(prev => prev.map(b => {
      if (b.id === 'BAY-01') {
        return { ...b, occupied: 12, total: 12, status: 'SATURATED', queueMins: 16 };
      }
      return b;
    }));
    setBayAlert('CBD Plaza 12/12 Bays Saturated: High queue penalty triggering dynamic diversion.');
    setSuggestedBay('Indiranagar Metro Micro-Hub (BAY-04) · 250m walking radius · 2 open bays');
  }, []);

  const clearBaySaturation = useCallback(() => {
    setLoadingBays(INITIAL_BAYS);
    setBayAlert(null);
    setSuggestedBay(null);
  }, []);

  // Page 9: Horizon Selection & SHAP adjustments
  useEffect(() => {
    if (selectedHorizon === '60') {
      setShapWeights([
        { factor: 'LOGISTICS SURGE', impact: 42.0 },
        { factor: 'CURBSIDE DENSITY', impact: 28.5 },
        { factor: 'WEATHER FRICTION', impact: 18.5 },
        { factor: 'HISTORICAL PATTERN', impact: 11.0 }
      ]);
    } else if (selectedHorizon === '30') {
      setShapWeights([
        { factor: 'LOGISTICS SURGE', impact: 36.2 },
        { factor: 'CURBSIDE DENSITY', impact: 30.1 },
        { factor: 'SIGNAL SPLIT DESYNC', impact: 19.8 },
        { factor: 'WEATHER FRICTION', impact: 13.9 }
      ]);
    } else {
      setShapWeights([
        { factor: 'FREIGHT SURGE', impact: 38.5 },
        { factor: 'CURBSIDE DENSITY', impact: 26.2 },
        { factor: 'SIGNAL SPLIT DESYNC', impact: 19.4 },
        { factor: 'ROAD FRICTION', impact: 15.9 }
      ]);
    }
  }, [selectedHorizon]);

  // Page 10: Sliders Shockwave Impact calculation
  const simulatedShockwaveImpact = {
    avgSpeedDrop: Number((demandSurgeSlider * 0.35 + passengerInfluxSlider * 0.28).toFixed(1)),
    extraDelayMins: Number((demandSurgeSlider * 0.42 + passengerInfluxSlider * 0.36).toFixed(1)),
    co2SurgeKg: Number((demandSurgeSlider * 12.5 + passengerInfluxSlider * 8.2).toFixed(0))
  };

  // Page 11: Engage Emergency Green Wave
  const engageEmergencyGreenWave = useCallback(() => {
    setIsGreenWaveEngaged(true);
    setEmergencyEtaMins(14); // 24m -> 14m (-41%)
  }, []);

  const disengageEmergencyGreenWave = useCallback(() => {
    setIsGreenWaveEngaged(false);
    setEmergencyEtaMins(24);
  }, []);

  const activeScenarioName = 
    activeScenario === 'RUSH_HOUR' ? 'Peak Rush Hour Surge (+35%)' :
    activeScenario === 'INCIDENT' ? 'Incident / Road Blockage' :
    activeScenario === 'WEATHER' ? 'Bad Weather Delay' : 'Normal Flow Baseline';

  return (
    <MentorDemoContext.Provider
      value={{
        activeScenario,
        isSimulating,
        activeScenarioName,
        setScenario,
        runLiveScenario,
        resetToBaseline,

        cityPressure,
        aiStability,
        activeFleet,
        activeCorridors,
        co2SavedKg,
        incidentsCount,

        activeEarlyWarnings,
        activeBlockages,

        sectors,
        selectedSector,
        setSelectedSector,
        rerouteSectorFleet,

        fleet,
        injectBatteryCritical,
        boostFleetSpeed,

        isRetraining,
        retrainProgress,
        models,
        retrainOnRealData,

        qualityScore,
        dataDriftDetected,
        driftStatus,
        anomaliesCount,
        injectSensorNoise,
        cleanseDataStream,

        selectedOrigin,
        selectedDestination,
        setSelectedOrigin,
        setSelectedDestination,
        isCalculatingPareto,
        paretoRoutes,
        calculateParetoPaths,

        isResolvingSlots,
        dwellCutMins,
        peakDeliveriesRedistributed,
        resolveSlotOptimizer,

        loadingBays,
        bayAlert,
        suggestedBay,
        simulateBaySaturation,
        clearBaySaturation,

        selectedHorizon,
        setSelectedHorizon,
        shapWeights,

        demandSurgeSlider,
        passengerInfluxSlider,
        setDemandSurgeSlider,
        setPassengerInfluxSlider,
        simulatedShockwaveImpact,

        emergencyCallsign,
        emergencyHospital,
        setEmergencyCallsign,
        setEmergencyHospital,
        isGreenWaveEngaged,
        emergencyEtaMins,
        engageEmergencyGreenWave,
        disengageEmergencyGreenWave
      }}
    >
      {children}
    </MentorDemoContext.Provider>
  );
};

export const useMentorDemo = () => {
  const context = useContext(MentorDemoContext);
  if (!context) {
    throw new Error('useMentorDemo must be used within a MentorDemoProvider');
  }
  return context;
};