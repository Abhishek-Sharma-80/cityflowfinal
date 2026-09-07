import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenDemo: () => void;
  isEmergencyActive: boolean;
  onOpenEmergency: () => void;
  isConnected?: boolean;
  secondsSince?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemo, isEmergencyActive, onOpenEmergency, isConnected = true, secondsSince = 0
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const lastUpdatedText = secondsSince < 5
    ? 'Just now'
    : secondsSince < 60
    ? `${secondsSince}s ago`
    : `${Math.floor(secondsSince / 60)}m ago`;

  return (
    <header className="h-16 px-6 lg:px-8 bg-white border-b border-slate-200/80 sticky top-0 z-50 flex items-center justify-between shadow-xs">
      {/* Brand & Digital Twin Logo */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-3.5 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                CityFlow <span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">Urban Digital-Twin & Logistics Command Center</p>
          </div>
        </Link>

        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center space-x-2.5 pl-6 border-l border-slate-200 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-emerald-700 font-semibold">Digital Twin Live (100Hz)</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{isConnected ? lastUpdatedText : 'Simulating'}</span>
        </div>
      </div>

      {/* Right Actions & Clock */}
      <div className="flex items-center space-x-3">
        {/* Clock */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{currentTime}</span>
          <span className="text-slate-400 text-[10px]">IST</span>
        </div>

        {/* Emergency Corridor Quick Trigger */}
        <button
          onClick={onOpenEmergency}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            isEmergencyActive
              ? 'bg-rose-600 text-white pulse-emergency shadow-md shadow-rose-500/20'
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>{isEmergencyActive ? 'Corridor Active' : 'Emergency Mode'}</span>
        </button>

        {/* 1-Click DEMO Showcase Button */}
        <button
          onClick={onOpenDemo}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-150 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Interactive Demo</span>
        </button>
      </div>
    </header>
  );
};
