import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

const riskDistribution = [
  { name: 'Low Risk', value: 38, color: '#10B981' },
  { name: 'Medium Risk', value: 7, color: '#F59E0B' },
  { name: 'High Risk', value: 3, color: '#EF4444' },
];

const violationTypes = [
  { type: 'Tab switch', total: 8 },
  { type: 'Fullscreen', total: 5 },
  { type: 'Face detect', total: 4 },
  { type: 'Copy/paste', total: 3 },
];

const assessmentState = [
  { name: 'Active', total: 48 },
  { name: 'Completed', total: 73 },
];

const chartTooltipStyle = {
  backgroundColor: '#091109',
  borderColor: '#334155',
  borderRadius: '12px',
  color: '#FFFFFF',
  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
};

export const ActivityChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
      
      {/* Candidate Live Activity Area Chart */}
      <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active Candidates Telemetry</h3>
            <p className="text-xs text-slate-400">Live monitoring traffic over exam timeline</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-mono border border-sky-500/30 font-semibold">
            Realtime Streaming
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="activeCandidates" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#skyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Risk Score Distribution */}
      <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Risk Score Distribution</h3>
          <p className="text-xs text-slate-400">AI confidence thresholds across active candidates</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4}>
                {riskDistribution.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs font-mono text-slate-300">
          {riskDistribution.map((item) => (
            <span key={item.name} className="flex items-center">
              <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name} ({item.value})
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Violations by Type */}
      <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Violations by Type</h3>
          <p className="text-xs text-slate-400">Flagged event categories in the active monitoring window</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={violationTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="total" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Active vs Completed Assessments */}
      <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Active vs Completed Assessments</h3>
          <p className="text-xs text-slate-400">Assessment state distribution for the current session</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assessmentState} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={80} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="total" fill="#7CFF4D" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Security Violations Breakdown Bar Chart */}
      <GlassCard className="p-5 border border-slate-800 bg-slate-900/85 shadow-xl space-y-4 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Security Violation Severity Breakdown</h3>
            <p className="text-xs text-slate-400">Flagged proctoring events by minute interval</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-mono border border-rose-500/30 font-semibold">
            Audit Frequency
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="violations" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

    </div>
  );
};

