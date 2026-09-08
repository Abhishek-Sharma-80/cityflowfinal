import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Search,
  Plus,
  Minus,
  Crosshair,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  HardHat,
  Car,
  TrendingDown,
  ArrowLeft,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export const RoadRiskPage: React.FC = () => {
  const navigate = useNavigate();
  const [mapFilter, setMapFilter] = useState<'all' | 'high' | 'moderate' | 'low' | 'construction'>('all');
  const [mapSearch, setMapSearch] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    roadRisk: true,
    trafficFlow: true,
    incidents: false,
    construction: false,
    cctv: false,
    metro: false,
  });

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const riskDistributionData = [
    { name: 'High Risk', value: 15, count: 6, color: '#ef4444' },
    { name: 'Moderate Risk', value: 30, count: 12, color: '#f59e0b' },
    { name: 'Low Risk', value: 50, count: 28, color: '#10b981' },
    { name: 'Construction', value: 5, count: 3, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto animate-fadeIn pb-12 text-slate-800">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER & BANNERS ROW                          */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Breadcrumb + Title (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>CityFlow</span>
              </button>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800 font-bold">Road Risk Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] tracking-tight leading-tight">
              Road Risk Intelligence <br />
              <span className="text-emerald-700">Bengaluru</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-2 max-w-md">
              AI-powered road risk classification and hazard probability prediction across Bengaluru corridors.
            </p>
          </div>
        </div>

        {/* Middle: Bengaluru Skyline Banner (4 cols) */}
        <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-xs min-h-[130px] flex items-end p-5 group">
          <img
            src="/images/bengaluru_skyline_banner.jpg"
            alt="Bengaluru Skyline"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent"></div>
          <div className="relative z-10 text-white">
            <span className="text-xs text-emerald-200 font-medium tracking-wide">Safer Roads</span>
            <div className="text-lg sm:text-xl font-extrabold font-serif italic text-white leading-tight">
              Stronger Bengaluru
            </div>
          </div>
        </div>

        {/* Right: Quote / Mission Card (3 cols) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-slate-900 to-[#0b132b] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <p className="text-xs sm:text-sm italic font-serif leading-relaxed text-slate-200">
            &ldquo;Data-driven insights for a smoother, safer and smarter Bengaluru.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>XGBoost Hazard Predictor</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. FOUR RISK METRICS ROW                             */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Network Risk */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowDown className="w-3 h-3 mr-0.5" /> 12%
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Overall Network Risk</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">58</span>
              <span className="text-sm font-semibold text-slate-400">/100</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                MODERATE
              </span>
            </div>
          </div>

          {/* Orange Sparkline */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-5 w-28">
              <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
                <path d="M0 14 Q 20 18, 40 8 T 70 12 T 100 6" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last week</span>
          </div>
        </div>

        {/* Card 2: High-Risk Corridors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 2
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">High-Risk Corridors</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">6</span>
              <span className="text-sm font-semibold text-slate-500">segments</span>
            </div>
          </div>

          {/* Red Sparkline */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-5 w-28">
              <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
                <path d="M0 16 Q 25 6, 50 14 T 80 4 T 100 8" stroke="#ef4444" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last week</span>
          </div>
        </div>

        {/* Card 3: Moderate Risk */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowDown className="w-3 h-3 mr-0.5" /> 4
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Moderate Risk</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">12</span>
              <span className="text-sm font-semibold text-slate-500">segments</span>
            </div>
          </div>

          {/* Amber Sparkline */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-5 w-28">
              <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
                <path d="M0 8 Q 30 16, 60 10 T 100 12" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last week</span>
          </div>
        </div>

        {/* Card 4: Low Risk / Free Flow */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 6
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Low Risk / Free Flow</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">28</span>
              <span className="text-sm font-semibold text-slate-500">segments</span>
            </div>
          </div>

          {/* Green Sparkline */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-5 w-28">
              <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
                <path d="M0 14 Q 25 18, 50 8 T 75 12 T 100 4" stroke="#10b981" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MIDDLE SECTION: BENGALURU MAP + RIGHT CARDS       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Bengaluru Road Risk Map (8 cols) */}
        <div className="lg:col-span-8 bg-[#091122] text-white rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col relative min-h-[500px]">
          {/* Map Header */}
          <div className="p-4 bg-[#091122]/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">Bengaluru Road Risk Map</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live
              </span>
            </div>

            {/* Filter Pills matching screenshot */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setMapFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  mapFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMapFilter('high')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  mapFilter === 'high' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                High Risk
              </button>
              <button
                onClick={() => setMapFilter('moderate')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  mapFilter === 'moderate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Moderate
              </button>
              <button
                onClick={() => setMapFilter('low')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  mapFilter === 'low' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Low Risk
              </button>
              <button
                onClick={() => setMapFilter('construction')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  mapFilter === 'construction' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Construction
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                placeholder="Search location..."
                className="pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-40"
              />
            </div>
          </div>

          {/* Map Canvas with Bengaluru Nodes */}
          <div className="relative flex-1 bg-[#060d1b] overflow-hidden min-h-[420px]">
            {/* SVG Corridor Network */}
            <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 800 450" preserveAspectRatio="none">
              <defs>
                <pattern id="bengaluru-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bengaluru-grid)" />

              {/* Glowing Bengaluru Corridors */}
              {/* Outer Ring Road (Hebbal to Silk Board to Marathahalli) */}
              <path d="M 400 80 Q 560 140, 520 280 T 320 340 T 260 220 Z" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
              {/* Tumkur Road (Red high risk) */}
              <path d="M 160 120 L 320 200" stroke="#ef4444" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Hosur Road (Orange) */}
              <path d="M 480 320 L 620 420" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Bellary / Airport Road (Green) */}
              <path d="M 400 80 L 410 0" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Whitefield Corridor (Purple under construction) */}
              <path d="M 520 200 L 720 210" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
            </svg>

            {/* Bengaluru Neighborhood Tags */}
            <span className="absolute top-16 right-72 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
              Hebbal
            </span>
            <span className="absolute top-8 right-80 text-[10px] font-mono text-slate-500 uppercase pointer-events-none">
              Yelahanka
            </span>
            <span className="absolute bottom-20 left-20 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
              Kengeri
            </span>
            <span className="absolute bottom-28 left-64 text-[11px] font-bold text-slate-400 uppercase pointer-events-none">
              Banashankari
            </span>
            <span className="absolute bottom-36 left-80 text-[11px] font-bold text-slate-300 uppercase pointer-events-none">
              Jayanagar
            </span>
            <span className="absolute bottom-36 right-80 text-[11px] font-bold text-slate-400 uppercase pointer-events-none">
              HSR Layout
            </span>
            <span className="absolute bottom-20 right-96 text-[10px] font-mono text-slate-500 uppercase pointer-events-none">
              BTM Layout
            </span>
            <span className="absolute bottom-40 right-64 text-xs font-bold text-slate-300 uppercase tracking-wider pointer-events-none">
              Koramangala
            </span>
            <span className="absolute top-44 right-20 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
              Whitefield
            </span>
            <span className="absolute bottom-16 right-28 text-xs font-bold text-slate-400 uppercase tracking-wider pointer-events-none">
              Electronic City
            </span>

            {/* Interactive Alert Pins matching screenshot */}
            {/* Pin 1: Tumkur Road High Risk Score 82 */}
            <div className="absolute top-28 left-48 z-10 bg-slate-900/95 border border-rose-500/80 p-2.5 rounded-xl shadow-2xl flex items-start gap-2.5 max-w-[170px] animate-bounce-subtle">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5 animate-ping"></span>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Tumkur Road</div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">High Risk</div>
                <div className="text-[9px] text-slate-300">Score: 82</div>
              </div>
            </div>

            {/* Pin 2: Outer Ring Road Moderate Risk Score 64 */}
            <div className="absolute top-36 right-72 z-10 bg-slate-900/95 border border-amber-500/80 p-2.5 rounded-xl shadow-2xl flex items-start gap-2.5 max-w-[180px]">
              <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0 mt-0.5"></span>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Outer Ring Road</div>
                <div className="text-[10px] text-amber-400 font-bold mt-0.5">Moderate Risk</div>
                <div className="text-[9px] text-slate-300">Score: 64</div>
              </div>
            </div>

            {/* Pin 3: Silk Board High Risk Score 78 */}
            <div className="absolute bottom-24 right-72 z-10 bg-slate-900/95 border border-rose-500/80 p-2.5 rounded-xl shadow-2xl flex items-start gap-2.5 max-w-[170px]">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5 animate-pulse"></span>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Silk Board</div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">High Risk</div>
                <div className="text-[9px] text-slate-300">Score: 78</div>
              </div>
            </div>

            {/* Floating Layers Box on Map (Top Right) */}
            <div className="absolute top-5 right-5 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] shadow-lg w-36 space-y-1.5">
              <div className="text-xs font-bold text-white mb-2">Layers</div>
              {([
                { key: 'roadRisk', label: 'Road Risk' },
                { key: 'trafficFlow', label: 'Traffic Flow' },
                { key: 'incidents', label: 'Incidents' },
                { key: 'construction', label: 'Construction' },
                { key: 'cctv', label: 'CCTV Cameras' },
                { key: 'metro', label: 'Metro Network' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={activeLayers[key]}
                    onChange={() => toggleLayer(key)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 w-3 h-3"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* Risk Level Legend (Bottom Right) */}
            <div className="absolute bottom-5 right-5 z-10 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[10px] shadow-lg space-y-1.5">
              <div className="text-xs font-bold text-white mb-1">Risk Level</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-300">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <span className="text-slate-300">Under Construction</span>
              </div>
            </div>

            {/* Map Zoom Controls (Bottom Left) */}
            <div className="absolute bottom-5 left-5 z-10 flex flex-col gap-1.5">
              <button 
                onClick={() => navigate('/map')}
                className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shadow"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shadow"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shadow"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Risk Distribution & AI Insights (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          {/* Card 1: Risk Distribution (Donut Chart) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <PieIcon className="w-4 h-4 text-slate-600" />
              <h4 className="text-xs font-bold text-slate-900">Risk Distribution</h4>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center py-2">
              {/* Donut Chart with Center Text */}
              <div className="col-span-5 h-36 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={58}
                      paddingAngle={3}
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">58</span>
                  <div className="text-[9px] text-slate-400 font-medium">Network Risk</div>
                  <div className="text-[8px] text-amber-600 font-bold">(Moderate)</div>
                </div>
              </div>

              {/* Breakdown Legend List matching screenshot */}
              <div className="col-span-7 space-y-2 pl-2 border-l border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-slate-600 text-[11px]">High Risk</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">15%</span>
                    <span className="text-[10px] text-slate-400 block">6 segments</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="text-slate-600 text-[11px]">Moderate Risk</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">30%</span>
                    <span className="text-[10px] text-slate-400 block">12 segments</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-600 text-[11px]">Low Risk</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">50%</span>
                    <span className="text-[10px] text-slate-400 block">28 segments</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span className="text-slate-600 text-[11px]">Construction</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">5%</span>
                    <span className="text-[10px] text-slate-400 block">3 segments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Insights (Powered by XGBoost) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-900">AI Insights</span>
                <span className="text-[10px] text-slate-400 font-mono">Powered by XGBoost</span>
              </div>
              <button 
                onClick={() => navigate('/model-center')}
                className="text-[11px] font-bold text-slate-600 hover:text-purple-600 flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 py-2">
              {/* Insight 1 */}
              <div className="flex items-start justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Elevated risk detected on Tumkur Road</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Risk score increased by 18% in last 24 hours.
                    </p>
                    <span className="text-[9px] text-slate-400">2 hours ago</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded shrink-0">
                  High
                </span>
              </div>

              {/* Insight 2 */}
              <div className="flex items-start justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Pothole cluster likely on ORR (Hebbal)</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Surface degradation pattern detected.
                    </p>
                    <span className="text-[9px] text-slate-400">4 hours ago</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded shrink-0">
                  Moderate
                </span>
              </div>

              {/* Insight 3 */}
              <div className="flex items-start justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <HardHat className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Construction activity on Airport Road</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Expect reduced capacity for next 2 weeks.
                    </p>
                    <span className="text-[9px] text-slate-400">5 hours ago</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded shrink-0">
                  Info
                </span>
              </div>

              {/* Insight 4 */}
              <div className="flex items-start justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Overall risk improving in IT Corridor</h5>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Risk score decreased by 12% this week.
                    </p>
                    <span className="text-[9px] text-slate-400">1 day ago</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shrink-0">
                  Positive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. BOTTOM SECTION: CORRIDORS TABLE + RISK FACTORS    */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: High-Risk & Moderate-Risk Corridors Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  High-Risk &amp; Moderate-Risk Corridors
                </h4>
                <p className="text-[10px] text-slate-400">Corridors with elevated hazard probability</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/routes')}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100 pb-2">
                  <th className="py-2 font-semibold">#</th>
                  <th className="py-2 font-semibold">CORRIDOR</th>
                  <th className="py-2 font-semibold">RISK SCORE</th>
                  <th className="py-2 font-semibold">RISK LEVEL</th>
                  <th className="py-2 font-semibold">PRIMARY ISSUE</th>
                  <th className="py-2 font-semibold">SPEED</th>
                  <th className="py-2 font-semibold">INCIDENTS</th>
                  <th className="py-2 font-semibold">TREND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: 1, name: 'Tumkur Road', score: 82, level: 'HIGH', levelColor: 'bg-rose-50 text-rose-700', issue: 'Pavement damage', speed: '28 km/h', inc: 4, trend: '↑', trendColor: 'text-rose-600' },
                  { id: 2, name: 'Silk Board Junction', score: 78, level: 'HIGH', levelColor: 'bg-rose-50 text-rose-700', issue: 'Congestion + road wear', speed: '22 km/h', inc: 5, trend: '↑', trendColor: 'text-rose-600' },
                  { id: 3, name: 'Outer Ring Road (Hebbal)', score: 64, level: 'MODERATE', levelColor: 'bg-amber-50 text-amber-700', issue: 'Surface degradation', speed: '34 km/h', inc: 3, trend: '→', trendColor: 'text-slate-400' },
                  { id: 4, name: 'Whitefield Main Road', score: 63, level: 'MODERATE', levelColor: 'bg-amber-50 text-amber-700', issue: 'Construction activity', speed: '26 km/h', inc: 2, trend: '↑', trendColor: 'text-rose-600' },
                  { id: 5, name: 'Hosur Road', score: 61, level: 'MODERATE', levelColor: 'bg-amber-50 text-amber-700', issue: 'Heavy vehicle load', speed: '32 km/h', inc: 2, trend: '→', trendColor: 'text-slate-400' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 text-slate-400 font-mono text-[11px]">{row.id}</td>
                    <td className="py-2.5 font-semibold text-slate-800 text-xs">{row.name}</td>
                    <td className="py-2.5 font-mono font-bold text-rose-600 text-xs">{row.score}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.levelColor}`}>
                        {row.level}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600 text-xs">{row.issue}</td>
                    <td className="py-2.5 font-mono text-slate-600 text-xs">{row.speed}</td>
                    <td className="py-2.5 font-mono text-slate-700 text-xs">{row.inc}</td>
                    <td className={`py-2.5 font-bold text-xs ${row.trendColor}`}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Key Risk Factors (Bengaluru) (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">Key Risk Factors (Bengaluru)</h4>
          </div>

          <div className="space-y-3.5 py-3">
            {/* Factor 1: Pavement Condition */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Pavement Condition</span>
                <span className="font-bold text-rose-600">38%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            {/* Factor 2: Traffic Speed Deficit */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Traffic Speed Deficit</span>
                <span className="font-bold text-amber-600">26%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>

            {/* Factor 3: Construction Activity */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Construction Activity</span>
                <span className="font-bold text-purple-600">18%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            {/* Factor 4: Weather Impact */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Weather Impact</span>
                <span className="font-bold text-cyan-600">12%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            {/* Factor 5: Accident History */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Accident History</span>
                <span className="font-bold text-teal-600">6%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
