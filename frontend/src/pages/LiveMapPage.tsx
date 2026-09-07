import React, { useState, useEffect } from 'react';
import { RoadSegmentModel, VehicleModel, LoadingZoneModel, IncidentModel } from '../types';
import { api } from '../services/api';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { useMentorDemo, SectorInfo } from '../context/MentorDemoContext';
import { Map, Search, Navigation, ShieldCheck, Truck, Gauge, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { LiveSnapshot } from '../hooks/useLiveData';

interface LiveMapPageProps {
  liveSnapshot?: LiveSnapshot | null;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ liveSnapshot: _liveSnapshot }) => {
  const [roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [loadingZones, setLoadingZones] = useState<LoadingZoneModel[]>([]);
  const [incidents, setIncidents] = useState<IncidentModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [reroutedToast, setReroutedToast] = useState<string | null>(null);

  const {
    sectors,
    selectedSector,
    setSelectedSector,
    rerouteSectorFleet
  } = useMentorDemo();

  useEffect(() => {
    async function fetchData() {
      try {
        const [r, v, lz, inc] = await Promise.all([
          api.getRoads(),
          api.getVehicles(),
          api.getLoadingZones(),
          api.getIncidents(),
        ]);
        setRoads(r);
        setVehicles(v);
        setLoadingZones(lz);
        setIncidents(inc);
      } catch (err) {
        console.error('Error loading map assets:', err);
      }
    }
    fetchData();
  }, []);

  const filteredSectors = sectors.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleReroute = (sector: SectorInfo) => {
    rerouteSectorFleet(sector.id);
    setReroutedToast(`Fleet diversion active for ${sector.name}: 30 incoming freight vehicles rerouted via secondary ring.`);
    setTimeout(() => setReroutedToast(null), 5000);
  };

  const statusBadge = (status: string) => {
    if (status === 'SATURATED') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (status === 'CRITICAL') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (status === 'MODERATE') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1750px] mx-auto animate-fadeIn relative">
      
      {/* Top Banner */}
      <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Bengaluru Metropolitan Digital-Twin GIS Map
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
                10 Active Bengaluru Sectors
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution spatial topology, real-time pressure polygons, and interactive fleet diversion controls
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Bengaluru sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white w-64 shadow-sm transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Rerouted Toast Notification */}
      {reroutedToast && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-xl flex items-center justify-between gap-4 animate-fadeIn border border-emerald-500/40">
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{reroutedToast}</span>
          </div>
          <button
            onClick={() => setReroutedToast(null)}
            className="text-xs font-bold text-emerald-300 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Map + Side Sector Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Container */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                Live Bengaluru Sector Grid (Click to Inspect)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                10 GIS Polygons Active
              </span>
            </div>

            {/* 10 Interactive Bengaluru Sectors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
              {filteredSectors.map(s => {
                const isSelected = selectedSector?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSector(s)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20 scale-[1.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {s.id}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-emerald-300' : statusBadge(s.status)}`}>
                        {s.pressure}%
                      </span>
                    </div>
                    <div className="text-xs font-bold mt-1.5 leading-tight truncate">
                      {s.name.split('(')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            <CityDigitalTwinMap
              zones={sectors.map(s => ({
                id: s.id,
                name: s.name,
                category: 'Bengaluru Sector',
                center: [s.lat, s.lng] as [number, number],
                polygon: [
                  [s.lat - 0.005, s.lng - 0.005],
                  [s.lat + 0.005, s.lng - 0.005],
                  [s.lat + 0.005, s.lng + 0.005],
                  [s.lat - 0.005, s.lng + 0.005]
                ] as [number, number][],
                pressure_score: s.pressure,
                pressure_class: (s.pressure > 80 ? 'Critical' : s.pressure > 60 ? 'High' : 'Moderate') as any,
                road_utilization: s.density / 100,
                traffic_density: s.density / 100,
                logistics_demand: s.incomingFreight,
                parking_pressure: 70,
                incident_count: 0,
                environmental_index: 85,
                active_deliveries: 32,
                active_vehicles: 48,
                avg_speed_kmh: 45 - s.speedDeficit,
                free_flow_speed_kmh: 45,
                loading_bay_occupied: 8,
                loading_bay_capacity: 10,
                peak_hours: '17:00 - 20:00'
              }))}
              roads={roads}
              vehicles={vehicles}
              loadingZones={loadingZones}
              incidents={incidents}
              selectedZoneId={selectedSector?.id || 'SEC-01'}
              onSelectZone={(id) => {
                const matched = sectors.find(s => s.id === id);
                if (matched) setSelectedSector(matched);
              }}
              heightClass="h-[520px]"
            />
          </div>
        </div>

        {/* Floating Sector Inspection Modal & Action Panel */}
        <div className="lg:col-span-4 space-y-6">
          {selectedSector ? (
            <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sector Live Inspection
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedSector.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedSector.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedSector.description}</p>
              </div>

              {/* Dynamic Telemetry Gauges */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-600" /> Vehicle Density
                  </span>
                  <span className="font-bold text-slate-900 text-lg mt-1 block">{selectedSector.density}%</span>
                  <span className="text-[10px] text-slate-400">Road saturation</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> Speed Deficit
                  </span>
                  <span className="font-bold text-rose-600 text-lg mt-1 block">-{selectedSector.speedDeficit} km/h</span>
                  <span className="text-[10px] text-slate-400">Below free flow</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-emerald-600" /> Inbound Freight
                  </span>
                  <span className="font-bold text-slate-900 text-lg mt-1 block">{selectedSector.incomingFreight}</span>
                  <span className="text-[10px] text-slate-400">Vehicles approaching</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">Pressure Score</span>
                  <span className={`font-bold text-lg mt-1 block ${selectedSector.pressure > 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {selectedSector.pressure} / 100
                  </span>
                  <span className="text-[10px] text-slate-400">{selectedSector.status}</span>
                </div>
              </div>

              {/* Action Button: Reroute Incoming Fleet */}
              <div className="pt-2">
                <button
                  onClick={() => handleReroute(selectedSector)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Navigation className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
                  <span>Reroute Incoming Fleet via Outer Ring</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                  Instantly diffuses local pressure score by -22 points
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Select any sector polygon to inspect telemetry</div>
          )}
        </div>

      </div>
    </div>
  );
};


