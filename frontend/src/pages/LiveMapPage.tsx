import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  Bus,
  Wind,
  Wifi,
  ArrowUp,
  ArrowDown,
  Search,
  Layers,
  Plus,
  Minus,
  Crosshair,
  Maximize2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Camera,
  Sliders,
  FileDown,
  Navigation,
  ArrowLeft,
  Building2,
  Network
} from 'lucide-react';
import type { LiveSnapshot } from '../hooks/useLiveData';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { api } from '../services/api';
import { mockZones, mockRoads, mockIncidents } from '../services/mockData';
import { ZoneModel, RoadSegmentModel, VehicleModel, LoadingZoneModel, IncidentModel } from '../types';

interface LiveMapPageProps {
  liveSnapshot?: LiveSnapshot | null;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ liveSnapshot: _liveSnapshot }) => {
  const navigate = useNavigate();
  const [mapCategory, setMapCategory] = useState<
    'traffic' | 'risk' | 'incidents' | 'transport' | 'cctv' | 'infra' | 'zones' | 'environment'
  >('traffic');
  const [mapSearch, setMapSearch] = useState('');
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);

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
    <div className="space-y-5 max-w-[1700px] mx-auto animate-fadeIn pb-12 text-slate-800">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER & SKYLINE BANNER                       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Title + Description (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>CityFlow</span>
              </button>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800 font-bold">City Map</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight leading-tight">
                Bengaluru Metropolitan Digital Twin
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                LIVE URBAN INFRASTRUCTURE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-2 max-w-xl">
              Real-time urban mobility, infrastructure, and risk intelligence for a smarter Bengaluru.
            </p>
          </div>
        </div>

        {/* Right: Skyline Banner (5 cols) */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xs min-h-[125px] flex items-end justify-end p-5 group">
          <img
            src="/images/bengaluru_skyline_banner.jpg"
            alt="Bengaluru Skyline"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/85 via-emerald-900/40 to-transparent"></div>
          <div className="relative z-10 text-right">
            <div className="text-xl sm:text-2xl font-extrabold font-serif italic text-white drop-shadow">
              Bengaluru <br />
              <span className="text-emerald-300">Moves Smarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SIX METRIC CARDS ROW                              */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Traffic Flow */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Traffic Flow</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">68%</div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20">
              <svg className="w-full h-full" viewBox="0 0 80 16" fill="none">
                <path d="M0 12 Q 20 16, 40 8 T 80 4" stroke="#10b981" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last hour</span>
          </div>
        </div>

        {/* Card 2: Road Risk Index */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowDown className="w-3 h-3 mr-0.5" /> 12%
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Road Risk Index</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">42</span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20">
              <svg className="w-full h-full" viewBox="0 0 80 16" fill="none">
                <path d="M0 6 Q 20 14, 40 8 T 80 12" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs yesterday</span>
          </div>
        </div>

        {/* Card 3: Active Incidents */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 3
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Incidents</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">14</div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20">
              <svg className="w-full h-full" viewBox="0 0 80 16" fill="none">
                <path d="M0 12 Q 25 4, 50 14 T 80 6" stroke="#ef4444" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last hour</span>
          </div>
        </div>

        {/* Card 4: Public Transport */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Bus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 6%
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Public Transport</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">87%</div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20">
              <svg className="w-full h-full" viewBox="0 0 80 16" fill="none">
                <path d="M0 14 Q 25 10, 50 12 T 80 4" stroke="#3b82f6" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">on-time</span>
          </div>
        </div>

        {/* Card 5: Air Quality (AQI) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Good
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Air Quality (AQI)</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">64</div>
          </div>
          {/* Vertical AQI Bars */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-end justify-between px-1 gap-1 h-5">
            {[40, 55, 60, 45, 70, 65, 50].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-1.5 rounded-t-xs bg-slate-300" />
            ))}
          </div>
        </div>

        {/* Card 6: Network Coverage */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Network Coverage</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">100%</div>
          </div>
          {/* Signal bars */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>All corridors</span>
            <div className="flex items-end gap-1 h-4">
              {[6, 9, 12, 16].map((h, i) => (
                <div key={i} style={{ height: `${h}px` }} className="w-1 rounded-full bg-purple-400" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MIDDLE SECTION: BENGALURU MAP + INSIGHTS & ACTIONS*/}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Bengaluru City Map (8 cols) */}
        <div className="lg:col-span-8 bg-[#091122] text-white rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col relative min-h-[540px]">
          {/* Map Header */}
          <div className="p-4 bg-[#091122]/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-sm tracking-tight text-white">Bengaluru City Map</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Live traffic, road risk, incidents, infrastructure and more.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Search location, road, area..."
                  className="pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-48"
                />
              </div>

              {/* Layers Trigger */}
              <button
                onClick={() => setShowLayersDropdown(!showLayersDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </button>
            </div>
          </div>

          {/* Map Filter Pills (8 pills matching screenshot) */}
          <div className="px-4 py-2 bg-[#060e1d] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto z-10 scrollbar-none">
            {[
              { id: 'traffic', label: 'Traffic' },
              { id: 'risk', label: 'Road Risk' },
              { id: 'incidents', label: 'Incidents' },
              { id: 'transport', label: 'Public Transport' },
              { id: 'cctv', label: 'CCTV' },
              { id: 'infra', label: 'Infrastructure' },
              { id: 'zones', label: 'Zones' },
              { id: 'environment', label: 'Environment' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMapCategory(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  mapCategory === tab.id
                    ? 'bg-[#0b132b] text-white border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Leaflet Digital Twin Map */}
          <div className="flex-1 w-full relative min-h-[520px]">
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

        {/* Right Column: Insights, Health, Quick Actions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          {/* Card 1: Bengaluru Insights (AI Analysis) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">Bengaluru Insights</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                AI ANALYSIS
              </span>
            </div>

            <div className="space-y-3 py-2 text-xs">
              {/* Alert 1 */}
              <div className="flex items-start justify-between gap-2.5 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Increased congestion on ORR</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Average speed down 18% in last 30 mins.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">12 min ago</span>
              </div>

              {/* Alert 2 */}
              <div className="flex items-start justify-between gap-2.5 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Elevated risk near Hebbal</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Construction activity + heavy traffic.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">28 min ago</span>
              </div>

              {/* Alert 3 */}
              <div className="flex items-start justify-between gap-2.5 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Incident on Whitefield Main Road</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Right lane blocked. Expect delays.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">41 min ago</span>
              </div>

              {/* Alert 4 */}
              <div className="flex items-start justify-between gap-2.5 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Public transport running smoothly</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Metro and BMTC on-time across major routes.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">1 hour ago</span>
              </div>
            </div>

            {/* View All Button */}
            <button
              onClick={() => navigate('/analytics')}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#0b132b] hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-98"
            >
              <span>View All Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: City Infrastructure Health */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Activity className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900">City Infrastructure Health</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Road Network</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">92%</div>
                  <div className="text-[9px] text-emerald-600 font-semibold">Good condition</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Street Lights</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">96%</div>
                  <div className="text-[9px] text-amber-600 font-semibold">Operational</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">CCTV Network</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">100%</div>
                  <div className="text-[9px] text-blue-600 font-semibold">Online</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Signal Systems</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">94%</div>
                  <div className="text-[9px] text-purple-600 font-semibold">Synced</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-900 mb-2.5">Quick Actions</div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => navigate('/incidents')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-50/70 hover:bg-rose-100 text-rose-700 transition group"
              >
                <AlertTriangle className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold text-center leading-tight">Report Incident</span>
              </button>

              <button
                onClick={() => navigate('/traffic')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-700 transition group"
              >
                <Camera className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold text-center leading-tight">View Cameras</span>
              </button>

              <button
                onClick={() => navigate('/routes')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 transition group"
              >
                <Navigation className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold text-center leading-tight">Plan Route</span>
              </button>

              <button
                onClick={() => navigate('/analytics')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-purple-700 transition group"
              >
                <FileDown className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold text-center leading-tight">Download Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. BOTTOM DIGITAL TWIN SUMMARY BANNER                */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Bengaluru Digital Twin</h4>
            <p className="text-xs text-slate-500">
              Integrated view of traffic, infrastructure, environment and public services.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-xs divide-x divide-slate-100">
          <div className="pl-4">
            <div className="text-base font-extrabold text-slate-900">1,248</div>
            <div className="text-[11px] text-slate-400">CCTV Cameras</div>
          </div>
          <div className="pl-6">
            <div className="text-base font-extrabold text-slate-900">312</div>
            <div className="text-[11px] text-slate-400">Signalized Junctions</div>
          </div>
          <div className="pl-6">
            <div className="text-base font-extrabold text-slate-900">285 km</div>
            <div className="text-[11px] text-slate-400">Monitored Corridors</div>
          </div>
          <div className="pl-6">
            <div className="text-base font-extrabold text-emerald-600">100%</div>
            <div className="text-[11px] text-slate-400">Data Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};
