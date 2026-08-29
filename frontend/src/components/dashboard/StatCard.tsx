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
    cyan: 'border-sky-400/30 text-sky-300 bg-sky-500/15 shadow-inner',
    purple: 'border-purple-400/30 text-purple-300 bg-purple-500/15 shadow-inner',
    emerald: 'border-emerald-400/30 text-emerald-300 bg-emerald-500/15 shadow-inner',
    rose: 'border-rose-400/30 text-rose-300 bg-rose-500/15 shadow-inner',
    amber: 'border-amber-400/30 text-amber-300 bg-amber-500/15 shadow-inner',
  };

  return (
    <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl font-sans">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{value}</div>
          {change && (
            <div className={`text-[11px] font-medium font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '↑' : '↓'} {change} vs last session
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md ${badgeStyles[color]}`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
};

