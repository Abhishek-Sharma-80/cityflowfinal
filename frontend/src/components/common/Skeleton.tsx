import React from 'react';

const shimmer = 'animate-pulse bg-slate-200/80 rounded';

export const SkeletonBox: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`${shimmer} ${className}`} style={style} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`surface-card p-5 rounded-2xl ${className}`}>
    <SkeletonBox className="h-3 w-24 mb-3" />
    <SkeletonBox className="h-8 w-16 mb-2" />
    <SkeletonBox className="h-2 w-32" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <SkeletonBox className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-3 w-3/4" />
          <SkeletonBox className="h-2 w-1/2" />
        </div>
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`surface-card rounded-2xl p-5 ${className}`}>
    <SkeletonBox className="h-4 w-40 mb-6" />
    <div className="flex items-end space-x-2 h-36">
      {[40,65,50,80,55,90,70,45,75,60,85,50].map((h, i) => (
        <SkeletonBox key={i} style={{ height: `${h}%` }} className="flex-1" />
      ))}
    </div>
  </div>
);

export const SkeletonPage: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="p-6 space-y-6 animate-fadeIn">
    <div className="space-y-2">
      <SkeletonBox className="h-6 w-48" />
      <SkeletonBox className="h-3 w-72" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonChart key={i} />
    ))}
  </div>
);

