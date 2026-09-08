import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  Clock,
  RotateCcw,
  Maximize2,
  ChevronDown,
  Info,
  Users,
  Truck,
  Sliders,
  ArrowLeft,
  Activity,
  Gauge,
  Car,
  TrendingDown,
  GitBranch
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const TrafficIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHorizon, setSelectedHorizon] = useState<15 | 30 | 60>(15);
  const [corridorDropdownOpen, setCorridorDropdownOpen] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState({
    id: 'R-01',
    name: 'R-01: MG Road Express Corridor (7.8 km)',
    currentSpeed: 24.5,
    freeFlow: 60.8,
    pred15: 23.0,
    pred30: 21.4,
    pred60: 26.2,
    density: 58,
    volume: 2880,
    lanes: 6,
    deficit: -35.5,
    emissions: '1.4x',
    length: '7.8 km',
    uncertainty: '± 2.4 km/h unc.'
  });

  const corridors = [
    {
      id: 'R-01',
      name: 'R-01: MG Road Express Corridor (7.8 km)',
      currentSpeed: 24.5,
      freeFlow: 60.8,
      pred15: 23.0,
      pred30: 21.4,
      pred60: 26.2,
      density: 58,
      volume: 2880,
      lanes: 6,
      deficit: -35.5,
      emissions: '1.4x',
      length: '7.8 km',
      uncertainty: '± 2.4 km/h unc.'
    },
    {
      id: 'R-02',
      name: 'R-02: NH-48 Cyber City - Mahipalpur (12.4 km)',
      currentSpeed: 28.0,
      freeFlow: 65.0,
      pred15: 26.2,
      pred30: 24.0,
      pred60: 29.5,
      density: 64,
      volume: 3420,
      lanes: 8,
      deficit: -37.0,
      emissions: '1.6x',
      length: '12.4 km',
      uncertainty: '± 2.8 km/h unc.'
    },
    {
      id: 'R-03',
      name: 'R-03: Ring Road AIIMS - South Ext (5.2 km)',
      currentSpeed: 21.0,
      freeFlow: 55.0,
      pred15: 19.8,
      pred30: 18.5,
      pred60: 22.0,
      density: 72,
      volume: 2950,
      lanes: 6,
      deficit: -34.0,
      emissions: '1.5x',
      length: '5.2 km',
      uncertainty: '± 2.1 km/h unc.'
    },
  ];

  // Chart time-series points matching screenshot curve
  const chartData = [
    { time: '-30 min', observed: 23.0, forecast: null, uncertaintyLow: null, uncertaintyHigh: null },
    { time: '-15 min', observed: 25.8, forecast: null, uncertaintyLow: null, uncertaintyHigh: null },
    { time: 'Now (Observed)', observed: selectedCorridor.currentSpeed, forecast: selectedCorridor.currentSpeed, uncertaintyLow: selectedCorridor.currentSpeed, uncertaintyHigh: selectedCorridor.currentSpeed },
    { time: '+15 min', observed: null, forecast: selectedCorridor.pred15, uncertaintyLow: selectedCorridor.pred15 - 3.5, uncertaintyHigh: selectedCorridor.pred15 + 4.5 },
    { time: '+30 min', observed: null, forecast: selectedCorridor.pred30, uncertaintyLow: selectedCorridor.pred30 - 6.0, uncertaintyHigh: selectedCorridor.pred30 + 7.5 },
    { time: '+60 min', observed: null, forecast: selectedCorridor.pred60, uncertaintyLow: selectedCorridor.pred60 - 8.5, uncertaintyHigh: selectedCorridor.pred60 + 11.0 },
  ];

  const currentPrediction = selectedHorizon === 15 
    ? selectedCorridor.pred15 
    : selectedHorizon === 30 
    ? selectedCorridor.pred30 
    : selectedCorridor.pred60;

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto animate-fadeIn pb-12 text-slate-800">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER & MODEL BADGE ROW                      */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Breadcrumbs + Title (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>CityFlow</span>
              </button>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800 font-bold">Traffic Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight leading-tight mb-2">
              Traffic Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed font-normal">
              Multi-horizon traffic speed forecasting and congestion trajectory analysis for Bengaluru corridors.
            </p>
          </div>
        </div>

        {/* Middle: Skyline Banner (3 cols) */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xs min-h-[120px] flex items-end p-4 group">
          <img
            src="/images/bengaluru_skyline_banner.jpg"
            alt="Bengaluru Skyline"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
          <div className="relative z-10 text-white">
            <span className="text-[11px] text-slate-300 font-medium">Smarter</span>
            <div className="text-sm sm:text-base font-extrabold leading-snug">
              Mobility for a <br />
              <span className="text-white">Brighter Tomorrow.</span>
            </div>
          </div>
        </div>

        {/* Right: Chronos-2 Model Badge Card (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-tight">
                  Chronos-2
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Zero-Shot Forecaster
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal mt-2">
            Pretrained foundation model for traffic time-series forecasting.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. CONTROLS RIBBON: CORRIDOR, HORIZON, RESET         */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Corridor Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200">
            A
          </div>
          <div className="relative flex-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Corridor
            </div>
            <button
              onClick={() => setCorridorDropdownOpen(!corridorDropdownOpen)}
              className="mt-0.5 flex items-center justify-between w-full max-w-md px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition text-left"
            >
              <span className="truncate">{selectedCorridor.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
            </button>

            {corridorDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                {corridors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCorridor(c);
                      setCorridorDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 ${
                      selectedCorridor.id === c.id ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Forecast Horizon Selector Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Forecast Horizon</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {([15, 30, 60] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedHorizon === h
                    ? 'bg-[#0b132b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                +{h} min
              </button>
            ))}
          </div>
        </div>

        {/* Right: Reset to Baseline Action */}
        <div>
          <button
            onClick={() => {
              setSelectedHorizon(15);
              setSelectedCorridor(corridors[0]);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. FOUR METRIC CARDS ROW                             */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Speed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              REAL_API
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Current Speed</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {selectedCorridor.currentSpeed.toFixed(1)}{' '}
              <span className="text-sm font-semibold text-slate-500">km/h</span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Free-flow: {selectedCorridor.freeFlow} km/h</span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              CONGESTED
            </span>
          </div>
        </div>

        {/* Card 2: Predicted Speed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              ML_PREDICTION
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Predicted Speed (+{selectedHorizon}m)</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {currentPrediction.toFixed(1)}{' '}
              <span className="text-sm font-semibold text-slate-500">km/h</span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Model: Chronos-2</span>
            <span className="text-purple-600 font-mono font-semibold">{selectedCorridor.uncertainty}</span>
          </div>
        </div>

        {/* Card 3: Forecast Congestion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              ML_PREDICTION
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Forecast Congestion</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {selectedCorridor.density}%{' '}
              <span className="text-sm font-semibold text-slate-500">density</span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Volume: {selectedCorridor.volume} vph</span>
            <span>{selectedCorridor.lanes} lanes</span>
          </div>
        </div>

        {/* Card 4: Speed Deficit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Gauge className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              CALCULATED
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Speed Deficit</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-0.5">
              {selectedCorridor.deficit}{' '}
              <span className="text-sm font-semibold text-slate-500">km/h</span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Emissions: {selectedCorridor.emissions}</span>
            <span>{selectedCorridor.length}</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. SPEED FORECAST TRAJECTORY CHART                   */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        {/* Chart Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Speed Forecast Trajectory: {selectedCorridor.name.split(':')[1]?.split('(')[0] || 'MG Road Express Corridor'}
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                ZERO-SHOT FORECAST
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing historical observed speed from Chronos-2 forward predictions with uncertainty boundaries.
            </p>
          </div>

          {/* Chart Legend matching screenshot */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-4 h-0.5 rounded bg-emerald-500"></span>
              <span>Observed Speed</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-4 h-0.5 rounded border-b-2 border-dashed border-purple-600"></span>
              <span>Chronos-2 Forecast</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-3.5 h-3.5 rounded bg-purple-100 border border-purple-200"></span>
              <span>Uncertainty Band</span>
            </div>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="relative h-72 w-full pt-6">
          {/* "Now" Tooltip callout badge floating over Now tick */}
          <div className="absolute top-10 left-[48%] -translate-x-1/2 z-20 bg-slate-100 border border-slate-200 shadow-xs px-3 py-1.5 rounded-xl text-center pointer-events-none">
            <div className="text-[10px] text-slate-400 font-semibold">Now</div>
            <div className="text-xs font-extrabold text-slate-900">{selectedCorridor.currentSpeed.toFixed(1)} km/h</div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.04} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
              />

              {/* Vertical line separating history from forecast */}
              <ReferenceLine x="Now (Observed)" stroke="#0b132b" strokeDasharray="3 3" strokeWidth={1} />

              {/* Uncertainty Area */}
              <Area
                type="monotone"
                dataKey="uncertaintyHigh"
                stroke="transparent"
                fill="url(#uncertaintyGradient)"
              />

              {/* Observed historical line (Solid Green) */}
              <Line
                type="monotone"
                dataKey="observed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />

              {/* Chronos-2 forecast line (Dashed Purple) */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3.5, fill: '#8b5cf6', strokeWidth: 1.5, stroke: '#ffffff' }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. FORECAST FEATURE ATTRIBUTION SECTION              */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">Forecast Feature Attribution</h4>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  ML_PREDICTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Key factors influencing the next 15 minutes
              </p>
            </div>
          </div>

          <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition">
            <Info className="w-3.5 h-3.5" />
            <span>How it works?</span>
          </button>
        </div>

        {/* 3 Cards Row matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Factor 1: Evening Office Outflow Surge */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Evening Office Outflow Surge</h5>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Commuter volume mapping into main arterial.
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '38%' }}></div>
              </div>
              <span className="text-xs font-bold text-purple-700">38%</span>
            </div>
          </div>

          {/* Factor 2: Curb Unloading Dwell */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Curb Unloading Dwell</h5>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Commercial delivery bay queue spillover.
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '34%' }}></div>
              </div>
              <span className="text-xs font-bold text-purple-700">34%</span>
            </div>
          </div>

          {/* Factor 3: Downstream Bottleneck Prevention */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Downstream Bottleneck Prevention</h5>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Signal timing optimization dampening peak queue.
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '28%' }}></div>
              </div>
              <span className="text-xs font-bold text-purple-700">28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
