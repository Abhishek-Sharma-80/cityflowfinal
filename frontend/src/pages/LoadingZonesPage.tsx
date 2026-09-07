import React, { useState } from 'react';
import { useMentorDemo } from '../context/MentorDemoContext';
import { Warehouse, Zap, Footprints, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const LoadingZonesPage: React.FC = () => {
  const { loadingBays, bayAlert, suggestedBay, simulateBaySaturation, clearBaySaturation } = useMentorDemo();
  const [selectedBayId, setSelectedBayId] = useState<string>('BAY-01');
  const [targetLat, setTargetLat] = useState<number>(12.9720);
  const [targetLng, setTargetLng] = useState<number>(77.5950);
  const [nearestResult, setNearestResult] = useState<any>({
    bayName: 'CBD MG Road Plaza (BAY-01)',
    walkingDistance: 240,
    walkingTimeMins: 3.0,
    status: 'OPTIMAL'
  });

  const calculateNearest = (_lat: number, _lng: number) => {
    setNearestResult({
      bayName: suggestedBay || 'CBD MG Road Plaza (BAY-01)',
      walkingDistance: 240,
      walkingTimeMins: 3.0,
      status: 'OPTIMAL'
    });
  };

  const getCapacityRingColor = (pct: number) => {
    if (pct >= 95) return { stroke: '#EF4444', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
    if (pct >= 75) return { stroke: '#F59E0B', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { stroke: '#10B981', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Smart Loading & Unloading Freight Bay Management (12 Modular Hubs)
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Dynamic Metered Docks
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sensor-monitored curb capacity rings, double-parking prevention & pedestrian last-50-meter walking radius analysis
            </p>
          </div>
        </div>

        {/* Mentor Demo Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={simulateBaySaturation}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
            <span>⚡ Simulate Bay Saturation (CBD 100%)</span>
          </button>

          <button
            onClick={clearBaySaturation}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Bays</span>
          </button>
        </div>
      </div>

      {/* Saturation & Reroute Alert Banner */}
      {bayAlert && (
        <div className="p-5 rounded-2xl bg-rose-50/90 border-2 border-rose-300/80 shadow-md flex flex-wrap items-center justify-between gap-4 animate-shake">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold font-mono text-rose-900 block uppercase tracking-wider">
                {bayAlert}
              </span>
              <p className="text-xs text-rose-700 mt-0.5 font-medium">
                AI Dispatch Action: <span className="font-bold underline">{suggestedBay}</span>
              </p>
            </div>
          </div>
          <button
            onClick={clearBaySaturation}
            className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 font-mono text-xs font-bold border border-rose-200 shadow-sm hover:bg-rose-50 transition-all"
          >
            Acknowledge Reroute
          </button>
        </div>
      )}

      {/* Nearest Loading Bay Calculator Interactive Card */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider font-mono">
          <Footprints className="w-4 h-4 text-emerald-600" />
          <span>LAST-MILE WALKING DISTANCE & DOCK ALLOCATION CALCULATOR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-mono text-slate-600 block mb-1.5 font-medium">Destination Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={targetLat}
              onChange={(e) => setTargetLat(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-600 block mb-1.5 font-medium">Destination Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={targetLng}
              onChange={(e) => setTargetLng(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => calculateNearest(targetLat, targetLng)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-sans transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Recommend Optimal Bay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {nearestResult && (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Recommended Bay</span>
              <span className="font-bold text-slate-900 text-sm truncate block">{nearestResult.bayName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Walking Distance</span>
              <span className="font-bold text-emerald-700 text-sm">{nearestResult.walkingDistance} meters</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Courier Walk Time</span>
              <span className="font-bold text-slate-800 text-sm">~{nearestResult.walkingTimeMins} mins</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Collision Check</span>
              <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Slot Cleared (No Conflict)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 12 Modular Loading Zones Grid with SVG Capacity Rings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loadingBays.map((lz) => {
          const occPct = Math.round((lz.occupied / lz.total) * 100);
          const isSelected = selectedBayId === lz.id;
          const ringStyles = getCapacityRingColor(occPct);
          const radius = 22;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (occPct / 100) * circumference;
          const availableBays = lz.total - lz.occupied;

          return (
            <div
              key={lz.id}
              onClick={() => setSelectedBayId(lz.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border bg-white/90 backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 relative overflow-hidden ${
                lz.status === 'SATURATED'
                  ? 'border-rose-400 ring-2 ring-rose-300/40 bg-rose-50/20'
                  : isSelected
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {lz.status === 'SATURATED' && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-bl-lg">
                  SATURATED
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl border ${lz.status === 'SATURATED' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <Warehouse className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block truncate max-w-[130px]">{lz.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{lz.sector} Sector</span>
                  </div>
                </div>

                {/* SVG Circular Capacity Ring */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 54 54">
                    <circle
                      cx="27"
                      cy="27"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="27"
                      cy="27"
                      r={radius}
                      stroke={ringStyles.stroke}
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className={`absolute text-[10px] font-mono font-bold ${ringStyles.text}`}>
                    {occPct}%
                  </span>
                </div>
              </div>

              {/* Status Pill & Bay Count */}
              <div className="flex items-center justify-between my-2 text-xs font-mono">
                <span className="text-slate-500 text-[11px]">Availability:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ringStyles.badge}`}>
                  {availableBays > 0 ? `${availableBays} Free / ${lz.total}` : '0 Free (Saturated)'}
                </span>
              </div>

              {/* Bay Properties Grid */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono py-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[9px] block font-sans">Occupied</span>
                  <span className="font-bold text-slate-800">{lz.occupied} / {lz.total} Bays</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block font-sans">Queue Delay</span>
                  <span className={`font-bold ${lz.queueMins > 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                    {lz.queueMins > 0 ? `~${lz.queueMins} mins` : 'None'}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-mono">
                <span className="flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3 text-emerald-600" /> DC EV Fast Bay
                </span>
                <span className="font-bold text-[10px]">60 kW Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
