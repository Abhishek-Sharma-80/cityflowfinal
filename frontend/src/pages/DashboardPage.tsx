import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  Database,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Sparkles,
  Search,
  Plus,
  Minus,
  Layers,
  Crosshair,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Clock
} from 'lucide-react';
import type { LiveSnapshot } from '../hooks/useLiveData';
import type { ToastType } from '../hooks/useToast';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { api } from '../services/api';
import { mockZones, mockRoads, mockIncidents } from '../services/mockData';
import { ZoneModel, RoadSegmentModel, VehicleModel, LoadingZoneModel, IncidentModel } from '../types';

interface DashboardPageProps {
  liveSnapshot?: LiveSnapshot | null;
  addToast?: (type: ToastType, title: string, message: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ liveSnapshot: _liveSnapshot, addToast: _addToast }) => {
  const navigate = useNavigate();
  const [mapMode, setMapMode] = useState<'traffic' | 'risk' | 'incidents' | 'cctv' | 'metro'>('traffic');
  const [mapSearch, setMapSearch] = useState('');

  const [zones, setZones] = useState<ZoneModel[]>(mockZones);
  const [roads, setRoads] = useState<RoadSegmentModel[]>(mockRoads);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [loadingZones, setLoadingZones] = useState<LoadingZoneModel[]>([]);
  const [incidents, setIncidents] = useState<IncidentModel[]>(mockIncidents);
  const [selectedZoneId, setSelectedZoneId] = useState<string | undefined>();

  useEffect(() => {
    Promise.allSettled([
      api.getZones(),
      api.getRoads(),
      api.getVehicles(),
      api.getLoadingZones(),
      api.getIncidents(),
    ]).then(([zRes, rRes, vRes, lzRes, incRes]) => {
      if (zRes.status === 'fulfilled' && zRes.value?.length) setZones(zRes.value);
      if (rRes.status === 'fulfilled' && rRes.value?.length) setRoads(rRes.value);
      if (vRes.status === 'fulfilled' && vRes.value?.length) setVehicles(vRes.value);
      if (lzRes.status === 'fulfilled' && lzRes.value?.length) setLoadingZones(lzRes.value);
      if (incRes.status === 'fulfilled' && incRes.value?.length) setIncidents(incRes.value);
    });
  }, []);

  useEffect(() => {
    if (_liveSnapshot) {
      if (_liveSnapshot.zones?.length) {
        setZones(prev => prev.map(z => {
          const lz = _liveSnapshot.zones.find(x => x.id === z.id);
          return lz ? { ...z, pressure_score: lz.pressure_score, traffic_density: lz.traffic_density, avg_speed_kmh: lz.avg_speed_kmh } : z;
        }));
      }
      if (_liveSnapshot.roads?.length) {
        setRoads(prev => prev.map(r => {
          const lr = _liveSnapshot.roads.find(x => x.id === r.id);
          return lr ? { ...r, congestion_level: lr.congestion_level, current_speed_kmh: lr.current_speed_kmh } : r;
        }));
      }
      if (_liveSnapshot.vehicles?.length) {
        setVehicles(prev => prev.map(v => {
          const lv = _liveSnapshot.vehicles.find(x => x.id === v.id);
          return lv ? { ...v, lat: lv.lat, lng: lv.lng, current_speed_kmh: lv.speed_kmh } : v;
        }));
      }
    }
  }, [_liveSnapshot]);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto animate-fadeIn pb-10 text-slate-800">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO GREETING ROW (3 Cards)                       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Welcome Card (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Good morning, <strong className="text-slate-800">Abhishek</strong></span>
              <span>🌤️</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight leading-[1.1] mb-3">
              A Safer, Smarter <br />
              <span className="text-emerald-700">Bengaluru</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-sm">
              Real-time intelligence. Predictive insights. Smarter decisions for a better tomorrow.
            </p>
          </div>
          <div className="pt-4 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-400">Integrated Command & Control Centre v2.4</span>
          </div>
        </div>

        {/* Middle Bengaluru Skyline Banner Card (4 cols) */}
        <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-xs min-h-[170px] flex items-end p-6 group">
          <img
            src="/images/bengaluru_skyline_banner.jpg"
            alt="Bengaluru Skyline"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 text-white">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
              From data <br />
              to a better <span className="text-emerald-400">tomorrow.</span>
            </h3>
          </div>
        </div>

        {/* Right City Status Card (3 cols) */}
        <div className="md:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">City Status</h4>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center py-2">
            {/* Circular Gauge */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress arc (72%) */}
                  <path
                    className="text-emerald-600 transition-all duration-1000 ease-out"
                    strokeDasharray="72, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-extrabold text-slate-900 leading-none">72%</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium text-center mt-1 leading-tight">
                City Mobility Score
              </span>
            </div>

            {/* Micro Stats List */}
            <div className="col-span-7 space-y-1.5 pl-2 border-l border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Active Incidents</span>
                <span className="font-bold text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">High-Risk Corridors</span>
                <span className="font-bold text-slate-900">8</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Fleet Vehicles</span>
                <span className="font-bold text-slate-900">94</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Data Freshness</span>
                <span className="font-bold text-emerald-600">99.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SIX KPI METRIC CARDS ROW                          */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Traffic Health */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Traffic Health</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">32.1</span>
              <span className="text-xs text-slate-400 font-medium">km/h</span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center ml-auto">
                <ArrowUp className="w-3 h-3 inline" /> 12%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-emerald-700 font-medium">Normal Flow</span>
              <span>vs last hour</span>
            </div>
          </div>
          {/* Green Wave Sparkline */}
          <div className="mt-3 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" fill="none">
              <path
                d="M0 16 Q 15 20, 30 14 T 60 18 T 85 8 T 100 12"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: Road Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Road Risk</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">68</span>
              <span className="text-xs text-slate-400 font-medium">/100</span>
              <span className="text-[11px] text-rose-600 font-bold flex items-center ml-auto">
                <ArrowUp className="w-3 h-3 inline" /> 8%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-rose-600 font-medium">High Risk</span>
              <span>vs yesterday</span>
            </div>
          </div>
          {/* Red Bar Chart Mini */}
          <div className="mt-3 h-6 flex items-end justify-between px-1 gap-1">
            {[40, 55, 30, 70, 60, 85, 90].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-2 rounded-t-xs bg-rose-400/80" />
            ))}
          </div>
        </div>

        {/* KPI 3: Traffic Forecast */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Traffic Forecast</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">25</span>
              <span className="text-xs text-slate-400 font-medium">km/h</span>
              <span className="text-[11px] text-rose-600 font-bold flex items-center ml-auto">
                <ArrowDown className="w-3 h-3 inline" /> 18%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-purple-700 font-medium">AI Predicted</span>
              <span>in 15 mins</span>
            </div>
          </div>
          {/* Purple Sparkline */}
          <div className="mt-3 h-6 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" fill="none">
              <path
                d="M0 8 Q 20 6, 40 12 T 70 20 T 100 22"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 4: Active Incidents */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Active Incidents</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">3</span>
              <span className="text-xs text-slate-400 font-medium">reported</span>
              <span className="text-[11px] text-rose-600 font-bold flex items-center ml-auto">
                <ArrowUp className="w-3 h-3 inline" /> 1
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-amber-700 font-medium">Monitoring</span>
              <span>vs last hour</span>
            </div>
          </div>
          {/* Orange/Coral Bar Chart Mini */}
          <div className="mt-3 h-6 flex items-end justify-between px-1 gap-1">
            {[30, 45, 50, 60, 40, 75, 70].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-2 rounded-t-xs bg-amber-400/80" />
            ))}
          </div>
        </div>

        {/* KPI 5: Network Coverage */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <GitBranch className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Network Coverage</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">8</span>
              <span className="text-xs text-slate-400 font-medium">corridors</span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center ml-auto">
                100%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Across 6 urban sectors</span>
              <span className="text-emerald-700 font-medium">monitored</span>
            </div>
          </div>
          {/* Signal Indicator Bars */}
          <div className="mt-3 h-6 flex items-end justify-end gap-1.5">
            <div className="w-1.5 h-3 rounded-full bg-emerald-500"></div>
            <div className="w-1.5 h-4 rounded-full bg-emerald-500"></div>
            <div className="w-1.5 h-5 rounded-full bg-emerald-500"></div>
            <div className="w-1.5 h-6 rounded-full bg-emerald-500"></div>
          </div>
        </div>

        {/* KPI 6: Data Health */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Data Health</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-extrabold text-slate-900">99.8%</span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center ml-auto">
                <ArrowUp className="w-3 h-3 inline" /> 0.2%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-emerald-700 font-medium">Models Online</span>
              <span>fresh data</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MIDDLE SECTION: LIVE CITY MAP + RIGHT CARDS       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Real Live City Leaflet Map (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col relative min-h-[580px]">
          {/* Map Top Header Controls */}
          <div className="p-3.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-sm tracking-tight text-slate-900">Live City GIS Digital Twin</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Bengaluru Real-Time Telemetry
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/map')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Full GIS Screen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Leaflet Digital Twin Map */}
          <div className="flex-1 w-full relative">
            <CityDigitalTwinMap
              zones={zones}
              roads={roads}
              vehicles={vehicles}
              loadingZones={loadingZones}
              incidents={incidents}
              selectedZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
              heightClass="h-[520px]"
            />
          </div>
        </div>

        {/* Right Column: AI Insights & Sector Telemetry (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          {/* Card 1: AI Insights (Powered by Chronos-2 & XGBoost) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-900">AI Insights</span>
                <span className="text-[10px] text-slate-400 font-mono">Chronos-2 & XGBoost</span>
              </div>
              <button 
                onClick={() => navigate('/model-center')} 
                className="text-[11px] font-bold text-slate-600 hover:text-purple-600 flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              {/* Insight 1 */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Outer Ring Road congestion rising</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Traffic speed decreased by 14% in the last 20 minutes.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full shrink-0">
                  High Impact
                </span>
              </div>

              {/* Insight 2 */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Elevated road risk detected</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      3 locations require attention near Bellandur.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
                  Medium
                </span>
              </div>

              {/* Insight 3 */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Reroute recommendation</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Use Alternate Corridor via Hosur Elevated Tollway.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                  Action Needed
                </span>
              </div>

              {/* Insight 4 */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Normal metro operations</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      No major delays across Purple and Green lines.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  Stable
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Sector Telemetry (Silk Board Junction) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">Sector Telemetry</span>
                <span className="text-[10px] text-slate-400 font-mono">Silk Board Junction</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Avg Speed</span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">22.4 km/h</div>
                <span className="text-[10px] text-rose-600 font-bold flex items-center mt-0.5">
                  <ArrowDown className="w-2.5 h-2.5 mr-0.5" /> 6%
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Road Saturation</span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">84%</div>
                <span className="text-[10px] text-rose-600 font-bold flex items-center mt-0.5">
                  <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 12%
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Logistics Demand</span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">128</div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
                  <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 8%
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Active Vehicles</span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">94</div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
                  <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> 4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. BOTTOM SECTION: HIGH-RISK, INCIDENTS, PROMO       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: High-Risk Corridors (XGBoost Ranked) (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold text-slate-900">
                High-Risk Corridors <span className="text-slate-400 font-mono text-[10px] font-normal">(XGBoost Ranked)</span>
              </h4>
            </div>
            <button 
              onClick={() => navigate('/risk')} 
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100 pb-2">
                  <th className="py-2 font-semibold">#</th>
                  <th className="py-2 font-semibold">CORRIDOR</th>
                  <th className="py-2 font-semibold">SPEED</th>
                  <th className="py-2 font-semibold">RISK SCORE</th>
                  <th className="py-2 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: 1, name: 'Outer Ring Road (Silk Board - Bellandur)', speed: '18.5 km/h', score: 78, status: 'High', statusColor: 'bg-rose-50 text-rose-700' },
                  { id: 2, name: 'Hosur Road Elevated Tollway', speed: '32.0 km/h', score: 71, status: 'High', statusColor: 'bg-rose-50 text-rose-700' },
                  { id: 3, name: 'Old Airport Road - Marathahalli', speed: '21.0 km/h', score: 68, status: 'High', statusColor: 'bg-rose-50 text-rose-700' },
                  { id: 4, name: 'Koramangala 80ft Road Link', speed: '26.5 km/h', score: 58, status: 'Moderate', statusColor: 'bg-amber-50 text-amber-700' },
                  { id: 5, name: 'Hebbal Flyover Expressway', speed: '48.0 km/h', score: 35, status: 'Low', statusColor: 'bg-emerald-50 text-emerald-700' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2 text-slate-400 font-mono text-[11px]">{row.id}</td>
                    <td className="py-2 font-semibold text-slate-800 text-xs">{row.name}</td>
                    <td className="py-2 font-mono text-slate-600 text-xs">{row.speed}</td>
                    <td className="py-2 font-mono font-bold text-rose-600 text-xs">{row.score}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Active Road Incidents (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900">Active Road Incidents</h4>
            </div>
            <button 
              onClick={() => navigate('/incidents')} 
              className="text-[11px] font-bold text-slate-600 hover:text-amber-600 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100 pb-2">
                  <th className="py-2 font-semibold">SEVERITY</th>
                  <th className="py-2 font-semibold">INCIDENT</th>
                  <th className="py-2 font-semibold">LOCATION</th>
                  <th className="py-2 font-semibold">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { severity: 'Severe', sevColor: 'bg-rose-50 text-rose-700', name: 'Freight Breakdown Silk Board Ramp', loc: 'Silk Board', time: '18:42' },
                  { severity: 'Moderate', sevColor: 'bg-amber-50 text-amber-700', name: 'Namma Metro Yellow Line Barricade', loc: 'Bellandur', time: '16:08' },
                  { severity: 'Minor', sevColor: 'bg-blue-50 text-blue-700', name: 'Sony World Junction Drainage Work', loc: 'Koramangala', time: '17:30' },
                  { severity: 'Moderate', sevColor: 'bg-amber-50 text-amber-700', name: 'Outer Ring Road Lane Resurfacing', loc: 'Marathahalli', time: '14:12' },
                  { severity: 'Minor', sevColor: 'bg-blue-50 text-blue-700', name: 'Smart Signal Sync Check', loc: 'Indiranagar', time: '13:55' },
                ].map((inc, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inc.sevColor}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-2 font-semibold text-slate-800 text-xs truncate max-w-[140px]">{inc.name}</td>
                    <td className="py-2 text-slate-600 text-xs font-mono">{inc.loc}</td>
                    <td className="py-2 text-slate-400 text-xs font-mono">{inc.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3: Smarter Movement Promo Banner Card (3 cols) */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xs min-h-[220px] flex flex-col justify-between p-6 group">
          <img
            src="/images/highway_night_promo.jpg"
            alt="Night Highway"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

          <div className="relative z-10 text-white">
            <h4 className="text-xl font-extrabold tracking-tight leading-tight mb-2">
              Smarter <br />
              Movement. <br />
              Brighter Cities.
            </h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              AI-powered insights for a more connected Bengaluru.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/predictions')}
              className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-400">Chronos-2 v003</span>
          </div>
        </div>
      </div>
    </div>
  );
};
