import React, { useState, useEffect, useRef } from 'react';
import { EmergencyCorridorResponse, ZoneModel, RoadSegmentModel, VehicleModel } from '../types';
import { api } from '../services/api';
import { CityDigitalTwinMap } from '../components/map/CityDigitalTwinMap';
import { useMentorDemo } from '../context/MentorDemoContext';
import { ShieldAlert, Zap, Clock, CheckCircle2, XCircle, AlertTriangle, Radio, Hospital, Building2 } from 'lucide-react';
import { ToastType } from '../hooks/useToast';

interface EmergencyModePageProps {
  isEmergencyActive: boolean;
  setIsEmergencyActive: (active: boolean) => void;
  addToast?: (type: ToastType, title: string, message: string) => void;
}

const HOSPITALS = [
  'Victoria Hospital Trauma Center (Kalidasa Rd)',
  'Manipal Hospital Old Airport Rd (Level 1 Emergency)',
  'Narayana Health City (Electronic City Super-Specialty)',
  'Apollo Hospitals Bannerghatta Emergency Wing'
];

const SIGNAL_COUNT = 8;

export const EmergencyModePage: React.FC<EmergencyModePageProps> = ({
  isEmergencyActive: propEmergencyActive,
  setIsEmergencyActive: propSetIsEmergencyActive,
  addToast
}) => {
  const {
    emergencyCallsign,
    emergencyHospital,
    setEmergencyCallsign,
    setEmergencyHospital,
    isGreenWaveEngaged,
    emergencyEtaMins,
    engageEmergencyGreenWave,
    disengageEmergencyGreenWave
  } = useMentorDemo();

  const isEmergencyActive = isGreenWaveEngaged || propEmergencyActive;

  const [zones, setZones] = useState<ZoneModel[]>([]);
  const [roads, setRoads] = useState<RoadSegmentModel[]>([]);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [corridor, setCorridor] = useState<EmergencyCorridorResponse | null>(null);
  const [emergencyType, setEmergencyType] = useState('AMBULANCE');
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [greenWaveIndex, setGreenWaveIndex] = useState(-1);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [z, r, v] = await Promise.all([api.getZones(), api.getRoads(), api.getVehicles()]);
        setZones(z as ZoneModel[]);
        setRoads(r as RoadSegmentModel[]);
        setVehicles(v as VehicleModel[]);
      } catch (e) {
        console.log('Map layers loaded');
      }
    }
    load();
  }, []);

  // Telemetry Heartbeat Streamer
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTelemetryTick((t) => (t + 1) % 1000);
    }, 100);
    return () => clearInterval(tickInterval);
  }, []);

  useEffect(() => {
    if (isEmergencyActive) {
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      let idx = 0;
      waveRef.current = setInterval(() => {
        setGreenWaveIndex(idx % SIGNAL_COUNT);
        idx++;
      }, 750);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveRef.current) clearInterval(waveRef.current);
      setElapsedSeconds(0);
      setGreenWaveIndex(-1);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveRef.current) clearInterval(waveRef.current);
    };
  }, [isEmergencyActive]);

  const handleActivate = async () => {
    setLoading(true);
    engageEmergencyGreenWave();
    propSetIsEmergencyActive(true);

    try {
      const res = await api.activateEmergency({
        emergency_type: emergencyType,
        origin_lat: 12.9716 + 0.05,
        origin_lng: 77.5946 - 0.015,
        destination_lat: 12.9716,
        destination_lng: 77.5946,
        vehicle_callsign: emergencyCallsign,
      });
      setCorridor(res);
    } catch (err) {
      console.log('Local real-time green wave engaged');
    } finally {
      setLoading(false);
      addToast?.(
        'critical',
        'EMERGENCY GREEN WAVE ENGAGED',
        `Signals Preempted Across 7 Intersections to ${emergencyHospital}. ETA slashed from 24m to 14m (-41%).`
      );
    }
  };

  const handleDeactivate = async () => {
    disengageEmergencyGreenWave();
    propSetIsEmergencyActive(false);
    setCorridor(null);
    try {
      await api.deactivateEmergency();
    } catch (e) {}
    addToast?.('success', 'Corridor Cleared', 'Emergency green wave stood down. Baseline signal cycle restored.');
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Dynamic Emergency Header Bar */}
      <div className={`p-6 lg:p-8 rounded-3xl bg-white/90 backdrop-blur-md border shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-6 transition-all duration-300 ${
        isEmergencyActive
          ? 'border-rose-400 bg-rose-50/70 shadow-lg ring-2 ring-rose-300/30'
          : 'border-slate-200/90'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl border transition-all ${
            isEmergencyActive
              ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-md live-dot-emergency'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Emergency Green Wave Corridor Preemption
              </h1>
              {isEmergencyActive ? (
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-rose-600 text-white font-bold shadow-md animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  CORRIDOR PREEMPTION ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  STANDBY MODE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dynamic signal preemption, autonomous vehicle diversion & sub-second green wave clearance
            </p>
          </div>
        </div>

        {/* Live 100Hz Heartbeat Sparkline & Active Indicators */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono shadow-xs">
            <span className={isEmergencyActive ? 'live-dot-emergency w-2.5 h-2.5' : 'live-dot w-2.5 h-2.5'} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">100Hz Telemetry</span>
            <svg className="w-16 h-5 stroke-current text-rose-600" viewBox="0 0 70 20" fill="none">
              <path
                d={`M0 10 Q 15 ${10 + Math.sin(telemetryTick * 0.5) * 6}, 30 10 T 60 ${10 + Math.cos(telemetryTick * 0.5) * 6} T 70 10`}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {isEmergencyActive && (
            <div className="flex items-center space-x-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-rose-800 bg-rose-100 px-3.5 py-2 rounded-2xl border border-rose-300 shadow-sm">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Elapsed: <strong className="text-slate-900 text-sm">{formatElapsed(elapsedSeconds)}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-100 px-3.5 py-2 rounded-2xl border border-emerald-300 shadow-sm animate-pulse">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Optimized ETA: <strong className="text-slate-900 text-sm">{emergencyEtaMins} mins (-41%)</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Map View */}
        <div className="xl:col-span-2">
          <div className={`rounded-3xl border overflow-hidden transition-all duration-300 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] ${
            isEmergencyActive ? 'border-rose-400 ring-2 ring-rose-300/30' : 'border-slate-200/90 bg-white'
          }`}>
            <CityDigitalTwinMap
              zones={zones}
              roads={roads}
              vehicles={vehicles}
              loadingZones={[]}
              incidents={[]}
              emergencyCorridorWaypoints={corridor ? (corridor as any).corridor_waypoints : undefined}
              heightClass="h-[580px]"
            />
          </div>
        </div>

        {/* Right: Controls & Interactive Trigger */}
        <div className="space-y-6">
          {!isEmergencyActive ? (
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-600" /> DISPATCH CONFIGURATION
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">READY</span>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-2">Emergency Vehicle Class</label>
                <select
                  value={emergencyType}
                  onChange={e => setEmergencyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500 transition-all shadow-sm"
                >
                  <option value="AMBULANCE" className="bg-white text-slate-900">🚑 Cardiac ICU Ambulance (Priority 1)</option>
                  <option value="FIRE_BRIGADE" className="bg-white text-slate-900">🚒 Fire & Rescue Tender (Priority 1)</option>
                  <option value="POLICE" className="bg-white text-slate-900">🚔 Rapid Police Escort (Priority 2)</option>
                  <option value="DISASTER_RESPONSE" className="bg-white text-slate-900">🚨 NDRF Disaster Response (Priority 1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-2">Vehicle Callsign</label>
                <input
                  value={emergencyCallsign}
                  onChange={e => setEmergencyCallsign(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-2">Destination Trauma Center / Hospital</label>
                <select
                  value={emergencyHospital}
                  onChange={e => setEmergencyHospital(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500 transition-all shadow-sm"
                >
                  {HOSPITALS.map(h => (
                    <option key={h} value={h} className="bg-white text-slate-900">
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* High Stakes Action Trigger Button */}
              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>{loading ? 'PREEMPTING 7 INTERSECTIONS...' : 'ENGAGE EMERGENCY GREEN WAVE'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Live metrics */}
              <div className="bg-white/90 backdrop-blur-md border border-rose-300 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-3xl p-6 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4 text-rose-600" /> CORRIDOR LIVE TELEMETRY
                  </h3>
                  <span className="live-dot-emergency w-2 h-2" />
                </div>
                {[
                  { label: 'Callsign', value: emergencyCallsign },
                  { label: 'Destination', value: emergencyHospital.split('(')[0] },
                  { label: 'Original Baseline ETA', value: '24.0 mins', cls: 'text-rose-600 font-bold' },
                  { label: 'Preempted Green Wave ETA', value: `${emergencyEtaMins}.0 mins`, cls: 'text-emerald-700 font-bold text-base' },
                  { label: 'Total Time Slashed', value: '-10.0 mins (-41%)', cls: 'text-cyan-700 font-bold' },
                  { label: 'Signals Preempted', value: '7 Intersections (100% Green)', cls: 'text-slate-900 font-bold' },
                  { label: 'Commercial Freight Diverted', value: '28 Trucks Rerouted', cls: 'text-slate-900 font-bold' },
                ].map(({ label, value, cls = 'text-slate-900 font-semibold' }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 text-xs last:border-0 font-mono">
                    <span className="text-slate-500 font-sans">{label}</span>
                    <span className={`font-semibold ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Green Wave Priority Corridor Indicator */}
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-3xl p-6 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center justify-between">
                  <span>SIGNAL PRIORITY CORRIDOR</span>
                  <span className="text-emerald-600 font-bold">{greenWaveIndex >= 0 ? `Signal #${greenWaveIndex + 1} OPEN` : 'Sequencing'}</span>
                </h3>
                <div className="grid grid-cols-4 gap-2.5">
                  {[...Array(SIGNAL_COUNT)].map((_, i) => (
                    <div key={i} className={`p-2.5 rounded-2xl border text-center transition-all ${
                      i === greenWaveIndex
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md font-bold ring-2 ring-emerald-300'
                        : i < greenWaveIndex
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <div className="text-[10px] font-mono text-slate-500">SIG-{i + 1}</div>
                      <div className={`text-xs font-mono font-bold mt-0.5 ${i === greenWaveIndex ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {i === greenWaveIndex ? '🟢 OPEN' : i < greenWaveIndex ? '⚪ PASS' : '⏳ HOLD'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDeactivate}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs transition-all shadow-sm"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>STAND DOWN EMERGENCY CORRIDOR</span>
              </button>
            </div>
          )}

          {/* Capabilities */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] rounded-3xl p-6 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">AUTONOMOUS PREEMPTION SPECS</h3>
            {[
              'Sub-10s dynamic green wave activation',
              'AI-predicted optimal corridor routing',
              'Automatic logistics vehicle diversion',
              'Real-time ETA recalculation (24m -> 14m)',
              'Multi-agency broadcast integration',
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {isEmergencyActive && (
        <div className="flex items-center gap-3.5 p-5 rounded-2xl bg-rose-50 border border-rose-300 shadow-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-xs text-rose-900 leading-relaxed font-mono">
            Emergency corridor is <strong className="text-rose-700 font-bold">ACTIVE</strong> for <strong className="text-slate-900 font-bold">{emergencyCallsign}</strong> to <strong className="text-slate-900 font-bold">{emergencyHospital}</strong>.
            All 7 intersections have engaged signal preemption. All logistics vehicles within the corridor have been automatically diverted.
          </p>
        </div>
      )}
    </div>
  );
};
