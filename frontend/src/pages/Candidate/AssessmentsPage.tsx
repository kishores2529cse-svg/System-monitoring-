import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

const availableAssessments = [
  { title: 'AI Coding Challenge', type: 'Timed Exam', due: 'Today · 10:00 AM', status: 'Ready' },
  { title: 'System Design Sprint', type: 'Proctored', due: 'Jul 25 · 2:00 PM', status: 'Scheduled' }
];

const upcomingAssessments = [
  { title: 'Data Structures Practice', type: 'Practice', due: 'Jul 28 · 9:00 AM', status: 'Open' },
  { title: 'Security Assessment', type: 'Secure Round', due: 'Jul 30 · 11:00 AM', status: 'Open' }
];

const completedAssessments = [
  { title: 'Algorithms Warmup', score: '92%', date: 'Jul 20', status: 'Completed' },
  { title: 'Logic Challenge', score: '89%', date: 'Jul 18', status: 'Completed' }
];

export const AssessmentsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500/20 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <GlassCard className="p-8 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assessments</p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-950">Your exam pipeline</h1>
                </div>
                <Link to="/exam/101" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-slate-800">
                  <ShieldCheck className="h-4 w-4" />
                  Assessment Readiness
                </Link>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">Monitor availability, upcoming sessions, and completed assessments from one secure candidate dashboard.</p>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-sky-950 to-slate-950 text-white border-slate-900 shadow-lg">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-sky-200">Assessment readiness</div>
              <p className="mt-4 text-2xl font-semibold">Secure exam mode enabled</p>
              <p className="mt-3 text-sm leading-6 text-sky-100">All assessments are executed in a locked browser environment with clipboard protection, fullscreen enforcement, and risk monitoring.</p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-sky-200">Next secure window</p>
                  <p className="mt-2 text-lg font-semibold">Today · 10:00 AM</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-sky-200">Trust score</p>
                  <p className="mt-2 text-lg font-semibold">97%</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.3em]">Available now</div>
              <div className="mt-6 space-y-4">
                {availableAssessments.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 p-4 hover:border-slate-300 transition">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.type}</p>
                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                      <span>{item.due}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.3em]">Upcoming assessments</div>
              <div className="mt-6 space-y-4">
                {upcomingAssessments.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 p-4 hover:border-slate-300 transition">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.type}</p>
                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                      <span>{item.due}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.3em]">Completed</div>
              <div className="mt-6 space-y-4">
                {completedAssessments.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 p-4 hover:border-slate-300 transition">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                      <span>{item.status}</span>
                      <span>{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};
