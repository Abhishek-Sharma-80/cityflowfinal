import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { ZoneModel, RoadSegmentModel, VehicleModel, LoadingZoneModel, IncidentModel } from '../../types';
import { Layers, Warehouse, AlertTriangle, Zap, Radio } from 'lucide-react';

interface CityDigitalTwinMapProps {
  zones: ZoneModel[];
  roads: RoadSegmentModel[];
  vehicles: VehicleModel[];
  loadingZones: LoadingZoneModel[];
  incidents: IncidentModel[];
  activeRouteWaypoints?: [number, number][];
  emergencyCorridorWaypoints?: [number, number][];
  selectedZoneId?: string;
  onSelectZone?: (zoneId: string) => void;
  heightClass?: string;
}

// Custom SVG Icons for Leaflet Light GIS with glowing depth halos
const createVehicleIcon = (type: string, isEmergency: boolean = false) => {
  const isEV = type.includes('ELECTRIC') || type.includes('EV');
  const bg = isEmergency ? '#e11d48' : isEV ? '#059669' : '#0284c7';
  const shadowGlow = isEmergency
    ? '0 0 18px rgba(225, 29, 72, 0.8), 0 2px 8px rgba(0,0,0,0.3)'
    : isEV
    ? '0 0 12px rgba(16, 185, 129, 0.6), 0 2px 6px rgba(0,0,0,0.2)'
    : '0 0 10px rgba(2, 132, 199, 0.5), 0 2px 6px rgba(0,0,0,0.2)';
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="background-color: ${bg}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: ${shadowGlow}; font-size: 11px; color: #fff; font-weight: bold; ${isEmergency ? 'animation: pulse-ring-red 1.3s infinite;' : ''}">
        ${isEmergency ? '🚑' : isEV ? '⚡' : '🚚'}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createLoadingZoneIcon = (available: number) => {
  const color = available > 0 ? '#059669' : '#e11d48';
  return L.divIcon({
    className: 'custom-lz-marker',
    html: `
      <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 2px solid ${color}; width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: ${color}; box-shadow: 0 0 10px ${color}33, 0 2px 6px rgba(0,0,0,0.15);">
        P
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const createIncidentIcon = (_severity: string) => {
  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div style="background: #e11d48; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 0 16px rgba(225,29,72,0.7); animation: pulse-ring-red 1.2s infinite; font-size: 13px;">
        ⚠️
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const CityDigitalTwinMap: React.FC<CityDigitalTwinMapProps> = ({
  zones,
  roads,
  vehicles,
  loadingZones,
  incidents,
  activeRouteWaypoints,
  emergencyCorridorWaypoints,
  selectedZoneId,
  onSelectZone,
  heightClass = 'h-[580px]',
}) => {
  const [showZones, setShowZones] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showLoadingBays, setShowLoadingBays] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => (t + 1) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const center: [number, number] = [12.9716, 77.5946];

  const getPressureColor = (score: number) => {
    if (score <= 30) return '#059669';
    if (score <= 60) return '#0284c7';
    if (score <= 80) return '#d97706';
    return '#e11d48';
  };

  const getRoadColor = (road: RoadSegmentModel) => {
    if (road.status === 'BLOCKED') return '#e11d48';
    if (road.status === 'EMERGENCY_PRIORITY') return '#059669';
    if (road.congestion_level > 0.8) return '#e11d48';
    if (road.congestion_level > 0.5) return '#d97706';
    return '#059669';
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] bg-slate-100`}>
      {/* Top Left Floating Dynamic Zone Pressure Pills with Live Pulse */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 max-w-[65%] pointer-events-auto">
        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md border border-slate-700">
          <span className="live-dot w-2 h-2" />
          <span>100Hz TELEMETRY</span>
        </div>
        {zones.slice(0, 3).map((z) => {
          const isHighPressure = z.pressure_score >= 75;
          return (
            <div
              key={z.id}
              onClick={() => onSelectZone && onSelectZone(z.id)}
              className={`cursor-pointer px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-mono transition-all flex items-center gap-2 shadow-sm ${
                isHighPressure
                  ? 'bg-rose-50/95 border-rose-400 text-rose-800 animate-pulse ring-2 ring-rose-300'
                  : 'bg-white/95 border-slate-200 text-slate-800 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isHighPressure ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="font-semibold font-sans">{z.name.split(' ')[0]}</span>
              <span className={`font-bold ${isHighPressure ? 'text-rose-700' : 'text-slate-900'}`}>
                {z.pressure_score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Layer Controls HUD with Glassmorphic Depth & Ticking Counters */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-[0_8px_20px_-2px_rgba(15,23,42,0.08)] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-1 flex items-center gap-1.5 font-mono">
          <Layers className="w-3.5 h-3.5 text-emerald-600" /> Layers
        </span>
        <button
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            showZones
              ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Sectors ({zones.length})
        </button>
        <button
          onClick={() => setShowRoads(!showRoads)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            showRoads
              ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Arterials ({roads.length})
        </button>
        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            showVehicles
              ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Fleet ({vehicles.length})
        </button>
        <button
          onClick={() => setShowLoadingBays(!showLoadingBays)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            showLoadingBays
              ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Bays ({loadingZones.length})
        </button>
        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            showIncidents
              ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Incidents ({incidents.length})
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5 font-mono">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Sector Pressure Index</div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 font-medium text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Low (0-30)</div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Mod (31-60)</div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High (61-80)</div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Crit (81-100)</div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* 1. Zone Polygons */}
        {showZones &&
          zones.map((z) => {
            const isSelected = selectedZoneId === z.id;
            const color = getPressureColor(z.pressure_score);
            return (
              <React.Fragment key={z.id}>
                <Polygon
                  positions={z.polygon}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.35 : 0.15,
                    weight: isSelected ? 3 : 1.5,
                    dashArray: isSelected ? '4, 4' : undefined,
                  }}
                  eventHandlers={{
                    click: () => onSelectZone && onSelectZone(z.id),
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs p-1">
                      <div className="font-bold text-slate-900">{z.name}</div>
                      <div>Pressure: <span className="font-bold font-mono" style={{ color }}>{typeof z.pressure_score === 'number' ? z.pressure_score.toFixed(0) : z.pressure_score}/100 ({z.pressure_class})</span></div>
                      <div>Logistics Demand: {z.logistics_demand} index</div>
                      <div>Avg Speed: {typeof z.avg_speed_kmh === 'number' ? z.avg_speed_kmh.toFixed(1) : z.avg_speed_kmh} km/h</div>
                    </div>
                  </Tooltip>
                </Polygon>
              </React.Fragment>
            );
          })}

        {/* 2. Road Network Polylines */}
        {showRoads &&
          roads.map((r) => {
            const color = getRoadColor(r);
            return (
              <Polyline
                key={r.id}
                positions={r.coordinates}
                pathOptions={{
                  color: color,
                  weight: r.status === 'BLOCKED' ? 4.5 : 4,
                  opacity: 0.95,
                  dashArray: r.status === 'BLOCKED' ? '6, 6' : undefined,
                }}
              >
                <Popup>
                  <div className="p-1.5 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Congestion:</span>
                      <span className="font-bold font-mono" style={{ color }}>{Math.round(r.congestion_level * 100)}%</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Speed:</span>
                      <span className="font-mono text-slate-800">
                        {typeof r.current_speed_kmh === 'number' ? r.current_speed_kmh.toFixed(1) : r.current_speed_kmh} / {typeof r.free_flow_speed_kmh === 'number' ? r.free_flow_speed_kmh.toFixed(1) : r.free_flow_speed_kmh} km/h
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold uppercase" style={{ color }}>{r.status}</span>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* 3. Multi-Objective Optimized Route Layer (Glowing Green Wave Pulse) */}
        {activeRouteWaypoints && activeRouteWaypoints.length > 0 && (
          <>
            {/* Outer Glow Path */}
            <Polyline
              positions={activeRouteWaypoints}
              pathOptions={{
                color: '#10b981',
                weight: 10,
                opacity: 0.35,
              }}
            />
            {/* Inner Animated Flowing Path */}
            <Polyline
              positions={activeRouteWaypoints}
              pathOptions={{
                color: '#059669',
                weight: 5,
                opacity: 1.0,
                className: 'corridor-flowing-green',
              }}
            />
          </>
        )}

        {/* 4. Emergency Green Corridor Layer (Neon Flowing Marching Pulse) */}
        {emergencyCorridorWaypoints && emergencyCorridorWaypoints.length > 0 && (
          <>
            {/* Outer Neon Glow */}
            <Polyline
              positions={emergencyCorridorWaypoints}
              pathOptions={{
                color: '#f43f5e',
                weight: 12,
                opacity: 0.4,
              }}
            />
            {/* Core Marching Particle Pulse */}
            <Polyline
              positions={emergencyCorridorWaypoints}
              pathOptions={{
                color: '#e11d48',
                weight: 6,
                opacity: 1.0,
                className: 'corridor-flowing-line',
              }}
            />
          </>
        )}

        {/* 5. Smart Loading Zones */}
        {showLoadingBays &&
          loadingZones.map((lz) => (
            <Marker
              key={lz.id}
              position={lz.location}
              icon={createLoadingZoneIcon(lz.available_bays)}
            >
              <Popup>
                <div className="p-1.5 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-emerald-600" />
                    {lz.name}
                  </div>
                  <div className="text-slate-500">{lz.zone_name}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[10px]">Available Bays:</span>
                      <div className="text-emerald-700 font-bold font-mono text-sm">{lz.available_bays} / {lz.total_bays}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Queue Dwell:</span>
                      <div className="text-amber-600 font-bold font-mono text-sm">{lz.avg_dwell_time_mins}m</div>
                    </div>
                  </div>
                  {lz.ev_charging_available && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                      <Zap className="w-3 h-3 text-emerald-500" /> EV Fast Charging Active
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 6. Active Incidents */}
        {showIncidents &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={inc.location}
              icon={createIncidentIcon(inc.severity)}
            >
              <Popup>
                <div className="p-1.5 space-y-1 text-xs">
                  <div className="font-bold text-rose-600 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {inc.title}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{inc.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    ETA Clearance: <span className="font-bold text-slate-800">{inc.estimated_clearance_time} IST</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 7. Live Fleet Vehicles with Colored Glowing Halos */}
        {showVehicles &&
          vehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={createVehicleIcon(v.vehicle_type, v.status === 'REROUTED_EMERGENCY')}
            >
              <Popup>
                <div className="p-1.5 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>{v.plate_number}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {v.vehicle_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-500">Driver: <span className="text-slate-800 font-medium">{v.driver_name}</span></div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[10px]">Speed:</span>
                      <div className="font-mono font-bold text-slate-800">{typeof v.current_speed_kmh === 'number' ? v.current_speed_kmh.toFixed(1) : v.current_speed_kmh} km/h</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Battery/Fuel:</span>
                      <div className="font-mono font-bold text-emerald-700">{v.fuel_or_battery_pct}%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-slate-500">Payload: {v.current_payload_kg} / {v.max_payload_kg} kg</span>
                    <span className="font-bold text-emerald-700">{v.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
