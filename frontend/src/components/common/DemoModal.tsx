import React, { useState } from 'react';
import { DemoRunResult } from '../../types';
import { api } from '../../services/api';
import { Sparkles, X, CheckCircle2, Play, RefreshCw, ShieldCheck, Flame } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoCompleted?: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onDemoCompleted }) => {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<DemoRunResult | null>(null);

  if (!isOpen) return null;

  const handleStartDemo = async () => {
    setRunning(true);
    setStep(1);
    setResult(null);

    // Step progression animation
    setTimeout(() => setStep(2), 1100);
    setTimeout(() => setStep(3), 2200);
    setTimeout(() => setStep(4), 3300);

    try {
      const data = await api.runDemoSurge();
      setTimeout(() => {
        setResult(data);
        setStep(5);
        setRunning(false);
        if (onDemoCompleted) onDemoCompleted();
      }, 4400);
    } catch (err) {
      console.error(err);
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-mono">
                <span>1-Click Interactive Demo Scenario</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  SIH 2026 JURY
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Evening Peak Logistics Surge & Multi-Zone Shockwave Mitigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Scenario Overview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulated Real-World Shockwave Injections</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-medium">Fleet Demand Surge</span>
                <span className="font-bold text-slate-900 font-mono text-sm">+25% Delivery Surge</span>
                <p className="text-[10px] text-slate-500 mt-1">480 active commercial vehicles entering city arterial core.</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-medium">Infrastructure Blockage</span>
                <span className="font-bold text-rose-600 font-mono text-sm">R-06 Pipeline Closure</span>
                <p className="text-[10px] text-slate-500 mt-1">Full 2-lane restriction on Old City Heritage pass.</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-medium">Pedestrian Mass Event</span>
                <span className="font-bold text-amber-600 font-mono text-sm">Central Cyber Expo</span>
                <p className="text-[10px] text-slate-500 mt-1">Footfall surge choking Tech Park & CBD access routes.</p>
              </div>
            </div>
          </div>

          {/* Execution Steps Stepper */}
          {running && (
            <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800 font-mono flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Executing CityFlow AI Optimization Pipeline...</span>
                </span>
                <span className="text-emerald-800 font-mono font-medium bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Step {step} of 5
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-700">
                <div className={step >= 1 ? 'text-emerald-700 flex items-center gap-2 font-semibold' : 'text-slate-400'}>
                  {step >= 1 ? '✓' : '•'} 1. Ingesting spatial traffic shockwave & 480 fleet coordinates...
                </div>
                <div className={step >= 2 ? 'text-emerald-700 flex items-center gap-2 font-semibold' : 'text-slate-400'}>
                  {step >= 2 ? '✓' : '•'} 2. Computing 15m/30m/60m ML Congestion Forecast with RandomForest (R²=0.96)...
                </div>
                <div className={step >= 3 ? 'text-emerald-700 flex items-center gap-2 font-semibold' : 'text-slate-400'}>
                  {step >= 3 ? '✓' : '•'} 3. Rebalancing 43 commercial delivery slots to off-peak buffer windows...
                </div>
                <div className={step >= 4 ? 'text-emerald-700 flex items-center gap-2 font-semibold' : 'text-slate-400'}>
                  {step >= 4 ? '✓' : '•'} 4. Calculating Pareto multi-objective bypass routes avoiding blocked R-06...
                </div>
                <div className={step >= 5 ? 'text-emerald-700 flex items-center gap-2 font-semibold' : 'text-slate-400'}>
                  {step >= 5 ? '✓' : '•'} 5. Synthesizing before-vs-after impact metrics & ESG carbon savings...
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold font-mono">Autonomous Optimization Complete</span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-bold text-emerald-800 border border-emerald-300">
                  OR-TOOLS + PARETO SOLVER
                </span>
              </div>

              {/* Top Impact Metric Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Travel Time</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono">
                    -{result.final_impact_metrics.travel_time_reduction_pct}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Congestion</span>
                  <span className="text-xl font-bold text-slate-900 font-mono">
                    -{result.final_impact_metrics.congestion_reduction_pct}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Fuel Burn</span>
                  <span className="text-xl font-bold text-amber-700 font-mono">
                    -{result.final_impact_metrics.fuel_saving_pct}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">CO2 Emissions</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono">
                    -{result.final_impact_metrics.co2_reduction_pct}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Delivery Delay</span>
                  <span className="text-xl font-bold text-slate-800 font-mono">
                    -{result.final_impact_metrics.delivery_delay_reduction_pct}%
                  </span>
                </div>
              </div>

              {/* Before vs After Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200">
                    <tr>
                      <th className="p-3">Performance Dimension</th>
                      <th className="p-3 text-rose-600">Unmanaged Surge</th>
                      <th className="p-3 text-emerald-700">CityFlow AI</th>
                      <th className="p-3 text-right">Net Improvement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {result.before_vs_after_comparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-sans font-medium text-slate-900">{row.metric}</td>
                        <td className="p-3 text-rose-600 font-medium">{row.unmanaged_surge}</td>
                        <td className="p-3 text-emerald-700 font-bold">{row.cityflow_optimized}</td>
                        <td className="p-3 text-right text-emerald-700 font-bold">{row.improvement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI System Decisions Taken */}
              <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
                <h4 className="text-xs font-semibold text-slate-800 uppercase font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Autonomous AI Orchestrations Deployed</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                  {result.system_actions_taken.map((action, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {result ? '✓ Complete simulation metrics applied to city digital twin' : 'Click below to execute the live AI demonstration'}
          </span>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300"
            >
              Close
            </button>
            <button
              onClick={handleStartDemo}
              disabled={running}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50 shadow-sm"
            >
              {running ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-white fill-current" />
                  <span>{result ? 'Rerun Demo Scenario' : 'Run 1-Click Demo'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


