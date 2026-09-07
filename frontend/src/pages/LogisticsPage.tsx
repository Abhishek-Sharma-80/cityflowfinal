import React, { useState, useEffect } from 'react';
import { VehicleModel, DeliveryRequestModel, LoadingZoneModel, SlotOptimizationResult, RouteOptionModel } from '../types';
import { api } from '../services/api';
import { SourceBadge } from '../components/common/SourceBadge';
import { SkeletonPage } from '../components/common/Skeleton';
import {
  Truck,
  CalendarClock,
  Warehouse,
  Navigation,
  Sparkles,
} from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'slots' | 'loading' | 'routing'>('fleet');
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRequestModel[]>([]);
  const [loadingZones, setLoadingZones] = useState<LoadingZoneModel[]>([]);
  const [slotResult, setSlotResult] = useState<SlotOptimizationResult | null>(null);
  const [routes, setRoutes] = useState<RouteOptionModel[]>([]);
  const [origin, setOrigin] = useState<string>('Z-01');
  const [destination, setDestination] = useState<string>('Z-04');
  const [loading, setLoading] = useState<boolean>(true);
  const [optimizingSlots, setOptimizingSlots] = useState<boolean>(false);
  const [calculatingRoute, setCalculatingRoute] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [vehData, delivData, lzData] = await Promise.all([
          api.getVehicles(),
          api.getDeliveries(),
          api.getLoadingZones(),
        ]);
        setVehicles(vehData);
        setDeliveries(delivData);
        setLoadingZones(lzData);
      } catch (err) {
        console.error('Error loading logistics data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOptimizeSlots = async () => {
    try {
      setOptimizingSlots(true);
      const res = await api.optimizeSlots();
      setSlotResult(res);
    } catch (err) {
      console.error('Slot optimization failed:', err);
    } finally {
      setOptimizingSlots(false);
    }
  };

  const handleCalculateRoute = async () => {
    try {
      setCalculatingRoute(true);
      const res = await api.optimizeRoute(origin, destination, 'ELECTRIC_VAN', 250);
      setRoutes(res);
    } catch (err) {
      console.error('Routing optimization failed:', err);
    } finally {
      setCalculatingRoute(false);
    }
  };

  if (loading) {
    return <SkeletonPage rows={3} />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Logistics Command Hub</h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
              OR-TOOLS & PARETO
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Commercial fleet telematics, dynamic time-slot scheduling, curb allocation, and Pareto green routing.
          </p>
        </div>

        <SourceBadge type="REAL_DATABASE" size="sm" />
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/90 w-fit">
        {[
          { id: 'fleet', name: 'Fleet Telematics', icon: Truck, count: vehicles.length },
          { id: 'slots', name: 'Dynamic Delivery Slots', icon: CalendarClock },
          { id: 'loading', name: 'Smart Loading Bays', icon: Warehouse, count: loadingZones.length },
          { id: 'routing', name: 'Pareto Eco Routing', icon: Navigation },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={'flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-150 ' + (
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <Icon className={'w-3.5 h-3.5 ' + (isActive ? 'text-cyan-600' : 'text-slate-400')} />
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: FLEET TELEMATICS */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Active Commercial Nodes
              </span>
              <div className="text-3xl font-bold font-mono text-slate-900 mt-1">{vehicles.length}</div>
              <p className="text-xs text-slate-500 mt-1">Telemetry stream live</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Delivery Manifests Today
              </span>
              <div className="text-3xl font-bold font-mono text-slate-900 mt-1">{deliveries.length}</div>
              <p className="text-xs text-slate-500 mt-1">Dispatched across Delhi NCR</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Propulsion Mix (EV / Clean)
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-600 mt-1">
                {Math.round((vehicles.filter((v) => v.vehicle_type.includes('EV') || v.vehicle_type.includes('ELECTRIC')).length / (vehicles.length || 1)) * 100)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Zero tailpipe emissions</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono mb-3">
              Live Fleet Telematics Manifest
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Plate / Call-Sign</th>
                    <th className="py-2.5 px-3">Vehicle Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Speed</th>
                    <th className="py-2.5 px-3">Energy / Fuel</th>
                    <th className="py-2.5 px-3">Payload Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{v.plate_number}</td>
                      <td className="py-2.5 px-3 text-slate-700">{v.vehicle_type}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">
                        {typeof v.current_speed_kmh === 'number' ? v.current_speed_kmh.toFixed(1) : v.current_speed_kmh} km/h
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{v.fuel_or_battery_pct}%</td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {Math.round((v.current_payload_kg / (v.max_payload_kg || 1000)) * 100)}% ({v.current_payload_kg} kg)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY SLOTS */}
      {activeTab === 'slots' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
                Constraint-Based Delivery Time Slot Solver
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Solves curb congestion by reallocating delivery windows to eliminate dock queue sclerosis.
              </p>
            </div>
            <button
              onClick={handleOptimizeSlots}
              disabled={optimizingSlots}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{optimizingSlots ? 'Optimizing Schedule...' : 'Run Slot Optimizer'}</span>
            </button>
          </div>

          {slotResult ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Peak Load Cut</span>
                <span className="text-3xl font-bold font-mono text-emerald-600">
                  -{slotResult.peak_reduction_pct.toFixed(1)}%
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Dwell Reduction</span>
                <span className="text-3xl font-bold font-mono text-cyan-700">
                  -{slotResult.avg_dwell_reduction_mins.toFixed(1)} mins
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">CO2 Saved</span>
                <span className="text-3xl font-bold font-mono text-emerald-700">
                  {slotResult.estimated_co2_reduction_kg.toFixed(0)} kg
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Reallocated Deliveries</span>
                <span className="text-3xl font-bold font-mono text-slate-900">
                  {slotResult.reallocated_deliveries_count}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Click &quot;Run Slot Optimizer&quot; to execute the constraint satisfaction engine.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SMART LOADING BAYS */}
      {activeTab === 'loading' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono mb-3">
            Loading Bays & Curb Dwell Telemetry
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bay Name / ID</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Total Bays</th>
                  <th className="py-2.5 px-3">Occupied</th>
                  <th className="py-2.5 px-3">Avg Dwell</th>
                  <th className="py-2.5 px-3">EV Fast Charger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loadingZones.map((lz) => (
                  <tr key={lz.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{lz.name}</td>
                    <td className="py-3 px-3 text-slate-700">{lz.zone_name}</td>
                    <td className="py-3 px-3 text-slate-800">{lz.total_bays}</td>
                    <td className="py-3 px-3 font-bold text-amber-600">
                      {lz.occupied_bays} ({Math.round(lz.current_utilization_pct)}%)
                    </td>
                    <td className="py-3 px-3 text-slate-800">{lz.avg_dwell_time_mins} mins</td>
                    <td className="py-3 px-3">
                      {lz.ev_charging_available ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          YES (50kW)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">NO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PARETO ROUTING */}
      {activeTab === 'routing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
                  Multi-Objective Pareto Routing Solver
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Computes Pareto-optimal routes balancing duration, toll, fuel, and CO2 emissions.
                </p>
              </div>
              <button
                onClick={handleCalculateRoute}
                disabled={calculatingRoute}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{calculatingRoute ? 'Calculating Paths...' : 'Optimize Pareto Route'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-600 block mb-1">Origin Zone</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Z-01">Z-01: Cyber City Hub (Gurugram)</option>
                  <option value="Z-02">Z-02: Connaught Place Central</option>
                  <option value="Z-03">Z-03: South Extension Commercial</option>
                  <option value="Z-04">Z-04: Noida Sector 62 Tech Park</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-600 block mb-1">Destination Zone</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Z-04">Z-04: Noida Sector 62 Tech Park</option>
                  <option value="Z-05">Z-05: Okhla Industrial Phase III</option>
                  <option value="Z-06">Z-06: Aerocity Transit Terminal</option>
                </select>
              </div>
            </div>
          </div>

          {routes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {routes.map((rt) => (
                <div
                  key={rt.id}
                  className={'p-5 rounded-xl border shadow-xs space-y-3 bg-white ' + (
                    rt.is_recommended ? 'border-emerald-300 ring-2 ring-emerald-400/20' : 'border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                      {rt.mode}
                    </span>
                    {rt.is_recommended && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rt.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {rt.distance_km} km • {rt.estimated_duration_mins} mins
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CO2 Emissions:</span>
                      <span className="font-bold text-slate-800">{rt.co2_emissions_kg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eco Score:</span>
                      <span className="font-bold text-emerald-600">{rt.eco_score}/100</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic leading-relaxed pt-2 border-t border-slate-100">
                    &quot;{rt.explainability_text}&quot;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Select origin and destination and click &quot;Optimize Pareto Route&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
