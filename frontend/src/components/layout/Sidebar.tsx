import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  Truck,
  Navigation,
  CalendarClock,
  Warehouse,
  BrainCircuit,
  SlidersHorizontal,
  Building2,
  BarChart3,
  ShieldAlert,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isEmergencyActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isEmergencyActive }) => {
  const sections = [
    {
      title: 'City Command',
      items: [
        { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Metropolitan GIS Map', path: '/map', icon: MapIcon },
        { name: 'Fleet Telematics', path: '/fleet', icon: Truck },
      ],
    },
    {
      title: 'ML Platform & Data Brain',
      items: [
        { name: 'ML Intelligence', path: '/ml-models', icon: BrainCircuit },
        { name: 'Data Quality & Ingestion', path: '/data-quality', icon: Building2 },
      ],
    },
    {
      title: 'Optimization & AI',
      items: [
        { name: 'Smart Routing', path: '/routes', icon: Navigation },
        { name: 'Dynamic Delivery Slots', path: '/slots', icon: CalendarClock },
        { name: 'Smart Loading Bays', path: '/loading-zones', icon: Warehouse },
        { name: 'Predictive Congestion', path: '/predictions', icon: BrainCircuit },
        { name: 'What-If Simulation', path: '/simulator', icon: SlidersHorizontal },
      ],
    },
    {
      title: 'Decisions & Governance',
      items: [
        { name: 'Infrastructure Recs', path: '/recommendations', icon: Building2 },
        { name: 'ESG & Impact Analytics', path: '/analytics', icon: BarChart3 },
        {
          name: 'Emergency Green Wave',
          path: '/emergency',
          icon: ShieldAlert,
          alert: isEmergencyActive,
          badge: isEmergencyActive ? 'ACTIVE' : undefined,
        },
        { name: 'Settings & Weights', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between select-none h-[calc(100vh-4rem)] sticky top-16 z-40 overflow-y-auto shadow-xs">
      <div className="p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'border-l-4 border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                          : item.alert
                          ? 'border-l-4 border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-l-4 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          item.alert ? 'text-rose-500' : 'text-slate-400 group-hover:text-emerald-600'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Status Footer */}
      <div className="p-4 m-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-emerald-900 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            Digital Twin Active
          </span>
          <span className="text-emerald-700 font-mono text-[11px] font-bold">100Hz</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          OR-Tools + Random Forest ML online
        </p>
      </div>
    </aside>
  );
};
