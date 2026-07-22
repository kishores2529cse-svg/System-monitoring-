import React from 'react';
import { Clock3, BarChart3, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

const results = [
  { title: 'AI Coding Challenge', score: '94%', time: '32m', status: 'Passed' },
  { title: 'Algorithms Warmup', score: '92%', time: '28m', status: 'Passed' },
  { title: 'System Design Sprint', score: '87%', time: '40m', status: 'Passed' }
];

export const ResultsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500/20 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <GlassCard className="p-8 bg-white/90 border-slate-200 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Results</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Performance analytics</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Review your assessment history, score trends, and exam completion details in one secure candidate dashboard.</p>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-slate-950 to-slate-800 text-white border-slate-900 shadow-lg">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sky-200">Score analysis</div>
              <p className="mt-4 text-2xl font-semibold">Consistent exam success</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Your recent proctored assessments show strong performance and secure completion metrics.</p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Top score</p>
                  <p className="mt-2 text-3xl font-semibold">94%</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Average time</p>
                  <p className="mt-2 text-3xl font-semibold">33m</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assessment history</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Recent submissions</h2>
                </div>
                <BarChart3 className="h-5 w-5 text-slate-500" />
              </div>

              <div className="mt-6 space-y-4">
                {results.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 p-5 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.status}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">{item.score}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                      <span><Clock3 className="mr-1 inline h-3.5 w-3.5" /> {item.time}</span>
                      <span>Detailed metrics available</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.3em]">
                <CheckCircle2 className="h-4 w-4" /> Performance summary
              </div>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-4">Your secure scores demonstrate strong exam hygiene and sustained proficiency across assessments.</p>
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-4">View time taken, submission patterns, and risk adjustments from live proctoring analytics.</p>
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-4">Secure exam mode ensures all results are locked and audit-ready.</p>
              </div>
            </GlassCard>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};
