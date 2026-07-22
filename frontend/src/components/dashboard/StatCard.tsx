import React from 'react';
import { GlassCard } from '../ui/GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  color?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  color = 'cyan'
}) => {
  const badgeStyles = {
    cyan: 'border-sky-200 text-sky-700 bg-sky-50',
    purple: 'border-indigo-200 text-indigo-700 bg-indigo-50',
    emerald: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    rose: 'border-rose-200 text-rose-700 bg-rose-50',
    amber: 'border-amber-200 text-amber-700 bg-amber-50',
  };

  return (
    <GlassCard className="p-5 border border-slate-200/90 shadow-2xs font-serif-luxury">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-serif-luxury">{title}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{value}</div>
          {change && (
            <div className={`text-[11px] font-medium font-mono ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isPositive ? '↑' : '↓'} {change} vs last session
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xs ${badgeStyles[color]}`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
};
