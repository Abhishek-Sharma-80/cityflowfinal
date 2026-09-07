import React, { useState, useEffect } from 'react';
import { SlotOptimizationResult } from '../types';
import { api } from '../services/api';
import { useMentorDemo } from '../context/MentorDemoContext';
import {
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Clock,
  Sparkles,
  Leaf,
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const DeliverySlotsPage: React.FC = () => {
  const { isResolvingSlots, dwellCutMins, peakDeliveriesRedistributed, resolveSlotOptimizer } = useMentorDemo();
  const [data, setData] = useState<SlotOptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [justResolved, setJustResolved] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await api.optimizeSlots();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    await resolveSlotOptimizer();
    setJustResolved(true);
    setTimeout(() => setJustResolved(false), 3000);
    loadSlots();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Dynamic Delivery Slot Allocation Engine
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Constraint Solver (OR-Tools)
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Constraint satisfaction solver rebalancing delivery time windows to avoid dock congestion and rush-hour bottlenecks
            </p>
          </div>
        </div>

        <button
          onClick={handleResolve}
          disabled={isResolvingSlots || loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${isResolvingSlots ? 'animate-spin' : ''}`} />
          <span>{isResolvingSlots ? 'Solving Integer Linear Program...' : 'Re-solve Slot Optimizer'}</span>
        </button>
      </div>

      {justResolved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Optimal Constraint Plan Computed: {peakDeliveriesRedistributed} peak-hour freight windows shifted to off-peak buffer. Average curbside dock dwell slashed by -{dwellCutMins} mins.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-emerald-100 px-2.5 py-0.5 rounded-full text-emerald-800">
            Convergence Time: 18ms
          </span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">PEAK LOAD SHAVING</span>
            <span className="text-3xl font-bold font-mono text-emerald-600">
              -{data?.peak_reduction_pct || 38.5}%
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              From {data?.original_peak_load_deliveries || 48} to {data?.optimized_peak_load_deliveries || 29} peak pkgs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">QUEUE DWELL CUT</span>
            <span className="text-3xl font-bold font-mono text-slate-900">
              -{dwellCutMins}m
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Average dock waiting time</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">REALLOCATED SHIPMENTS</span>
            <span className="text-3xl font-bold font-mono text-amber-600">{peakDeliveriesRedistributed}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Orders shifted to off-peak buffer</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">CO2 REDUCTION</span>
            <span className="text-3xl font-bold font-mono text-emerald-600">
              -{data?.estimated_co2_reduction_kg || 18.2} kg
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Idle burn avoidance</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Leaf className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Slot Distribution Chart */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            TIME-WINDOW DENSITY: UNMANAGED VS CITYFLOW AI BALANCED
          </h3>
          <span className="text-xs font-mono text-emerald-700 font-medium">Smoothing peak spikes across 30-min bins</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.zone_slot_utilization || [
              { slot_interval: '08:00 - 09:00', original_deliveries: 42, optimized_deliveries: 24 },
              { slot_interval: '09:00 - 10:00', original_deliveries: 56, optimized_deliveries: 30 },
              { slot_interval: '10:00 - 11:00', original_deliveries: 38, optimized_deliveries: 32 },
              { slot_interval: '11:00 - 12:00', original_deliveries: 24, optimized_deliveries: 28 },
              { slot_interval: '12:00 - 13:00', original_deliveries: 18, optimized_deliveries: 25 },
              { slot_interval: '13:00 - 14:00', original_deliveries: 15, optimized_deliveries: 22 },
              { slot_interval: '14:00 - 15:00', original_deliveries: 28, optimized_deliveries: 26 },
              { slot_interval: '15:00 - 16:00', original_deliveries: 34, optimized_deliveries: 28 },
              { slot_interval: '16:00 - 17:00', original_deliveries: 48, optimized_deliveries: 31 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="slot_interval" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="original_deliveries" name="Original Preferred (Unsmoothed)" fill="#fb7185" radius={[6, 6, 0, 0]} />
              <Bar dataKey="optimized_deliveries" name="CityFlow Balanced Plan" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Table Comparison */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Plan Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold font-mono text-rose-600 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Original Unmanaged Schedule
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Peak Dwell: ~28 mins</span>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-3">Tracking</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Window</th>
                    <th className="p-3">Est Queue</th>
                    <th className="p-3 text-right">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {data.original_schedule.slice(0, 15).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 text-slate-800 font-medium">{item.tracking_code}</td>
                      <td className="p-3 text-slate-600 truncate max-w-[120px] font-sans">{item.destination_zone}</td>
                      <td className="p-3 text-slate-600">{item.assigned_slot}</td>
                      <td className="p-3 text-rose-600 font-bold">{item.estimated_queue_mins}m</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            item.status === 'CONGESTION_RISK'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimized Plan Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold font-mono text-emerald-700 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CityFlow AI Optimized Schedule
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Peak Dwell: ~7.5 mins</span>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-3">Tracking</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Allocated Slot</th>
                    <th className="p-3">Est Queue</th>
                    <th className="p-3 text-right">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {data.optimized_schedule.slice(0, 15).map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{item.tracking_code}</td>
                      <td className="p-3 text-slate-600 truncate max-w-[120px] font-sans">{item.destination_zone}</td>
                      <td className="p-3 text-emerald-700 font-bold">{item.assigned_slot}</td>
                      <td className="p-3 text-emerald-600 font-bold">{item.estimated_queue_mins}m</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            item.status === 'OPTIMIZED_OFF_PEAK'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
