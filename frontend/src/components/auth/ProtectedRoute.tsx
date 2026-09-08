import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070e1c] flex flex-col items-center justify-center text-white px-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <h2 className="text-base font-bold tracking-tight text-slate-100">
          CityFlow AI <span className="text-emerald-400 font-mono text-xs">Bengaluru</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Verifying security clearance and digital-twin credentials...
        </p>
      </div>
    );
  }

  if (!user && !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
