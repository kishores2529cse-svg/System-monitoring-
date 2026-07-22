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
  { name: 'Low risk', value: 38, color: '#10B981' },
  { name: 'Medium risk', value: 7, color: '#F59E0B' },
  { name: 'High risk', value: 3, color: '#E11D48' },
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

      <GlassCard className="p-5 border border-slate-200 space-y-4">
        <div><h3 className="text-base font-bold text-slate-900">Risk Score Distribution</h3><p className="text-xs text-slate-600 font-sans">AI confidence thresholds across active candidates</p></div>
        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4}>{riskDistribution.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        <div className="flex justify-center gap-3 text-[11px] text-slate-600">{riskDistribution.map((item) => <span key={item.name}><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>)}</div>
      </GlassCard>

      <GlassCard className="p-5 border border-slate-200 space-y-4">
        <div><h3 className="text-base font-bold text-slate-900">Violations by Type</h3><p className="text-xs text-slate-600 font-sans">Flagged event categories in the active monitoring window</p></div>
        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={violationTypes}><CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="type" stroke="#64748B" fontSize={10} /><YAxis stroke="#64748B" fontSize={11} /><Tooltip /><Bar dataKey="total" fill="#F59E0B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </GlassCard>

      <GlassCard className="p-5 border border-slate-200 space-y-4">
        <div><h3 className="text-base font-bold text-slate-900">Active vs Completed Assessments</h3><p className="text-xs text-slate-600 font-sans">Assessment state distribution for the current session</p></div>
        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={assessmentState} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis type="number" stroke="#64748B" fontSize={11} /><YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={75} /><Tooltip /><Bar dataKey="total" fill="#0284C7" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
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
