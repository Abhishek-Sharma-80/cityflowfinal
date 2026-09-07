import React from 'react';
import { KPIDashboardModel } from '../../types';
import { useMentorDemo } from '../../context/MentorDemoContext';
import { Activity, Truck, BrainCircuit, ShieldAlert, Leaf, TrendingDown, TrendingUp, Zap, Radio } from 'lucide-react';

interface KPICardsProps {
  kpis?: KPIDashboardModel | null;
  loading?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, loading = false }) => {
  const mentorDemo = useMentorDemo();

  // Dynamic state bound to live scenario / context overrides
  const pressure = mentorDemo.cityPressure ?? kpis?.city_pressure_index ?? 72;
  const activeVehicles = mentorDemo.activeFleet ?? kpis?.active_vehicles ?? 480;
  const totalVehicles = 500;
  const accuracy = mentorDemo.aiStability ?? 98.9;
  const emergencyCorridors = mentorDemo.activeCorridors ?? kpis?.live_incidents_count ?? 2;
  const co2Saved = mentorDemo.co2SavedKg ?? kpis?.co2_saved_today_kg ?? 1420;
  const fuelSaved = Math.round(co2Saved * 0.458);

  const isHighPressure = pressure > 70;
  const isExtremePressure = pressure >= 85;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {/* 1. Live City Pressure Index */}
      <div className={`flex flex-col justify-between p-5 bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${
        isExtremePressure 
          ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-400/30' 
          : isHighPressure 
            ? 'border-amber-300 bg-amber-50/30' 
            : 'border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Activity className={`w-3.5 h-3.5 ${isExtremePressure ? 'text-rose-600' : isHighPressure ? 'text-amber-600' : 'text-emerald-600'}`} />
            City Pressure
          </span>
          <span className={`flex h-2.5 w-2.5 rounded-full ${isExtremePressure ? 'bg-rose-500 live-dot-emergency' : isHighPressure ? 'bg-amber-500 live-dot' : 'bg-emerald-500 live-dot'}`} />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl lg:text-4xl font-bold font-mono tracking-tight transition-all duration-300 ${
                isExtremePressure ? 'text-rose-700' : isHighPressure ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {pressure}%
              </span>
              <span className="text-[11px] font-mono text-slate-500">Index</span>
            </div>
            <span className={`text-xs font-semibold flex items-center font-mono ${isHighPressure ? 'text-rose-700' : 'text-emerald-700'}`}>
              {isHighPressure ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
              {isHighPressure ? '+17.0%' : '2.4%'}
            </span>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <svg className={`w-24 h-5 stroke-current ${isExtremePressure ? 'text-rose-500' : isHighPressure ? 'text-amber-500' : 'text-emerald-500'}`} viewBox="0 0 90 20" fill="none">
              <path
                d={isHighPressure ? "M 0 18 Q 20 16, 40 8 T 70 4 T 90 2" : "M 0 15 Q 15 5, 30 12 T 60 4 T 90 8"}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] text-slate-500 font-sans font-medium">1hr live trend</span>
          </div>
        </div>
      </div>

      {/* 2. Active Commercial Fleet */}
      <div className="flex flex-col justify-between p-5 bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-cyan-600" />
            Active Fleet
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-100 text-cyan-800 border border-cyan-300">
            +12% EVs
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl lg:text-4xl font-bold font-mono text-slate-900 tracking-tight transition-all duration-300">
                {activeVehicles}
              </span>
              <span className="text-xs font-mono text-slate-500">/ {totalVehicles} Units</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 96%
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-sans font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Zap className="w-3 h-3 text-emerald-600" /> 35% EV Fleet
            </span>
            <span className="text-slate-500">28 en route</span>
          </div>
        </div>
      </div>

      {/* 3. AI Prediction Accuracy */}
      <div className="flex flex-col justify-between p-5 bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
            AI Accuracy
          </span>
          <span className="live-dot w-2.5 h-2.5" />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl lg:text-4xl font-bold font-mono text-emerald-700 tracking-tight transition-all duration-300">
                {accuracy}%
              </span>
              <span className="text-xs font-mono text-slate-500">{accuracy >= 98 ? '(Stable)' : '(Calibrating)'}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
              R² 0.99
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-sans font-medium">
            <span className="text-slate-700 font-medium">RandomForest Ensemble</span>
            <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> 100Hz
            </span>
          </div>
        </div>
      </div>

      {/* 4. Emergency Green Waves */}
      <div className="flex flex-col justify-between p-5 bg-white/85 backdrop-blur-md border border-rose-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Green Waves
          </span>
          <span className="live-dot-emergency w-2.5 h-2.5" />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl lg:text-4xl font-bold font-mono text-rose-700 tracking-tight transition-all duration-300">
                {emergencyCorridors}
              </span>
              <span className="text-xs font-mono text-slate-600">Active Corridors</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-mono animate-pulse">
              PRIORITY 1
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-100 flex items-center justify-between text-[11px] text-rose-800 font-sans font-medium">
            <span>Sub-10s Signal Preemption</span>
            <span className="font-mono font-bold text-emerald-700">-38% ETA</span>
          </div>
        </div>
      </div>

      {/* 5. Daily CO2 Offset */}
      <div className="flex flex-col justify-between p-5 bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            CO2 Abatement
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
            ESG
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl lg:text-4xl font-bold font-mono text-emerald-700 tracking-tight transition-all duration-300">
                {co2Saved.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">kg Saved</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center font-mono">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 18.5%
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-sans font-medium">
            <span>{fuelSaved} L fuel avoided</span>
            <span className="text-emerald-700 font-bold font-mono">Net Zero</span>
          </div>
        </div>
      </div>
    </div>
  );
};

