import React from 'react';
import { NavLink } from 'react-router-dom';
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
} from 'lucide-react';

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
  const primaryNavItems = [
    { name: '1. Overview', path: '/', icon: LayoutDashboard },
    { name: '2. Traffic Intelligence', path: '/traffic', icon: BrainCircuit, badge: 'Chronos-2' },
    { name: '3. Road Risk', path: '/risk', icon: ShieldAlert, badge: 'XGBoost' },
    { name: '4. City Map', path: '/map', icon: MapIcon },
    { name: '5. Logistics', path: '/logistics', icon: Truck },
    { name: '6. Incidents', path: '/incidents', icon: AlertTriangle },
    { name: '7. Analytics', path: '/analytics', icon: BarChart3 },
    { name: '8. Data Sources', path: '/data-sources', icon: Database },
    { name: '9. Model Center', path: '/model-center', icon: Cpu },
    { name: '10. Settings', path: '/settings', icon: Settings },
  ];

  const secondaryModules = [
    { name: 'What-If Simulation', path: '/simulator', icon: SlidersHorizontal, badge: 'SIM' },
    { name: 'Infrastructure Recs', path: '/recommendations', icon: Building2 },
    {
      name: 'Emergency Priority',
      path: '/emergency',
      icon: ShieldAlert,
      alert: isEmergencyActive,
      badge: isEmergencyActive ? 'ACTIVE' : undefined,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={'fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between select-none overflow-y-auto transition-transform duration-200 ease-in-out ' + (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}
      >
        <div className="p-3.5 space-y-5">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Primary Modules</span>
              <span className="text-[9px] text-slate-400 font-normal">10 Modules</span>
            </div>

            <nav className="space-y-0.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ' + (
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon
                            className={'w-4 h-4 flex-shrink-0 ' + (isActive ? 'text-emerald-400' : 'text-slate-400')}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={'text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded ' + (
                              isActive
                                ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Advanced Operations
            </div>

            <nav className="space-y-0.5">
              {secondaryModules.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ' + (
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : item.alert
                          ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon
                            className={'w-4 h-4 flex-shrink-0 ' + (
                              isActive
                                ? 'text-emerald-400'
                                : item.alert
                                ? 'text-rose-600 animate-pulse'
                                : 'text-slate-400'
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ' + (
                              item.alert
                                ? 'bg-rose-600 text-white'
                                : isActive
                                ? 'bg-slate-800 text-emerald-300'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              CITYFLOW INTELLIGENCE
            </span>
            <span className="text-[10px] text-slate-500 font-mono">v2.4</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Predicts traffic with <span className="font-semibold text-slate-700">Chronos-2</span> & road-risk with <span className="font-semibold text-slate-700">XGBoost</span>.
          </p>
        </div>
      </aside>
    </>
  );
};
