import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  MapPin,
  Sun,
  Bell,
  CheckSquare,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenDemo?: () => void;
  isEmergencyActive?: boolean;
  onOpenEmergency?: () => void;
  isConnected?: boolean;
  secondsSince?: number;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDemo,
  isEmergencyActive = false,
  onOpenEmergency,
  isConnected = true,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('10:44:41');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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

  return (
    <header className="h-16 px-4 lg:px-8 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between shadow-xs select-none">
      {/* Left: Mobile menu toggle + Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search Input matching screenshot */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search locations, corridors, incidents..."
            className="w-full pl-9 pr-12 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Right: Live Data, Clock, Region, Icons, User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Data Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700">Live Data</span>
        </div>

        {/* Live IST Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-mono font-semibold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime}</span>
          <span className="text-[10px] text-slate-400">IST</span>
        </div>

        {/* Dedicated City Badge - Bengaluru Specific (No Toggle) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs select-none">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bengaluru</span>
        </div>

        {/* Theme Toggle Button (Sun icon) */}
        <button
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Light Theme"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* Notifications Bell with count 3 */}
        <button
          onClick={onOpenDemo}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="3 Active System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            3
          </span>
        </button>

        {/* Tasks/Tasks Icon with badge 1 */}
        <button
          onClick={() => navigate('/incidents')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="1 Active Incident Task"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            1
          </span>
        </button>

        {/* User Profile & Sign Out Menu */}
        <div className="relative pl-2 sm:pl-3 border-l border-slate-200">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 hover:opacity-85 transition cursor-pointer text-left focus:outline-none"
            title="User Account & Sign Out"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {profile?.initials || 'AS'}
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {profile?.fullName || 'Abhishek'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {profile?.role || 'Municipal Officer'}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-fadeIn text-xs">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">{profile?.fullName || 'Operator'}</div>
                <div className="text-[11px] text-slate-500 truncate font-mono">{profile?.email || 'officer@bbmp.gov.in'}</div>
                <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1.5 border border-emerald-200">
                  {profile?.department || 'Bengaluru Operations'}
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
