import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Activity,
  Compass,
  Layers,
  Cpu,
  Radio,
  Zap,
  Bus,
  ShieldCheck,
  Sliders,
  ExternalLink,
  MapPin,
  TrendingDown,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onOpenDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenDemo }) => {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* ---------------------------------------------------- */}
      {/* Main Header                                          */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#fbfaf7]/90 backdrop-blur-md border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="grid grid-cols-2 gap-1 w-6 h-6 p-0.5 rounded-md bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="w-2 h-2 rounded-[2px] bg-emerald-500"></span>
              <span className="w-2 h-2 rounded-[2px] bg-indigo-600"></span>
              <span className="w-2 h-2 rounded-[2px] bg-amber-500"></span>
              <span className="w-2 h-2 rounded-[2px] bg-sky-500"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0b132b] leading-none">
                  CityFlow
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  v2.4
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 mt-1">
                Bengaluru Mesh OS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#views" className="hover:text-[#0b132b] transition-colors">Five Views</a>
            <a href="#reality" className="hover:text-[#0b132b] transition-colors">Physical Ground-Truth</a>
            <a href="#metrics" className="hover:text-[#0b132b] transition-colors">Corridor Metrics</a>
            <button 
              onClick={() => navigate('/map')} 
              className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>Live GIS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          </nav>

          {/* Action CTAs: Sign In and Sign Up */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/signin')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition px-2.5 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b132b] text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm hover:shadow active:scale-95"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------------------------------------------- */}
        {/* Hero Section                                         */}
        {/* ---------------------------------------------------- */}
        <section className="relative pt-12 pb-20 border-b border-slate-200 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="max-w-7xl mx-auto px-6">
            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-xs mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                NOW LIVE: BENGALURU METRO MESH v2.4
              </span>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-600 font-medium">
                14,200+ edge nodes syncing
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 pr-0 lg:pr-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#0b132b] tracking-tight leading-[1.06] mb-6">
                  Start with the <br />
                  <span className="font-serif italic font-normal text-emerald-600">city</span>, not the <br />
                  dashboard.
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-xl font-normal leading-relaxed mb-8">
                  CityFlow brings Bengaluru's road, fleet, movement, routing, predictions, and operational signals into one connected platform.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <button
                    onClick={handleLaunchApp}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0b132b] text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm hover:shadow-md active:scale-95"
                  >
                    <span>Explore live mesh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {onOpenDemo ? (
                    <button
                      onClick={onOpenDemo}
                      className="px-6 py-3.5 rounded-full bg-white text-slate-800 border border-slate-300 text-sm font-semibold hover:bg-slate-50 transition shadow-xs active:scale-95 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Simulate Incident</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/routes')}
                      className="px-6 py-3.5 rounded-full bg-white text-slate-800 border border-slate-300 text-sm font-semibold hover:bg-slate-50 transition shadow-xs active:scale-95"
                    >
                      Inspect Corridors
                    </button>
                  )}
                </div>

                {/* Geographic Meta Tag */}
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>Bengaluru, Karnataka (Asia/Kolkata)</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-400">12.9716° N, 77.5946° E</span>
                </div>
              </div>

              {/* Right Column: Hero Network Diagram Visual */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]">
                {/* Concentric Radar Rings */}
                <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-300/60 animate-pulse"></div>
                <div className="absolute w-[340px] h-[340px] rounded-full border border-slate-300/50"></div>
                <div className="absolute w-[240px] h-[240px] rounded-full border border-slate-300/40"></div>

                {/* SVG Intersecting Colored Laser Transit Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 440 440" fill="none">
                  {/* Blue Transit Line */}
                  <line x1="20" y1="120" x2="420" y2="70" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Red Congestion Vector */}
                  <line x1="30" y1="360" x2="420" y2="170" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Yellow Bus Corridor */}
                  <line x1="40" y1="210" x2="410" y2="230" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Green Dashed Metro Mesh */}
                  <line x1="60" y1="80" x2="380" y2="380" stroke="#10b981" strokeWidth="1.8" strokeDasharray="5 5" />
                </svg>

                {/* Central Hub Pill */}
                <div 
                  onClick={handleLaunchApp}
                  className="relative z-20 w-36 h-36 rounded-full bg-[#0b132b] text-white flex flex-col items-center justify-center shadow-2xl border-4 border-white cursor-pointer hover:scale-105 transition-transform group"
                >
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5 group-hover:text-emerald-400 transition-colors">
                    Bengaluru OS
                  </span>
                  <span className="text-base font-extrabold tracking-tight uppercase text-center leading-tight">
                    CITY<br />FLOW
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Floating Connected Nodes */}
                <div 
                  onClick={() => navigate('/traffic')}
                  className="absolute top-10 left-6 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:border-blue-400 hover:shadow transition"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-semibold text-slate-700">Traffic API</span>
                </div>

                <div 
                  onClick={() => navigate('/routes')}
                  className="absolute top-8 right-4 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:border-emerald-400 hover:shadow transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-700">Flyover mesh</span>
                </div>

                <div 
                  onClick={() => navigate('/simulator')}
                  className="absolute bottom-12 left-8 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:border-amber-400 hover:shadow transition"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-semibold text-slate-700">Signal sync</span>
                </div>

                <div 
                  onClick={() => navigate('/logistics')}
                  className="absolute bottom-16 right-6 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:border-indigo-400 hover:shadow transition"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-xs font-semibold text-slate-700">Fleet live</span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Real-time Metric Ticker Bar                          */}
            {/* ---------------------------------------------------- */}
            <div id="metrics" className="mt-16 bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-y-3 sm:gap-y-0">
                {/* Metric 1 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Road Network</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">1,420 km</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Connected</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Metro Lines</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">4 Active</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Real-time sync</div>
                </div>

                {/* Metric 3 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Signal Cycles</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">184 nodes</div>
                  <div className="text-[10px] text-indigo-600 font-medium mt-0.5">Adaptive cycle</div>
                </div>

                {/* Metric 4 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Flyover Nodes</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">28 arterial</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-0.5">Mesh routed</div>
                </div>

                {/* Metric 5 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Airport Corridor</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">KIA-9 Stream</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Optimized 42m</div>
                </div>

                {/* Metric 6 */}
                <div className="px-4 py-1">
                  <div className="text-xs text-slate-400 font-medium">Fleet Ingestion</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">14,200+</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Buses & taxis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Five Views. One Connected Network Section            */}
        {/* ---------------------------------------------------- */}
        <section id="views" className="py-24 max-w-7xl mx-auto px-6">
          {/* Editorial Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline mb-16">
            <div className="md:col-span-6">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-3">
                INTEGRATED URBAN ARCHITECTURE
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0b132b] tracking-tight leading-[1.05]">
                Five views.<br />
                One connected<br />
                network.
              </h2>
            </div>
            <div className="md:col-span-6 md:pl-8">
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                CityFlow breaks down siloed agency operations into a unified spatial reality, enabling cross-agency mobility coordination across Bengaluru's dynamic growth corridors.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={handleLaunchApp}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-emerald-600 transition"
                >
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stacked 5 Visual Cards */}
          <div className="space-y-8">
            {/* View 01: Soft Ice Blue */}
            <article className="bg-[#EBF3FA] rounded-3xl p-8 sm:p-12 border border-[#d9e6f2] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">01 // LIVE FLOW</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] mt-3 mb-4 tracking-tight">
                    See Bengaluru move.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    Explore city network operations, peak arterial flows, and live propagation vectors in real time across Central Silk Board, Hebbal, and ORR.
                  </p>
                  <button
                    onClick={() => navigate('/traffic')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-blue-700 transition"
                  >
                    <span>Open view</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white/85 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white min-h-[260px] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>LAYER // 01 ARTERIAL MOTION</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      LIVE STREAM
                    </span>
                  </div>
                  <div className="my-auto relative h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="120" x2="380" y2="35" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      <line x1="40" y1="30" x2="360" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="80" x2="370" y2="85" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="200" cy="80" r="14" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <path d="M194 80 L197 76 L200 84 L203 76 L206 80" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>CORRIDOR: ORR-SILKBOARD-HEBBAL</span>
                    <span>REF: BLR-VEC-LIVE-401</span>
                  </div>
                </div>
              </div>
            </article>

            {/* View 02: Soft Peach / Warm Blush */}
            <article className="bg-[#FDF0EC] rounded-3xl p-8 sm:p-12 border border-[#f5dfd8] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">02 // MULTI-MODAL ROUTING</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] mt-3 mb-4 tracking-tight">
                    Plan around the city.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    Evaluate infrastructure interventions, major flyover diversions, and transit bottlenecks with algorithmic OR-Tools dispatching.
                  </p>
                  <button
                    onClick={() => navigate('/routes')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-rose-700 transition"
                  >
                    <span>Open view</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white/85 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white min-h-[260px] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>LAYER // 02 CIVIC PLANNING</span>
                    <span className="text-amber-600 font-bold">● PLANNING SIM</span>
                  </div>
                  <div className="my-auto relative h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="120" x2="380" y2="35" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      <line x1="40" y1="30" x2="360" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="80" x2="370" y2="85" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <rect x="187" y="67" width="26" height="26" rx="4" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
                      <path d="M192 73 H208 M192 80 H208 M192 87 H208" stroke="#ef4444" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>CIVIC DIVERSION MESH</span>
                    <span>REF: BLR-PLAN-SIM-092</span>
                  </div>
                </div>
              </div>
            </article>

            {/* View 03: Soft Sage Mint */}
            <article className="bg-[#EEF7EE] rounded-3xl p-8 sm:p-12 border border-[#d9ebd9] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">03 // PREDICTIVE HORIZONS</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] mt-3 mb-4 tracking-tight">
                    Look ahead, not just now.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    Predictive machine learning models anticipate congestion spikes and bottleneck shockwaves up to 90 minutes in advance.
                  </p>
                  <button
                    onClick={() => navigate('/predictions')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-emerald-700 transition"
                  >
                    <span>Open view</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white/85 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white min-h-[260px] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>LAYER // 03 PREDICTIVE MODELS</span>
                    <span className="text-emerald-600 font-bold">+90 MIN WINDOW</span>
                  </div>
                  <div className="my-auto relative h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="120" x2="380" y2="35" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      <line x1="40" y1="30" x2="360" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="80" x2="370" y2="85" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="200" cy="80" r="16" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                      <rect x="193" y="80" width="3" height="7" fill="#10b981" />
                      <rect x="198" y="74" width="3" height="13" fill="#10b981" />
                      <rect x="203" y="77" width="3" height="10" fill="#10b981" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>CHRONOS-2 & XGBOOST INFERENCE</span>
                    <span>REF: BLR-PRED-ML-783</span>
                  </div>
                </div>
              </div>
            </article>

            {/* View 04: Soft Lavender */}
            <article className="bg-[#F3EFFC] rounded-3xl p-8 sm:p-12 border border-[#e4dcf7] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">04 // SIMULATION LAB</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] mt-3 mb-4 tracking-tight">
                    Test the what-if.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    Simulate signal cycle modifications, monsoon flooding diversions, and VIP corridor movements before deploying into physical streets.
                  </p>
                  <button
                    onClick={() => navigate('/simulator')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-indigo-700 transition"
                  >
                    <span>Open view</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white/85 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white min-h-[260px] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>LAYER // 04 DIGITAL TWIN SCENARIOS</span>
                    <span className="text-indigo-600 font-bold">READY</span>
                  </div>
                  <div className="my-auto relative h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="120" x2="380" y2="35" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      <line x1="40" y1="30" x2="360" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="80" x2="370" y2="85" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="200" cy="80" r="15" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                      <path d="M195 77 A 6 6 0 1 1 205 83" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                      <polyline points="202,84 206,84 206,80" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>COUNTERFACTUAL BRANCHES</span>
                    <span>REF: BLR-TWIN-SCEN-119</span>
                  </div>
                </div>
              </div>
            </article>

            {/* View 05: Soft Cream / Butter Yellow */}
            <article className="bg-[#FDF7E7] rounded-3xl p-8 sm:p-12 border border-[#f5ebcf] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">05 // ANOMALY RADAR</span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0b132b] mt-3 mb-4 tracking-tight">
                    Make disruptions visible.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    Real-time corridor shockwave alerts, automated incident detection, and priority green-wave preemption for ambulances.
                  </p>
                  <button
                    onClick={() => navigate('/incidents')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0b132b] hover:text-amber-700 transition"
                  >
                    <span>Open view</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white/85 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white min-h-[260px] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>LAYER // 05 ANOMALY RADAR</span>
                    <span className="text-rose-600 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      ACTIVE SCAN
                    </span>
                  </div>
                  <div className="my-auto relative h-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                      <line x1="20" y1="120" x2="380" y2="35" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      <line x1="40" y1="30" x2="360" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="80" x2="370" y2="85" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="200,66 213,73 213,88 200,95 187,88 187,73" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                      <line x1="200" y1="74" x2="200" y2="83" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="200" cy="87" r="1" fill="#f59e0b" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>AUTO HAZARD MITIGATION</span>
                    <span>REF: BLR-DISRUPT-RAD-044</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Dark Contrast Section: Real-World Operations         */}
        {/* ---------------------------------------------------- */}
        <section id="reality" className="bg-[#0b132b] text-white py-24 border-t border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Copy Left */}
              <div className="lg:col-span-6">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-4">
                  BUILT FOR REAL-WORLD OPERATIONS
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  Not another generic <br />
                  AI dashboard.
                </h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-light">
                  Built directly for urban operators. Never forced into generic BI charts, static reports, or legacy spreadsheets. CityFlow operates at the exact frequency of Bengaluru's physical reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleLaunchApp}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <span>Open the Bengaluru live feed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* UI Floating Live Feed Card Preview */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/20">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        REALTIME CONTROL MESH
                      </h4>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        Bengaluru Central Operations
                      </p>
                    </div>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>

                  {/* Telemetry List Items */}
                  <div className="space-y-3">
                    {/* Item 1 */}
                    <div 
                      onClick={() => navigate('/traffic')}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Arterial Flow Rate</div>
                          <div className="text-[11px] text-slate-400">Outer Ring Road & Hebbal</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                        Normal (34 km/h)
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div 
                      onClick={() => navigate('/logistics')}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Buses & Fleets</div>
                          <div className="text-[11px] text-slate-400">BMTC Active Transit</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-md">
                        6,412 live
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div 
                      onClick={() => navigate('/incidents')}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Grid Alerts</div>
                          <div className="text-[11px] text-slate-400">Silk Board Flyover</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                        0 Critical
                      </span>
                    </div>

                    {/* Item 4 */}
                    <div 
                      onClick={() => navigate('/simulator')}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Signal Controllers</div>
                          <div className="text-[11px] text-slate-400">Adaptive Green Waves</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-md">
                        184 Syncing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Vibrant Yellow Banner Section                        */}
        {/* ---------------------------------------------------- */}
        <section className="bg-[#f5c344] relative py-20 overflow-hidden">
          {/* Background Transit Vector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
            <line x1="0" y1="280" x2="1200" y2="40" stroke="#0b132b" strokeWidth="1.5" />
            <line x1="0" y1="40" x2="1200" y2="260" stroke="#059669" strokeWidth="2" />
            <line x1="200" y1="0" x2="900" y2="300" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0b132b]/70 block mb-2">
                  BENGALURU INTELLIGENCE
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0b132b] tracking-tight leading-[1.08]">
                  Read the city.<br />
                  <span className="font-serif italic font-normal text-[#0b132b]">Then move through it.</span>
                </h2>
              </div>
              <div>
                <button
                  onClick={handleLaunchApp}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0b132b] text-white text-sm font-semibold hover:bg-slate-800 transition shadow-lg hover:shadow-xl active:scale-95"
                >
                  <span>Start exploring</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------- */}
      {/* Main Footer                                          */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#0b132b] text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-800">
            {/* Brand Info */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-indigo-500"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-amber-400"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-sky-400"></span>
                </div>
                <span className="text-lg font-bold tracking-tight text-white">CityFlow</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Urban movement and spatial telemetry platform for metropolitan Bengaluru. Designed for real-time operators, civic agencies, and logistics fleets.
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Mesh Engine</h5>
                <ul className="space-y-2 text-xs">
                  <li><button onClick={() => navigate('/routes')} className="hover:text-white transition">Outer Ring Road Hub</button></li>
                  <li><button onClick={() => navigate('/routes')} className="hover:text-white transition">Silk Board Intersection</button></li>
                  <li><button onClick={() => navigate('/routes')} className="hover:text-white transition">KIA Airport Expressway</button></li>
                  <li><button onClick={() => navigate('/routes')} className="hover:text-white transition">Electronic City Vector</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Intelligence</h5>
                <ul className="space-y-2 text-xs">
                  <li><button onClick={() => navigate('/predictions')} className="hover:text-white transition">90-min Forecasts</button></li>
                  <li><button onClick={() => navigate('/simulator')} className="hover:text-white transition">Adaptive Corridors</button></li>
                  <li><button onClick={() => navigate('/incidents')} className="hover:text-white transition">Anomaly Detection</button></li>
                  <li><button onClick={() => navigate('/simulator')} className="hover:text-white transition">Incident Simulation</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">System</h5>
                <ul className="space-y-2 text-xs">
                  <li><button onClick={() => navigate('/data-sources')} className="hover:text-white transition">Agency Ingestion</button></li>
                  <li><button onClick={() => navigate('/data-quality')} className="hover:text-white transition">Data Provenance</button></li>
                  <li><button onClick={() => navigate('/model-center')} className="hover:text-white transition">Chronos-2 Models</button></li>
                  <li className="flex items-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-400 font-medium">Mesh Operational</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Credits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© 2026 CityFlow Technologies Inc. Bengaluru Mesh v2.4.</div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer transition">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition">Operational Standards</span>
              <span className="hover:text-slate-400 cursor-pointer transition">Security Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
