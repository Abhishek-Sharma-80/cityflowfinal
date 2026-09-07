import React, { useState, useEffect } from 'react';
import { RouteOptionModel, RouteMode, VehicleType, ZoneModel, RoadSegmentModel } from '../types';
import { api } from '../services/api';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { useMentorDemo } from '../context/MentorDemoContext';
import { Navigation, Leaf, DollarSign, Clock, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const BENGALURU_CORRIDORS = [
  'Peenya Industrial',
  'CBD MG Road',
  'Whitefield Tech Corridor',
  'Electronic City Tollway Gateway',
  'Indiranagar 100ft Hub',
  'Koramangala Sony World Hub',
  'Hebbal Flyover Interchange',
  'HSR Layout Sector 2 Ring'
];

export const RouteOptimizationPage: React.FC = () => {
  const {
    selectedOrigin,
    selectedDestination,
    setSelectedOrigin,
    setSelectedDestination,
    isCalculatingPareto,
    paretoRoutes,
    calculateParetoPaths
  } = useMentorDemo();

  const [zones, setZones] = useState<ZoneModel[]>([]);
  const [roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [vehicleType, setVehicleType] = useState<VehicleType>('ELECTRIC_VAN');
  const [cargoWeight, setCargoWeight] = useState<number>(450);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('PAR-2');
  const [apiRoutes, setApiRoutes] = useState<RouteOptionModel[]>([]);

  useEffect(() => {
    async function loadInitial() {
      try {
        const [z, r] = await Promise.all([api.getZones(), api.getRoads()]);
        setZones(z);
        setRoads(r);
        const opts = await api.optimizeRoute('Z-04', 'Z-01', 'ELECTRIC_VAN', 450);
        setApiRoutes(opts);
      } catch (err) {
        console.error(err);
      }
    }
    loadInitial();
    if (paretoRoutes.length === 0) {
      calculateParetoPaths();
    }
  }, []);

  const handleCalculate = async () => {
    await calculateParetoPaths();
    try {
      const opts = await api.optimizeRoute(
        selectedOrigin === 'Peenya Industrial' ? 'Z-04' : 'Z-02',
        selectedDestination === 'CBD MG Road' ? 'Z-01' : 'Z-03',
        vehicleType,
        cargoWeight
      );
      if (opts && opts.length > 0) {
        setApiRoutes(opts);
      }
    } catch (e) {
      console.log('API Pareto update fallback to local state');
    }
  };

  const getModeIcon = (mode: string) => {
    if (mode.includes('Fast') || mode.includes('DURATION')) return <Clock className="w-4 h-4 text-blue-600" />;
    if (mode.includes('Eco') || mode.includes('CHAMPION')) return <Leaf className="w-4 h-4 text-emerald-600" />;
    if (mode.includes('Toll') || mode.includes('COST')) return <DollarSign className="w-4 h-4 text-amber-600" />;
    return <Zap className="w-4 h-4 text-purple-600" />;
  };

  // Combine or fallback to standard pareto routes
  const displayRoutes = paretoRoutes.length > 0 ? paretoRoutes : [
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
      color: '#2563eb',
      explainability_text: 'Prioritizes maximum throughput over elevated corridor with pre-cleared green splits at 4 key junctions.'
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
      color: '#059669',
      explainability_text: 'Multi-objective optimal frontier: Saves 38% CO2 emissions with only 2.5 min additional transit time vs expressway.'
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
      color: '#d97706',
      explainability_text: 'Bypasses toll plazas completely via secondary arterials while avoiding congested curbside loading zones.'
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
      color: '#7c3aed',
      explainability_text: 'Optimized gradient descent profile for Electric Cargo Vans to maximize kinetic energy recovery and minimize battery drain.'
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-sm">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              Multi-Objective Pareto Routing Engine
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 font-semibold">
                Bengaluru Corridor AI
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Joint optimization across travel time, grid congestion penalty, energy consumption, and carbon emissions
            </p>
          </div>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
        <div>
          <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block mb-2">Origin Corridor</label>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-medium font-mono focus:border-cyan-500 focus:outline-none shadow-sm"
          >
            {BENGALURU_CORRIDORS.map((c) => (
              <option key={c} value={c} className="bg-white text-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block mb-2">Destination Corridor</label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-medium font-mono focus:border-cyan-500 focus:outline-none shadow-sm"
          >
            {BENGALURU_CORRIDORS.map((c) => (
              <option key={c} value={c} className="bg-white text-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block mb-2">Fleet Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-medium font-mono focus:border-cyan-500 focus:outline-none shadow-sm"
          >
            <option value="ELECTRIC_VAN" className="bg-white text-slate-900">Electric Cargo Van (Tata Ace EV)</option>
            <option value="CARGO_EV_2W" className="bg-white text-slate-900">Cargo EV 2-Wheeler (Ather 450X Cargo)</option>
            <option value="DIESEL_LCV" className="bg-white text-slate-900">Diesel LCV (Mahindra Bolero Maxi)</option>
            <option value="CNG_TRUCK" className="bg-white text-slate-900">CNG Medium Freight</option>
            <option value="HEAVY_FREIGHT" className="bg-white text-slate-900">Heavy Freight (Ashok Leyland 16-Ton)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block mb-2">
            Cargo Payload: <span className="text-cyan-700 font-bold">{cargoWeight} kg</span>
          </label>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={cargoWeight}
            onChange={(e) => setCargoWeight(Number(e.target.value))}
            className="w-full accent-cyan-600 mt-2 cursor-pointer"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCalculate}
            disabled={isCalculatingPareto}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
          >
            {isCalculatingPareto ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Computing Pareto Frontier...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Calculate Pareto Paths</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split View: Map + Route Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View showing selected route */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
              <span>{selectedOrigin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
              <span>{selectedDestination}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Live Flow Interpolation Active
            </span>
          </div>
          <div className="flex-1 min-h-[560px]">
            <CityDigitalTwinMap
              zones={zones}
              roads={roads}
              vehicles={[]}
              loadingZones={[]}
              incidents={[]}
              activeRouteWaypoints={apiRoutes[0]?.waypoints || []}
              heightClass="h-[560px]"
            />
          </div>
        </div>

        {/* 4 Distinct Pareto Route Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Generated Pareto Route Candidates (4 Modes)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Click card to select route</span>
          </div>

          <div className="space-y-3.5">
            {displayRoutes.map((route: any) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 space-y-3 bg-white relative overflow-hidden ${
                    isSelected
                      ? 'border-cyan-500 shadow-md ring-2 ring-cyan-400/20'
                      : 'border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        {getModeIcon(route.tag || route.name)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 tracking-wide block">{route.name}</span>
                        <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: route.color || '#059669' }}>
                          {route.tag || 'OPTIMAL CANDIDATE'}
                        </span>
                      </div>
                    </div>
                    {route.is_recommended && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        AI Recommended
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Duration</span>
                      <span className="font-bold text-slate-900">{route.duration_mins || route.estimated_duration_mins} min</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Distance</span>
                      <span className="font-bold text-slate-900">{route.distance_km} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">CO2 Output</span>
                      <span className="font-semibold text-emerald-700">{route.co2_kg || route.co2_emissions_kg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Eco Score</span>
                      <span className="font-semibold text-cyan-700">{route.eco_score}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {route.explainability_text || 'Calculated dynamic multi-objective Pareto trajectory.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
