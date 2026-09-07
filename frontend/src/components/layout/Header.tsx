import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Sparkles, Clock, Menu, X, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenDemo: () => void;
  isEmergencyActive: boolean;
  onOpenEmergency: () => void;
  isConnected?: boolean;
  secondsSince?: number;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemo,
  isEmergencyActive,
  onOpenEmergency,
  isConnected = true,
  secondsSince = 0,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/traffic':
      case '/predictions':
        return 'Traffic Intelligence';
      case '/risk':
        return 'Road Risk Intelligence';
      case '/map':
        return 'Metropolitan GIS Map';
      case '/logistics':
      case '/fleet':
      case '/slots':
      case '/loading-zones':
      case '/routes':
        return 'Logistics Command Hub';
      case '/incidents':
        return 'Incident Operations';
      case '/analytics':
        return 'Mobility & Impact Analytics';
      case '/data-sources':
      case '/data-quality':
        return 'Data & Provenance Center';
      case '/model-center':
      case '/ml-models':
        return 'AI Model Center';
      case '/simulator':
        return 'Scenario Simulation Sandbox';
      case '/recommendations':
        return 'Infrastructure Proposals';
      case '/emergency':
        return 'Emergency Green Wave Priority';
      case '/settings':
        return 'System Configuration';
      default:
        return 'CityFlow Control Center';
    }
  };

  const lastUpdatedText = secondsSince < 5
    ? 'Live sync'
    : secondsSince < 60
    ? 'Updated ' + secondsSince + 's ago'
    : 'Updated ' + Math.floor(secondsSince / 60) + 'm ago';

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-slate-200/90 sticky top-0 z-50 flex items-center justify-between shadow-xs select-none">
      {/* Brand & Module Title */}
      <div className="flex items-center space-x-3 lg:space-x-6">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-all duration-200">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                CITY<span className="text-emerald-600">FLOW</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                DELHI NCR
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              AI-Powered Urban Traffic & Road Risk Intelligence
            </p>
          </div>
        </Link>

        {/* Current Active Page Breadcrumb */}
        <div className="hidden xl:flex items-center space-x-2 pl-6 border-l border-slate-200 text-xs">
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800 font-mono">{getPageTitle(location.pathname)}</span>
        </div>
      </div>

      {/* Right Actions & Health Status */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Honest System Connection Status */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono">
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-emerald-700 font-medium hidden sm:inline">Connected</span>
              <span className="text-slate-400 text-[10px] hidden md:inline">• {lastUpdatedText}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-700 font-medium">Offline Mode</span>
            </>
          )}
        </div>

        {/* Live Clock (IST) */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{currentTime || '--:--:--'}</span>
          <span className="text-slate-400 text-[10px]">IST</span>
        </div>

        {/* Emergency Corridor Quick Trigger */}
        <button
          onClick={onOpenEmergency}
          className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ' + (
            isEmergencyActive
              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          )}
          title="Emergency Priority Corridor Mode"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">{isEmergencyActive ? 'Corridor Active' : 'Green Wave'}</span>
        </button>

        {/* 1-Click Interactive SIH Demo Showcase */}
        <button
          onClick={onOpenDemo}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all duration-150 active:scale-95 border border-slate-800"
          title="Launch Guided Evaluation Demo"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Demo</span>
        </button>
      </div>
    </header>
  );
};
