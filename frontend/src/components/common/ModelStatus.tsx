import React from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle, HelpCircle } from 'lucide-react';

export type ModelStatusType = 'Available' | 'Unavailable' | 'Loading' | 'Error' | 'Unknown' | 'OPERATIONAL' | 'STABLE' | 'DEGRADED';

interface ModelStatusProps {
  status: ModelStatusType | string;
  className?: string;
  showIcon?: boolean;
}

export const ModelStatus: React.FC<ModelStatusProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  const norm = (status || 'Unknown').toString();

  const getDetails = () => {
    switch (norm.toUpperCase()) {
      case 'AVAILABLE':
      case 'OPERATIONAL':
      case 'STABLE':
      case 'TRAINED':
      case 'READY':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          label: norm,
          Icon: CheckCircle2,
          iconColor: 'text-emerald-600',
        };
      case 'LOADING':
      case 'TRAINING':
      case 'INITIALIZING':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          label: norm,
          Icon: Loader2,
          iconColor: 'text-blue-600 animate-spin',
        };
      case 'UNAVAILABLE':
      case 'NO_MODEL_TRAINED':
      case 'OFFLINE':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          label: 'Unavailable',
          Icon: AlertCircle,
          iconColor: 'text-amber-600',
        };
      case 'ERROR':
      case 'FAILED':
      case 'DEGRADED':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          label: 'Error',
          Icon: XCircle,
          iconColor: 'text-rose-600',
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          border: 'border-slate-200',
          label: 'Unknown',
          Icon: HelpCircle,
          iconColor: 'text-slate-400',
        };
    }
  };

  const { bg, text, border, label, Icon, iconColor } = getDetails();

  return (
    <span
      className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ' + bg + ' ' + text + ' ' + border + ' ' + className}
    >
      {showIcon && <Icon className={'w-3 h-3 ' + iconColor} />}
      <span>{label}</span>
    </span>
  );
};
