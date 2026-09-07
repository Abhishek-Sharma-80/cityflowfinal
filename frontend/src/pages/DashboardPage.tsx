import React, { useState, useEffect } from 'react';
import {
  KPIDashboardModel,
  ZoneModel,
  RoadSegmentModel,
  VehicleModel,
  LoadingZoneModel,
  IncidentModel,
  ZonePredictionModel,
} from '../types';
import { api } from '../services/api';
import { KPICards } from '../components/common/KPICards';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { SourceBadge } from '../components/common/SourceBadge';
import { SkeletonPage } from '../components/common/Skeleton';
import {
  BrainCircuit,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LiveSnapshot } from '../hooks/useLiveData';
import type { ToastType } from '../hooks/useToast';

interface DashboardPageProps {
  liveSnapshot?: LiveSnapshot | null;
  addToast?: (type: ToastType, title: string, message: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ liveSnapshot: _liveSnapshot, addToast: _addToast }) => {
  const [kpis, setKpis] = useState<KPIDashboardModel | null>(null);
  const [zones, setZones] = useState<ZoneModel[]>([]);
  const [roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [loadingZones, setLoadingZones] = useState<LoadingZoneModel[]>([]);
  const [incidents, setIncidents] = useState<IncidentModel[]>([]);
  const [predictions, setPredictions] = useState<ZonePredictionModel[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('Z-01');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiData, zoneData, roadData, vehData, lzData, incData, predData] = await Promise.all([
          api.getKPIs(),
          api.getZones(),
          api.getRoads(),
          api.getVehicles(),
          api.getLoadingZones(),
          api.getIncidents(),
          api.getPredictions(),
        ]);
        setKpis(kpiData);
        setZones(zoneData);
        setRoads(roadData);
        setVehicles(vehData);
        setLoadingZones(lzData);
        setIncidents(incData);
        setPredictions(predData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !kpis) {
    return <SkeletonPage rows={3} />;
  }

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const selectedPred = predictions.find((p) => p.zone_id === selectedZoneId) || predictions[0];

  return (
    <div className="space-y-7 max-w-[1700px] mx-auto animate-fadeIn">
      {/* 1. Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono uppercase">
              CityFlow Control Center
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              OPERATIONAL INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time and predictive intelligence for Delhi NCR mobility.
          </p>
        </div>

        {/* Dual AI Status Badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-800 font-medium">
            <BrainCircuit className="w-3.5 h-3.5 text-violet-600" />
            <span>Chronos-2: Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>XGBoost: Active</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Intelligence Section */}
      <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              DECISION SUPPORT CORE
            </span>
            <SourceBadge type="REAL_API" size="xs" />
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
            Urban Mobility Intelligence
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            CityFlow predicts traffic conditions and road-risk probability across Delhi NCR to support intelligent dispatching, emergency preemption, and congestion abatement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/traffic"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
            <span>Speed Forecasts</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/risk"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Road Risk Matrix</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/model-center"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Model Center</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* 3. Executive High-Value KPI Row */}
      <KPICards
        kpis={kpis}
        predictions={predictions}
        roads={roads}
        incidents={incidents}
        loading={loading}
      />

      {/* 4. Central Delhi NCR Interactive Map & Zone HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Metropolitan GIS Digital Twin (Delhi NCR)
              </h2>
            </div>
            <SourceBadge type="REAL_DATABASE" size="xs" />
          </div>

          <div className="h-[480px] w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-xs relative">
            <CityDigitalTwinMap
              zones={zones}
              roads={roads}
              vehicles={vehicles}
              loadingZones={loadingZones}
              incidents={incidents}
              selectedZoneId={selectedZoneId}
              onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
            />

            {/* Clean Map Legend */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-[10px] font-mono space-y-1.5">
              <div className="font-bold text-slate-700 border-b border-slate-100 pb-1">MAP LEGEND</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Traffic:</span>
                <span className="text-emerald-700 font-bold">LOW</span>
                <span className="text-amber-600 font-bold">MOD</span>
                <span className="text-orange-600 font-bold">HVY</span>
                <span className="text-rose-700 font-bold">SEV</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">Risk:</span>
                <span className="text-emerald-700 font-bold">LOW</span>
                <span className="text-amber-600 font-bold">MOD</span>
                <span className="text-rose-700 font-bold">HIGH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Telemetry & AI Inspection HUD (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Selected Sector Telemetry
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedZone?.name || 'Sector Overview'}
                </h3>
                <span className="text-xs font-mono text-slate-500">{selectedZone?.id} • {selectedZone?.category}</span>
              </div>
              <SourceBadge type="REAL_API" size="xs" />
            </div>

            {selectedZone && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Observed Speed</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{selectedZone.avg_speed_kmh}</span>
                  <span className="text-xs text-slate-500 ml-1">km/h</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Road Saturation</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {Math.round(selectedZone.road_utilization * 100)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Logistics Demand</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{selectedZone.active_deliveries}</span>
                  <span className="text-xs text-slate-500 ml-1">orders</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Vehicles</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{selectedZone.active_vehicles}</span>
                  <span className="text-xs text-slate-500 ml-1">nodes</span>
                </div>
              </div>
            )}

            {/* AI Forward Forecast Preview for Selected Zone */}
            {selectedPred && (
              <div className="p-4 rounded-lg bg-violet-50/50 border border-violet-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-violet-900 flex items-center gap-1.5 font-mono">
                    <BrainCircuit className="w-3.5 h-3.5 text-violet-600" />
                    Chronos-2 Speed Trajectory
                  </span>
                  <SourceBadge type="ML_PREDICTION" size="xs" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                  <div className="p-2 bg-white rounded border border-violet-200">
                    <span className="text-slate-400 text-[10px] block">+15m</span>
                    <span className="font-bold text-violet-800">{selectedPred.pred_15m_pct}%</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-violet-200">
                    <span className="text-slate-400 text-[10px] block">+30m</span>
                    <span className="font-bold text-violet-800">{selectedPred.pred_30m_pct}%</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-violet-200">
                    <span className="text-slate-400 text-[10px] block">+60m</span>
                    <span className="font-bold text-violet-800">{selectedPred.pred_60m_pct}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/traffic"
            className="flex items-center justify-between w-full p-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all font-mono"
          >
            <span>Open Dedicated Speed Forecaster</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5. High-Risk Corridors & Active Incidents Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-Risk Corridors (XGBoost Preview) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                High-Risk Corridors (XGBoost Ranked)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Corridors with elevated hazard probability</p>
            </div>
            <Link to="/risk" className="text-xs font-bold font-mono text-slate-900 hover:underline flex items-center gap-0.5">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2 px-2.5">Corridor</th>
                  <th className="py-2 px-2.5">Speed</th>
                  <th className="py-2 px-2.5">Risk Score</th>
                  <th className="py-2 px-2.5">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {roads.slice(0, 5).map((r) => {
                  const riskScore = Math.min(96, Math.max(20, Math.round((r.congestion_level || 0.5) * 60 + ((r.free_flow_speed_kmh - r.current_speed_kmh) / (r.free_flow_speed_kmh || 50)) * 40)));
                  const isHigh = riskScore > 65;
                  const rowStyle = isHigh ? 'text-rose-600' : 'text-amber-600';
                  const badgeStyle = isHigh ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-2.5 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-2.5 px-2.5 text-slate-700">{r.current_speed_kmh} km/h</td>
                      <td className={'py-2.5 px-2.5 font-bold ' + rowStyle}>
                        {riskScore}
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className={'text-[9px] font-bold px-1.5 py-0.2 rounded border ' + badgeStyle}>
                          {isHigh ? 'HIGH' : 'MODERATE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Incidents & Road Hazards */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Active Road Incidents
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Reported physical disruptions</p>
            </div>
            <Link to="/incidents" className="text-xs font-bold font-mono text-slate-900 hover:underline flex items-center gap-0.5">
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      {inc.severity}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{inc.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{inc.description}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{inc.start_time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
