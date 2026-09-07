import React from 'react';

export type ProvenanceType = 
  | 'REAL_API'
  | 'REAL_DATABASE'
  | 'REAL_DATASET'
  | 'CALCULATED'
  | 'ML_PREDICTION'
  | 'ESTIMATED'
  | 'SIMULATION'
  | 'HARDCODED'
  | 'UNKNOWN';

interface SourceBadgeProps {
  type: ProvenanceType | string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type,
  size = 'xs',
  className = '',
  showIcon = true,
}) => {
  const normType = (type || 'UNKNOWN').toUpperCase() as ProvenanceType;

  const styles: Record<ProvenanceType, { bg: string; text: string; border: string; label: string; dot: string }> = {
    REAL_API: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'REAL_API',
      dot: 'bg-emerald-500',
    },
    REAL_DATABASE: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'REAL_DATABASE',
      dot: 'bg-blue-500',
    },
    REAL_DATASET: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      label: 'REAL_DATASET',
      dot: 'bg-indigo-500',
    },
    CALCULATED: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      label: 'CALCULATED',
      dot: 'bg-slate-500',
    },
    ML_PREDICTION: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      label: 'ML_PREDICTION',
      dot: 'bg-violet-500',
    },
    ESTIMATED: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'ESTIMATED',
      dot: 'bg-amber-500',
    },
    SIMULATION: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      label: 'SIMULATION',
      dot: 'bg-purple-500',
    },
    HARDCODED: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      border: 'border-zinc-300',
      label: 'HARDCODED',
      dot: 'bg-zinc-400',
    },
    UNKNOWN: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'UNKNOWN',
      dot: 'bg-rose-400',
    },
  };

  const config = styles[normType] || styles.UNKNOWN;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 tracking-wider',
    sm: 'text-[10px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1 tracking-normal',
  };

  return (
    <span
      title={'Data Provenance: ' + config.label}
      className={'inline-flex items-center gap-1.5 font-mono font-bold rounded-md border ' + config.bg + ' ' + config.text + ' ' + config.border + ' ' + sizeClasses[size] + ' ' + className}
    >
      {showIcon && <span className={'w-1.5 h-1.5 rounded-full ' + config.dot} />}
      <span>{config.label}</span>
    </span>
  );
};
