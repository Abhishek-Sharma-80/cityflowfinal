import React, { useState, useEffect } from 'react';
import { DeliveryRequestModel } from '../types';
import { api } from '../services/api';
import { useMentorDemo } from '../context/MentorDemoContext';
import { Truck, Package, Battery, Fuel, Search, Clock, ShieldCheck, Zap, AlertTriangle, Radio } from 'lucide-react';

export const FleetDeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryRequestModel[]>([]);
  const [activeTab, setActiveTab] = useState<'FLEET' | 'DELIVERIES'>('FLEET');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [batteryAlertToast, setBatteryAlertToast] = useState<string | null>(null);

  const {
    fleet,
    injectBatteryCritical,
    boostFleetSpeed
  } = useMentorDemo();

  useEffect(() => {
    async function load() {
      try {
        const d = await api.getDeliveries();
        setDeliveries(d);
      } catch (e) {
        console.warn('Deliveries fallback', e);
      }
    }
    load();
  }, []);

  const handleInjectBattery = () => {
    injectBatteryCritical();
    setBatteryAlertToast('⚡ Low SoC Telemetry Alert: Vehicle battery plunged to 11%. Dynamic reroute dispatched to Peenya DC 60kW Fast-Charge Station.');
    setTimeout(() => setBatteryAlertToast(null), 6000);
  };

  const filteredFleet = fleet.filter((v) => {
    const matchesSearch = v.callsign.toLowerCase().includes(searchTerm.toLowerCase()) || v.destination.toLowerCase().includes(searchTerm.toLowerCase()) || v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getBatteryColor = (pct: number) => {
    if (pct >= 50) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (pct >= 20) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
    return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' };
  };

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1750px] mx-auto animate-fadeIn">
      
      {/* Header & Tabs */}
      <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Fleet Telematics & Dispatch Orchestration
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                {fleet.length} Connected Telematics Units (100Hz)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live battery SoC monitoring, animated micro-progress power levels, dynamic EV charge rerouting, and cargo load tracking
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Interactive Demo Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleInjectBattery}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-all font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>⚡ Inject Battery Critical</span>
          </button>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('FLEET')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'FLEET'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Commercial Fleet ({fleet.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('DELIVERIES')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'DELIVERIES'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Deliveries ({deliveries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Battery Critical Toast Alert */}
      {batteryAlertToast && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-4 animate-fadeIn border border-rose-500/40">
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            <span>{batteryAlertToast}</span>
          </div>
          <button
            onClick={() => setBatteryAlertToast(null)}
            className="text-xs font-bold text-rose-300 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-semibold">EV Fleet Share</span>
            <span className="text-3xl font-bold font-mono text-emerald-700 my-1 block">52.5%</span>
            <span className="text-[11px] text-slate-500 font-mono">21 / 40 Zero-emission</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-semibold">Avg Fleet SoC</span>
            <span className="text-3xl font-bold font-mono text-slate-900 my-1 block">
              {Math.round(fleet.reduce((acc, v) => acc + v.battery_soc_pct, 0) / fleet.length)}%
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Real-time battery health</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-inner">
            <Battery className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-semibold">Active En Route</span>
            <span className="text-3xl font-bold font-mono text-amber-700 my-1 block">
              {fleet.filter(v => v.status === 'EN_ROUTE').length} Units
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Autonomous & EV mix</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-semibold">On-Time SLA</span>
            <span className="text-3xl font-bold font-mono text-emerald-700 my-1 block">98.2%</span>
            <span className="text-[11px] text-slate-500 font-mono">Pareto optimal corridors</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'FLEET' ? 'Search callsign, sector, destination...' : 'Search tracking code...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm w-80 transition-all font-mono"
          />
        </div>

        {activeTab === 'FLEET' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {[
                { id: 'ALL', label: 'All 40 Units' },
                { id: 'ELECTRIC_VAN', label: 'Electric Van' },
                { id: 'EV_2W_CARGO', label: 'Cargo 2W EV' },
                { id: 'HEAVY_FREIGHT', label: 'Heavy Freight' },
                { id: 'AUTONOMOUS_POD', label: 'Autonomous Pod' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                    typeFilter === f.id
                      ? 'bg-white text-emerald-800 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Fleet Table */}
      {activeTab === 'FLEET' && (
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-[580px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4">Unit Callsign</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Battery SoC / Power</th>
                  <th className="p-4">Speed</th>
                  <th className="p-4">Destination Target</th>
                  <th className="p-4">Assigned Bay</th>
                  <th className="p-4">Payload</th>
                  <th className="p-4">ETA</th>
                  <th className="p-4 text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredFleet.map((v) => {
                  const isCritical = v.status === 'CRITICAL_BATTERY' || v.battery_soc_pct < 15;
                  const isEV = v.type !== 'HEAVY_FREIGHT';
                  const batteryColor = getBatteryColor(v.battery_soc_pct);

                  return (
                    <tr
                      key={v.id}
                      className={`transition-colors ${
                        isCritical
                          ? 'bg-rose-50/70 border-l-4 border-rose-500'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                        {v.callsign}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {v.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 w-32">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              {isEV ? <Battery className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} /> : <Fuel className="w-3.5 h-3.5 text-amber-600" />}
                              <span className={`font-bold ${batteryColor.text}`}>
                                {v.battery_soc_pct}%
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{isEV ? 'EV' : 'DIESEL'}</span>
                          </div>
                          {/* Animated Micro Progress Bar */}
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${batteryColor.bar}`}
                              style={{ width: `${Math.min(100, Math.max(5, v.battery_soc_pct))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700">
                        {typeof v.current_speed_kmh === 'number' ? v.current_speed_kmh.toFixed(1) : v.current_speed_kmh} km/h
                      </td>
                      <td className="p-4 font-semibold text-slate-900 truncate max-w-[180px]">{v.destination}</td>
                      <td className="p-4 text-emerald-700 font-bold">{v.assigned_bay || 'BAY-01'}</td>
                      <td className="p-4 text-slate-600">{v.cargo_kg} kg</td>
                      <td className="p-4 text-slate-700 font-bold">{v.eta_mins} mins</td>
                      <td className="p-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-400/40 animate-pulse'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isCritical ? 'REROUTING TO CHARGER (DC 60kW)' : v.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Deliveries Table */}
      {activeTab === 'DELIVERIES' && (
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200">
                <tr>
                  <th className="p-4">Tracking Code</th>
                  <th className="p-4">Customer / Enterprise</th>
                  <th className="p-4">Route (Origin → Dest)</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Delivery Window</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {deliveries.slice(0, 15).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-semibold text-emerald-700">{d.tracking_code}</td>
                    <td className="p-4 font-sans text-slate-900">{d.customer_name}</td>
                    <td className="p-4 text-slate-700">
                      <span className="text-slate-500">{d.origin_zone_id}</span> → <span className="text-slate-900 font-semibold">{d.destination_zone_id}</span>
                    </td>
                    <td className="p-4 text-slate-700">{d.package_weight_kg} kg</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {d.priority}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{d.preferred_window_start} - {d.preferred_window_end}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

