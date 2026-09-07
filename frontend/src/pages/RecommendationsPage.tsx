import React, { useState, useEffect } from 'react';
import { InfraRecommendationModel, InfraCategory } from '../types';
import { api } from '../services/api';
import { Building2, Zap, Warehouse, Navigation, Sparkles } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<InfraRecommendationModel[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [_loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRecs = recommendations.filter((r) => {
    return categoryFilter === 'ALL' || r.category === categoryFilter;
  });

  const getCategoryIcon = (cat: InfraCategory) => {
    switch (cat) {
      case 'NEW_LOADING_BAY':
        return <Warehouse className="w-5 h-5 text-amber-600" />;
      case 'EV_CHARGER':
        return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'DELIVERY_MICRO_HUB':
        return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'SMART_SIGNAL':
        return <Navigation className="w-5 h-5 text-emerald-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1750px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="surface-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Infrastructure & Capital Upgrade Recommendation Engine
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 font-medium">
                Capex / ROI Ranked
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              AI-generated capital investment proposals targeting spatial bottlenecks, freight bay deficits, and EV micro-hubs
            </p>
          </div>
        </div>

        {/* Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
        >
          <option value="ALL">All Categories</option>
          <option value="NEW_LOADING_BAY">Smart Loading Bays</option>
          <option value="EV_CHARGER">EV DC Fast Chargers</option>
          <option value="DELIVERY_MICRO_HUB">Urban Micro-Hubs</option>
          <option value="SMART_SIGNAL">Adaptive AI Signals</option>
        </select>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className="surface-card p-6 space-y-5 hover:border-emerald-300 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                    <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                      Target Sector: <span className="text-emerald-700 font-semibold">{rec.zone_name}</span>
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono px-2.5 py-1 rounded-full font-bold border uppercase tracking-wider ${
                    rec.priority === 'URGENT'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {rec.priority} PRIORITY
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

              {/* AI Analytical Rationale Box */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Analytical Rationale & Capacity Deficit
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">{rec.reasoning}</p>
              </div>
            </div>

            {/* Financial & Environmental ROI Grid */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono pt-4 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-semibold">Est Capex</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">₹{(rec.estimated_capex_inr / 100000).toFixed(1)}L</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[9px] text-emerald-700 uppercase block tracking-wider font-semibold">CO₂ Offset</span>
                <span className="font-bold text-emerald-700 text-xs mt-0.5 block">-{rec.annual_co2_saving_tons} T/yr</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-semibold">Delay Red.</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 block">-{rec.daily_delay_reduction_hours} hrs/d</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[9px] text-emerald-700 uppercase block tracking-wider font-semibold">ROI Score</span>
                <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{rec.roi_score} / 10</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

