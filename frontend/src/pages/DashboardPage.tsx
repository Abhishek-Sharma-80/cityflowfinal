import React, { useState, useEffect } from 'react';
import { KPIDashboardModel, ZoneModel, RoadSegmentModel, VehicleModel, LoadingZoneModel, IncidentModel, ZonePredictionModel, PressureClass } from '../types';
import { api } from '../services/api';
import { KPICards } from '../components/common/KPICards';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { useMentorDemo } from '../context/MentorDemoContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BrainCircuit,
  Activity,
  AlertTriangle,
  Zap,
  ChevronRight,
  Clock,
  Warehouse,
  Sliders,
  Flame,
  Radio
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
  const [trends, setTrends] = useState<any>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('Z-01');
  const [loading, setLoading] = useState(true);

  const {
    activeScenario,
    activeEarlyWarnings,
    activeBlockages,
    sectors
  } = useMentorDemo();

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiData, zoneData, roadData, vehData, lzData, incData, predData, trendData] = await Promise.all([
          api.getKPIs(),
          api.getZones(),
          api.getRoads(),
          api.getVehicles(),
          api.getLoadingZones(),
          api.getIncidents(),
          api.getPredictions(),
          api.getTrends(),
        ]);
        setKpis(kpiData);
        setZones(zoneData);
        setRoads(roadData);
        setVehicles(vehData);
        setLoadingZones(lzData);
        setIncidents(incData);
        setPredictions(predData);
        setTrends(trendData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Merge context sectors with zone data if needed
  const displayZones: ZoneModel[] = zones.length > 0 ? zones.map(z => {
    const matchingSector = sectors.find(s => s.id === z.id || s.name.includes(z.name));
    if (matchingSector) {
      return {
        ...z,
        pressure_score: matchingSector.pressure,
        pressure_class: (matchingSector.pressure > 80 ? 'Critical' : matchingSector.pressure > 60 ? 'High' : 'Moderate') as PressureClass
      };
    }
    return z;
  }) : [];

  const selectedZone = displayZones.find((z) => z.id === selectedZoneId) || displayZones[0] || zones[0];
  const selectedPred = predictions.find((p) => p.zone_id === selectedZoneId) || predictions[0];

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-lg">
        <p className="text-slate-500 font-medium mb-1 font-mono">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || '#059669' }} className="font-mono text-xs">
            {p.name}: <strong className="text-slate-900">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* 1. Top KPI Row */}
      <KPICards kpis={kpis} loading={loading} />

      {/* 2. Main Center Grid: Map (7 cols) + AI Live Insights & Zone HUD (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Map Container */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
                <span>METROPOLITAN DIGITAL-TWIN GIS</span>
                <span className="text-[10px] text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                  REAL-TIME 100Hz
                </span>
                {activeBlockages.length > 1 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold animate-pulse">
                    {activeBlockages.length} SURGE BLOCKAGES DETECTED
                  </span>
                )}
              </h2>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block font-mono">
              Click any sector to inspect multi-factor pressure
            </div>
          </div>
          <CityDigitalTwinMap
            zones={displayZones.length > 0 ? displayZones : zones}
            roads={roads}
            vehicles={vehicles}
            loadingZones={loadingZones}
            incidents={incidents}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            heightClass="h-[560px]"
          />
        </div>

        {/* Right AI Predictions & Zone Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* AI Live Predictions & Risk Alert Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider font-mono">
                  <BrainCircuit className="w-4 h-4 text-emerald-600" />
                  <span>AI EARLY-WARNING RADAR</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> 100Hz STREAM
                </span>
              </div>

              {/* Dynamic Context Warnings from Mentor Scenario */}
              <div className="space-y-3 text-xs mt-4">
                {activeEarlyWarnings.map(ew => (
                  <div
                    key={ew.id}
                    className={`p-3.5 rounded-xl border text-slate-800 flex items-start space-x-3 transition-all ${
                      ew.severity === 'CRITICAL'
                        ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-300'
                        : ew.severity === 'HIGH'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {ew.severity === 'CRITICAL' ? (
                      <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                    ) : ew.severity === 'HIGH' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>{ew.title} — {ew.zone}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          ew.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                        }`}>[{ew.severity}]</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Mitigation action: <strong className="text-slate-900">{ew.action}</strong> ({ew.time}).
                      </p>
                    </div>
                  </div>
                ))}

                {activeBlockages.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start space-x-3">
                    <Activity className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Active GIS Obstructions ({activeBlockages.length})</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">[MAP TELEMETRY]</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 space-y-1">
                        {activeBlockages.slice(0, 3).map((b, i) => (
                          <p key={i} className="truncate font-mono text-[11px]">
                            • {b.name} (<span className="text-rose-600 font-bold">+{b.delay_mins}m delay</span>)
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Sector Telemetry HUD */}
            {selectedZone && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider font-semibold">SELECTED SECTOR</span>
                    <span className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <span className="text-emerald-700 font-mono">{selectedZone.id}</span>
                      <span>{selectedZone.name}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider font-semibold">PRESSURE SCORE</span>
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full border inline-block mt-0.5 ${
                        selectedZone.pressure_score > 80
                          ? 'bg-rose-100 text-rose-800 border-rose-200 ring-1 ring-rose-300'
                          : selectedZone.pressure_score > 60
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {selectedZone.pressure_score}/100 ({selectedZone.pressure_class})
                    </span>
                  </div>
                </div>

                {/* Metric Gauges */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Road Util</span>
                    <span className="font-bold text-slate-900 text-sm">{Math.round((selectedZone.road_utilization || 0.72) * 100)}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Logistics Demand</span>
                    <span className="font-bold text-amber-600 text-sm">{selectedZone.logistics_demand || 140} idx</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Avg Velocity</span>
                    <span className="font-bold text-emerald-700 text-sm">{selectedZone.avg_speed_kmh || 34.2} km/h</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Bay Saturation</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedZone.loading_bay_occupied || 10}/{selectedZone.loading_bay_capacity || 12}
                    </span>
                  </div>
                </div>

                {/* ML Forecast Multi-Horizon */}
                {selectedPred && (
                  <div className="pt-2 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
                      <span>MULTI-HORIZON FORECAST</span>
                      <span className="text-emerald-700">RandomForest Engine</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">+15 min</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedPred.pred_15m_pct}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">+30 min</span>
                        <span className="font-bold text-amber-600 text-sm">{selectedPred.pred_30m_pct}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">+60 min</span>
                        <span className="font-bold text-rose-600 text-sm">{selectedPred.pred_60m_pct}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: 2x2 Telemetry Analytics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Traffic Volume Trend */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> METROPOLITAN TRAFFIC VOLUME OVER TIME
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">vph</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.traffic_trend || [
                { time: '14:00', traffic_volume: 3200 },
                { time: '15:00', traffic_volume: 3800 },
                { time: '16:00', traffic_volume: 4600 },
                { time: '17:00', traffic_volume: 5200 },
                { time: '18:00', traffic_volume: activeScenario === 'RUSH_HOUR' ? 6800 : 5400 }
              ]}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="traffic_volume" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTraffic)" name="Traffic Volume" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Logistics Demand Spikes */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-amber-500" /> COMMERCIAL DELIVERY ORDERS / HOUR
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Orders/hr</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.logistics_demand_trend || [
                { time: '14:00', parcel_orders: 140 },
                { time: '15:00', parcel_orders: 180 },
                { time: '16:00', parcel_orders: 260 },
                { time: '17:00', parcel_orders: 310 },
                { time: '18:00', parcel_orders: activeScenario === 'RUSH_HOUR' ? 420 : 290 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="parcel_orders" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: CO2 Emission Reductions */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" /> CUMULATIVE CO2 ABATED BY GREEN ROUTING
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">kg CO2</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends?.co2_savings_trend || [
                { time: '14:00', co2_saved_kg: 420 },
                { time: '15:00', co2_saved_kg: 680 },
                { time: '16:00', co2_saved_kg: 920 },
                { time: '17:00', co2_saved_kg: 1180 },
                { time: '18:00', co2_saved_kg: 1420 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Line type="monotone" dataKey="co2_saved_kg" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }} name="CO2 Saved (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Sector Pressure Inspector Selector */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" /> URBAN SECTOR PRESSURE RANKING
            </span>
            <Link to="/map" className="text-xs font-mono font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
              Full Map <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1 text-xs font-mono">
            {sectors.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedZoneId(s.id)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-150 ${
                  selectedZoneId === s.id
                    ? 'bg-emerald-50 border border-emerald-300 text-slate-900 shadow-xs ring-1 ring-emerald-400/40'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="truncate max-w-[130px] text-xs font-sans font-semibold">
                  <span className="text-emerald-700 font-mono mr-1.5 font-bold">{s.id}</span>
                  {s.name}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                    s.pressure > 80
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : s.pressure > 60
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {s.pressure}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

