import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  ShieldAlert,
  Map as MapIcon,
  Truck,
  AlertTriangle,
  BarChart3,
  Database,
  Cpu,
  Settings,
  SlidersHorizontal,
  Building2,
  Activity,
  Siren,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isEmergencyActive?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isEmergencyActive = false,
  isOpen = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const overviewNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const operationsNav = [
    { name: 'Traffic Intelligence', path: '/traffic', icon: BrainCircuit },
    { name: 'Road Risk', path: '/risk', icon: ShieldAlert },
    { name: 'City Map', path: '/map', icon: MapIcon },
    { name: 'Logistics', path: '/logistics', icon: Truck },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const intelligenceNav = [
    { name: 'Data Sources', path: '/data-sources', icon: Database },
    { name: 'Model Center', path: '/model-center', icon: Cpu },
  ];

  const planningNav = [
    { name: 'What-if Simulation', path: '/simulator', icon: SlidersHorizontal },
    { name: 'Infrastructure Recs', path: '/recommendations', icon: Building2 },
  ];

  const systemNav = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderNavGroup = (items: typeof operationsNav, title?: string) => (
    <div className="space-y-1">
      {title && (
        <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#0b3b3c] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-3">
          {/* Brand Logo Header matching screenshot */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 px-2 py-1 cursor-pointer group mb-2"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0b132b] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0b3b3c] transition-colors">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
                CITY<span className="text-emerald-600">FLOW</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-none">
                AI for Smarter Cities
              </div>
            </div>
          </div>

          {/* Nav Groups matching screenshot */}
          <nav className="space-y-2">
            {renderNavGroup(overviewNav, 'OVERVIEW')}
            {renderNavGroup(operationsNav, 'OPERATIONS')}
            {renderNavGroup(intelligenceNav, 'INTELLIGENCE')}
            {renderNavGroup(planningNav, 'PLANNING')}
            {renderNavGroup(systemNav, 'SYSTEM')}
          </nav>
        </div>

        {/* Bottom promo & Emergency cards */}
        <div className="space-y-2.5 pt-4 mt-2 border-t border-slate-100">
          {/* Mint Gradient Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100/80 p-3 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-800 leading-tight">
              Cleaner Roads<br />
              Safer Cities<br />
              <span className="text-emerald-700">Brighter Tomorrows</span>
            </div>
            {/* City Silhouette SVG */}
            <div className="mt-2 flex items-end justify-between opacity-70 h-7">
              <svg viewBox="0 0 160 35" fill="none" className="w-full h-7 text-emerald-400">
                <rect x="5" y="15" width="12" height="20" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="22" y="5" width="14" height="30" fill="currentColor" opacity="0.5" rx="1" />
                <rect x="40" y="10" width="10" height="25" fill="currentColor" opacity="0.4" rx="1" />
                <rect x="54" y="2" width="18" height="33" fill="currentColor" opacity="0.6" rx="1" />
                <rect x="76" y="12" width="12" height="23" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="92" y="8" width="16" height="27" fill="currentColor" opacity="0.5" rx="1" />
                <rect x="112" y="18" width="12" height="17" fill="currentColor" opacity="0.3" rx="1" />
                <rect x="128" y="6" width="15" height="29" fill="currentColor" opacity="0.6" rx="1" />
                <rect x="147" y="14" width="10" height="21" fill="currentColor" opacity="0.4" rx="1" />
              </svg>
            </div>
          </div>

          {/* Crimson Emergency Priority Pill */}
          <button
            onClick={() => navigate('/emergency')}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#7f1d1d] hover:bg-[#991b1b] text-white shadow-xs transition-all duration-150 group text-left"
          >
            <div className="w-7 h-7 rounded-xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Siren className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold truncate text-rose-100">
                Emergency Priority
              </div>
              <div className="text-[9px] text-rose-300 truncate">
                Quick Response Access
              </div>
            </div>
          </button>

          {/* User Account & Sign Out Pill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                {profile?.initials || 'AS'}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">
                  {profile?.fullName || 'Abhishek'}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {profile?.role || 'Municipal Officer'}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
