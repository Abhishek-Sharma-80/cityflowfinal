import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCountUp } from '../hooks/useCountUp';
import { SkeletonChart, SkeletonCard } from '../components/common/Skeleton';
import { BarChart3, Leaf, Clock, Fuel, DollarSign, Activity } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const COLORS = ['#10b981', '#059669', '#34d399', '#6ee7b7'];
const fleetBreakdown = [
  { name: 'Electric Cargo Vans', value: 168, color: COLORS[0] },
  { name: 'Cargo EV 2-Wheelers',  value: 95,  color: COLORS[1] },
  { name: 'CNG Freight Trucks',   value: 124, color: COLORS[2] },
  { name: 'Diesel LCVs',          value: 93,  color: COLORS[3] },
];

const cityRadar = [
  { axis: 'Speed Index',      score: 72 },
  { axis: 'Delivery Rate',    score: 94 },
  { axis: 'CO₂ Efficiency',   score: 85 },
  { axis: 'Loading Zones',    score: 78 },
  { axis: 'Emergency Resp.',  score: 96 },
  { axis: 'AI Accuracy',      score: 91 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-lg">
      <p className="text-slate-500 font-medium mb-1.5 font-mono">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export const AnalyticsPage: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrends().then(d => { setTrends(d); setLoading(false); });
  }, []);

  const co2Display  = useCountUp(trends ? 640 : 0, 1800, 0);
  const fuelDisplay = useCountUp(trends ? 238 : 0, 1800, 0);
  const savingDisplay = useCountUp(trends ? 48500 : 0, 2000, 0);

  const kpiCards = [
    { label: 'CO₂ Saved Today', value: co2Display, unit: 'kg offset', icon: Leaf, color: 'text-emerald-700', wash: 'kpi-wash-emerald' },
    { label: 'Fuel Conserved Today', value: fuelDisplay, unit: 'Litres', icon: Fuel, color: 'text-emerald-800', wash: 'kpi-wash-green' },
    { label: 'Economic Savings', value: `₹${savingDisplay}`, unit: 'Daily Net ROI', icon: DollarSign, color: 'text-amber-700', wash: 'kpi-wash-amber' },
    { label: 'Avg Travel Duration', value: '26.5', unit: 'minutes / leg', icon: Clock, color: 'text-slate-900', wash: '' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="surface-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">City-Scale Analytics & Environmental Impact</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time carbon accounting, fuel economics, propulsion mix & city efficiency radar</p>
          </div>
        </div>
      </div>

      {/* KPI Odometers */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map(({ label, value, unit, icon: Icon, color, wash }) => (
            <div key={label} className="surface-card p-6 relative overflow-hidden flex flex-col justify-between h-36">
              {wash && <div className={wash} />}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase font-mono">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <div className={`text-3xl lg:text-4xl font-bold font-mono tracking-tight ${color}`}>{value}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">{unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CO2 & Fuel Area Chart */}
        <div className="xl:col-span-2">
          {loading ? <SkeletonChart className="h-72" /> : (
            <div className="surface-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Cumulative CO₂ & Fuel Savings (24h)
                </h2>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">Telemetry Timeseries</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trends?.co2_savings_trend || []}>
                  <defs>
                    <linearGradient id="co2g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fuelg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="co2_saved_kg"  name="CO₂ Saved (kg)" stroke="#10b981" fill="url(#co2g)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="fuel_saved_l"  name="Fuel Saved (L)"  stroke="#059669" fill="url(#fuelg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Fleet Propulsion Donut */}
        <div className="surface-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Fleet Propulsion Mix</h2>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={fleetBreakdown} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                {fleetBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {fleetBreakdown.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 rounded-full h-2 flex-shrink-0" style={{ background: color }} />
                  <span className="text-slate-600 font-sans">{name}</span>
                </div>
                <span className="font-mono text-slate-800 font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* City Efficiency Radar */}
        <div className="surface-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">City Efficiency Score Radar</h2>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={cityRadar}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
              <Radar name="City Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic + Logistics Bar */}
        {loading ? <SkeletonChart /> : (
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Traffic Volume & Logistics Demand (24h)</h2>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">Real-Time Influx</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trends?.traffic_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '10px' }} />
                <Bar dataKey="traffic_volume" name="Traffic Volume" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="congestion_index" name="Congestion Index" fill="#059669" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};


