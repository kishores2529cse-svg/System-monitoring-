import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, ShieldCheck, TrendingUp, Activity, Bookmark, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import type { MonitoringEvent } from '../../types';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { PageTransition } from '../../components/ui/PageTransition';
import { SplashCursor } from '../../components/ui/SplashCursor';

const stats = [
  { label: 'Assessments Due', value: '3', icon: Bookmark, accent: 'from-[#7CFF4D]/30 to-[#7CFF4D]/10 border-[#7CFF4D]/40 text-[#7CFF4D]' },
  { label: 'Average Score', value: '88%', icon: TrendingUp, accent: 'from-emerald-500/30 to-teal-500/10 border-emerald-400/40 text-emerald-300' },
  { label: 'Risk Stability', value: '96%', icon: ShieldCheck, accent: 'from-sky-500/30 to-cyan-500/10 border-sky-400/40 text-sky-300' },
  { label: 'Recent Activity', value: '12 events', icon: Activity, accent: 'from-purple-500/30 to-fuchsia-500/10 border-purple-400/40 text-purple-300' }
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
  const [historyEvents, setHistoryEvents] = useState<MonitoringEvent[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const evts = await api.monitor.getHistory('USR001');
        setHistoryEvents(evts);
      } catch (e) {
        console.warn('Failed to load candidate proctor history:', e);
      }
    };
    fetchHistory();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen relative font-sans text-slate-100 bg-[#091109] overflow-hidden selection:bg-[#7CFF4D]/30">
        {/* Interactive Particle Splash Cursor Animation */}
        <SplashCursor />

        {/* 4K SIET Campus Background with Dark Professional Gradient Overlay */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/siet_campus.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050b05]/85 via-[#081208]/90 to-[#040804]/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Welcome Banner */}
            <section className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
              <div className="rounded-3xl border border-white/20 bg-black/65 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[#7CFF4D] drop-shadow-md">
                      SIET Portal • Candidate Workspace
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                      Welcome back, {user?.name || 'Candidate'}!
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-slate-200 drop-shadow-sm font-medium">
                      A distraction-free candidate hub for scheduling assessments, reviewing security analytics, and staying exam-ready.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
                    <Link
                      to="/exam"
                      className="inline-flex items-center justify-center rounded-2xl bg-[#7CFF4D] px-6 py-3.5 text-sm font-bold text-[#091109] transition duration-300 hover:bg-[#A3FF1A] shadow-xl shadow-[#7CFF4D]/20"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Link>
                    <Link
                      to="/assessments"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-white/20 backdrop-blur-md"
                    >
                      View Assessments
                    </Link>
                  </div>
                </div>
              </div>

              {/* High Contrast Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map(({ label, value, icon: Icon, accent }) => (
                  <div key={label} className="rounded-3xl border border-white/15 bg-black/60 p-5 shadow-xl backdrop-blur-xl transition hover:border-white/30">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br ${accent} shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
                      <p className="mt-2 text-3xl font-extrabold text-white drop-shadow-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Assessments & Quick Actions */}
            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-white/15 bg-black/60 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] font-semibold text-[#7CFF4D]">Upcoming Assessments</p>
                    <h2 className="mt-1 text-2xl font-bold text-white drop-shadow-sm">Stay on schedule</h2>
                  </div>
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    Next in 14h
                  </span>
                </div>

                <div className="space-y-4">
                  {upcomingAssessments.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-bold text-white">{item.title}</p>
                          <p className="text-xs text-slate-300">{item.type}</p>
                        </div>
                        <div className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-[#7CFF4D]">
                          {item.status}
                        </div>
                      </div>
                      <p className="mt-3 text-xs font-mono text-slate-300">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/15 bg-black/60 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] font-semibold text-emerald-400">Quick Actions</p>
                      <h2 className="mt-1 text-2xl font-bold text-white">Exam readiness</h2>
                    </div>
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                      Protected
                    </div>
                  </div>

                  <p className="leading-7 text-sm text-slate-200 font-medium">
                    Prepare for your secured assessment with our readiness checklist, proctor settings, and risk analytics designed for distraction-free performance.
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/assessments"
                    className="inline-flex rounded-2xl bg-[#7CFF4D] px-5 py-3 text-sm font-bold text-[#091109] transition duration-300 hover:bg-[#A3FF1A] shadow-lg shadow-[#7CFF4D]/15"
                  >
                    Assessment Readiness
                  </Link>
                </div>
              </div>
            </section>

            {/* Recent Activity & Readiness Score */}
            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-white/15 bg-black/60 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] font-semibold text-[#7CFF4D]">Recent Activity</p>
                    <h2 className="mt-1 text-2xl font-bold text-white">What you did last</h2>
                  </div>
                  <User className="h-5 w-5 text-[#7CFF4D]" />
                </div>

                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <div key={item.text} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{item.text}</p>
                      <p className="mt-1.5 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/80 via-black/70 to-emerald-950/40 p-6 shadow-xl backdrop-blur-xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] font-semibold text-cyan-300">Performance Wall</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Exam readiness score</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    Your candidate profile is secure, full-screen locked, and monitored with premium proctoring analytics.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Proctor confidence</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#7CFF4D]">97%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Exam completion</p>
                    <p className="mt-2 text-3xl font-extrabold text-sky-300">4 / 5</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Proctor Security Audit & History Section */}
            <section className="rounded-3xl border border-white/15 bg-black/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] font-semibold text-rose-400">Security & Integrity Audit</p>
                  <h2 className="mt-1 text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                    Proctor Violation History & Audit Cards
                  </h2>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-bold self-start sm:self-auto">
                  YOLOv8-N & MediaPipe Monitored
                </span>
              </div>

              {historyEvents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">100% Clean Proctor Audit</p>
                    <p className="text-xs text-emerald-400/80">No unauthorized objects or focus shift violations recorded in your examination history.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {historyEvents.map((evt) => {
                    const isUnauthObj = evt.event.includes('UNAUTHORIZED OBJECT DETECTED') || evt.event.includes('Mobile Phone');
                    const isFocusShift = evt.event.includes('Focus Shift') || evt.event.includes('Turned Around');

                    return (
                      <div
                        key={evt.id}
                        className={`rounded-2xl p-4 border transition-all ${
                          isUnauthObj
                            ? 'bg-gradient-to-br from-rose-950/80 to-red-950/60 border-rose-500/60 shadow-lg shadow-rose-950/50'
                            : isFocusShift
                            ? 'bg-gradient-to-br from-amber-950/80 to-orange-950/60 border-amber-500/50'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 shrink-0 ${isUnauthObj ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                            <span className={`text-xs font-bold font-mono ${isUnauthObj ? 'text-rose-200 font-black' : 'text-white'}`}>
                              {evt.event}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            isUnauthObj ? 'bg-rose-600 text-white' : 'bg-amber-500 text-black'
                          }`}>
                            {isUnauthObj ? 'YOLOv8-N' : 'MediaPipe'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{evt.details}</p>
                        
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Status: {evt.status}</span>
                          <span>{evt.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};
