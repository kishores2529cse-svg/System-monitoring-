import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { GlassCard } from '../ui/GlassCard';

const activityData = [
  { time: '12:00', activeCandidates: 12, violations: 1, avgConfidence: 96 },
  { time: '12:05', activeCandidates: 25, violations: 2, avgConfidence: 94 },
  { time: '12:10', activeCandidates: 42, violations: 5, avgConfidence: 91 },
  { time: '12:15', activeCandidates: 48, violations: 8, avgConfidence: 89 },
  { time: '12:20', activeCandidates: 48, violations: 12, avgConfidence: 92 },
  { time: '12:25', activeCandidates: 47, violations: 15, avgConfidence: 93 },
  { time: '12:30', activeCandidates: 48, violations: 18, avgConfidence: 94 },
];

export const ActivityChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-serif-luxury">
      
      {/* Candidate Live Activity Area Chart */}
      <GlassCard className="p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-serif-luxury">Active Candidates Telemetry</h3>
            <p className="text-xs text-slate-600 font-sans">Live monitoring traffic over exam timeline</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-mono border border-sky-200 font-semibold">
            Realtime Streaming
          </span>
        </div>

        <div className="h-64 w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="activeCandidates" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#skyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Security Violations Breakdown Bar Chart */}
      <GlassCard className="p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-serif-luxury">Security Violation Severity Breakdown</h3>
            <p className="text-xs text-slate-600 font-sans">Flagged proctoring events by minute interval</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-mono border border-rose-200 font-semibold">
            Audit Frequency
          </span>
        </div>

        <div className="h-64 w-full font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="violations" fill="#E11D48" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

    </div>
  );
};
