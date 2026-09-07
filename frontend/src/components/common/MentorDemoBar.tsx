import React from 'react';
import { useMentorDemo, ScenarioType } from '../../context/MentorDemoContext';
import { Zap, RotateCcw, Activity, AlertTriangle, CloudRain, ShieldCheck, Flame, Radio } from 'lucide-react';

export const MentorDemoBar: React.FC = () => {
  const {
    activeScenario,
    activeScenarioName,
    isSimulating,
    setScenario,
    runLiveScenario,
    resetToBaseline,
    cityPressure
  } = useMentorDemo();

  const scenarios: { type: ScenarioType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      type: 'NORMAL',
      label: 'Normal Flow',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      color: 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
    },
    {
      type: 'RUSH_HOUR',
      label: 'Peak Rush Hour Surge (+35%)',
      icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
      color: 'border-rose-200 text-rose-800 hover:bg-rose-50'
    },
    {
      type: 'INCIDENT',
      label: 'Incident / Road Blockage',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
      color: 'border-amber-200 text-amber-800 hover:bg-amber-50'
    },
    {
      type: 'WEATHER',
      label: 'Bad Weather Delay',
      icon: <CloudRain className="w-3.5 h-3.5 text-blue-600" />,
      color: 'border-blue-200 text-blue-800 hover:bg-blue-50'
    }
  ];

  return (
    <div className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-[1750px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        
        {/* Left: 100Hz Telemetry Stream Radar Ripple */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-sm text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wide text-slate-100 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Real-Time Telemetry: <span className="text-emerald-400 font-bold">100Hz Stream</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              City Pressure: <strong className="text-slate-900">{cityPressure}%</strong>
            </span>
          </div>
        </div>

        {/* Center: Scenario Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 xl:pb-0 scrollbar-none">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mr-1 hidden sm:inline">
            Scenario:
          </span>
          {scenarios.map(s => {
            const isActive = activeScenario === s.type;
            return (
              <button
                key={s.type}
                onClick={() => setScenario(s.type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-[1.02]'
                    : `bg-white/90 ${s.color} hover:shadow-sm`
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Run Live Scenario & Reset Buttons */}
        <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
          <button
            onClick={() => runLiveScenario()}
            disabled={isSimulating}
            className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 ring-1 ring-emerald-400/30"
          >
            <Zap className={`w-3.5 h-3.5 text-yellow-300 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating 100Hz...' : '⚡ Run Live Scenario'}</span>
          </button>

          <button
            onClick={resetToBaseline}
            title="Reset telemetry and metrics to baseline"
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset to Baseline</span>
          </button>
        </div>

      </div>
    </div>
  );
};