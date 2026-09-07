import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import type { Toast, ToastType } from '../../hooks/useToast';

const config: Record<ToastType, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
  success:  { icon: CheckCircle2,  bg: 'bg-white', border: 'border-emerald-300', iconColor: 'text-emerald-600' },
  info:     { icon: Info,          bg: 'bg-white', border: 'border-slate-300',   iconColor: 'text-emerald-700' },
  warning:  { icon: AlertTriangle, bg: 'bg-white', border: 'border-amber-300',   iconColor: 'text-amber-600'   },
  critical: { icon: ShieldAlert,   bg: 'bg-white', border: 'border-rose-300',    iconColor: 'text-rose-600'    },
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const { icon: Icon, bg, border, iconColor } = config[toast.type];
  return (
    <div className={`flex items-start space-x-3 p-3.5 rounded-xl border shadow-xl ${bg} ${border} animate-slideInRight min-w-[280px] max-w-[360px]`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900">{toast.title}</p>
        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};


