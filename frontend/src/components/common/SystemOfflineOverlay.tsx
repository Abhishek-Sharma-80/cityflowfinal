import React, { useState } from 'react';
import { AlertOctagon, RefreshCw, ServerCrash, WifiOff, Terminal } from 'lucide-react';

interface SystemOfflineOverlayProps {
  isVisible: boolean;
  errorMessage?: string;
  onRetry: () => Promise<void> | void;
}

export const SystemOfflineOverlay: React.FC<SystemOfflineOverlayProps> = ({
  isVisible,
  errorMessage = 'Unable to establish connection with the Digital-Twin Engine.',
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isVisible) return null;

  const handleRetryClick = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl transition-all duration-300 animate-fadeIn select-none">
      <div className="relative max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* Top Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full"></div>

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
          <ServerCrash className="w-8 h-8 animate-pulse" />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold tracking-widest uppercase">
            <WifiOff className="w-3 h-3" /> Link Failure
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase font-mono">
            COMMAND CENTER OFFLINE
          </h2>
          <p className="text-xs text-slate-500 font-mono leading-relaxed">
            {errorMessage}
          </p>
        </div>

        {/* Diagnostic Terminal Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-200">
            <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-slate-500" /> Telemetry Diagnostic</span>
            <span>PORT 8001</span>
          </div>
          <p className="text-rose-600 flex items-center gap-1.5 font-semibold">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0" /> Target: {import.meta.env.VITE_API_URL || 'http://localhost:8001'}
          </p>
          <p className="text-slate-500">Live digital-twin stream paused. Please verify backend service.</p>
        </div>

        {/* Reconnect Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRetryClick}
            disabled={isRetrying}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all duration-150 disabled:opacity-50 shadow-md active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Attempting Handshake...' : 'RE-ESTABLISH CONNECTION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
