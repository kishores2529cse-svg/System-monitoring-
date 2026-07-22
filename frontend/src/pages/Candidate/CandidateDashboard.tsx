import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, ShieldCheck, TrendingUp, Activity, Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

const stats = [
  { label: 'Assessments Due', value: '3', icon: Bookmark, accent: 'from-sky-500 to-cyan-400' },
  { label: 'Average Score', value: '88%', icon: TrendingUp, accent: 'from-emerald-400 to-teal-400' },
  { label: 'Risk Stability', value: '96%', icon: ShieldCheck, accent: 'from-violet-500 to-fuchsia-500' },
  { label: 'Recent Activity', value: '12 events', icon: Activity, accent: 'from-slate-400 to-slate-600' }
];

const upcomingAssessments = [
  { title: 'AI Coding Challenge', date: 'Tomorrow, 10:00 AM', type: 'Timed Exam', status: 'Ready' },
  { title: 'System Design Quiz', date: 'Jul 25 · 14:00', type: 'Proctored', status: 'Scheduled' },
  { title: 'Data Structures Sprint', date: 'Jul 28 · 09:00', type: 'Practice', status: 'Open' }
];

const recentActivity = [
  { text: 'Completed 2 practice problems in Algorithms', time: '2h ago' },
  { text: 'Viewed assessment readiness checklist', time: 'Yesterday' },
  { text: 'Earned 96% confidence score on last exam', time: '3 days ago' }
];

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500/20 font-sans">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
            <GlassCard className="p-8 bg-white/85 border-slate-200 shadow-lg shadow-slate-200/30">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Hi {user?.name || 'Candidate'}, ready for your next assessment?</h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">A distraction-free candidate hub for scheduling your assessments, reviewing recent activity, and staying exam-ready with premium security analytics.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/exam/101"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-slate-800"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Link>
                  <Link
                    to="/assessments"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:border-slate-300 hover:bg-slate-50"
                  >
                    View Assessments
                  </Link>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-6 sm:grid-cols-2">
              {stats.map(({ label, value, icon: Icon, accent }) => (
                <GlassCard key={label} className="p-6 border-slate-200 shadow-sm">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <GlassCard className="p-6 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Upcoming Assessments</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Stay on schedule</h2>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Next in 14h</span>
              </div>

              <div className="space-y-4">
                {upcomingAssessments.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.type}</p>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.status}</div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">{item.date}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Quick Actions</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Focus on exam readiness</h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Secure</div>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <p className="leading-7">Prepare for your secured assessment with our readiness checklist, exam settings, and risk analytics designed for distraction-free performance.</p>
                <Link to="/assessments" className="inline-flex rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-slate-800">Assessment Readiness</Link>
              </div>
            </GlassCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <GlassCard className="p-6 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Recent Activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">What you did last</h2>
                </div>
                <User className="h-5 w-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.text} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">{item.text}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-slate-200 shadow-sm bg-gradient-to-br from-slate-950 to-slate-800 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/70">Performance Wall</p>
                <h2 className="mt-2 text-2xl font-semibold">Exam readiness score</h2>
                <p className="mt-4 text-sm leading-7 text-slate-200">Your candidate profile is secure, full-screen locked, and monitored with premium proctoring analytics. Keep your exam focus high.</p>
              </div>
              <div className="mt-8 grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Proctor confidence</p>
                  <p className="mt-3 text-3xl font-semibold">97%</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Exam completion</p>
                  <p className="mt-3 text-3xl font-semibold">4 / 5</p>
                </div>
              </div>
            </GlassCard>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};
