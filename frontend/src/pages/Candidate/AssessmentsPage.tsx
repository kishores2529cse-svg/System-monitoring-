import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock3, FileText, Lock, ShieldCheck, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';
import { api } from '../../api/client';
import type { ManagedAssessment } from '../../types';

const activeAssessments = [
  { id: '101', name: 'DSA Round 1 — Algorithm Assessment', difficulty: 'Medium', duration: '90 min', questions: 5, marks: 500, deadline: 'Today 5:00 PM' },
  { id: '102', name: 'Java Programming & Data Structures', difficulty: 'Easy', duration: '60 min', questions: 20, marks: 200, deadline: 'Today 7:00 PM' },
  { id: '103', name: 'SQL & Database Architecture Assessment', difficulty: 'Medium', duration: '45 min', questions: 15, marks: 150, deadline: 'Tomorrow 3:00 PM' }
];

const upcomingAssessments = [
  { name: 'Frontend Engineering & React Mastery', date: '25 July 2026', time: '10:00 AM', duration: '120 Minutes', questions: 4, marks: 400, registered: 248 },
  { name: 'Distributed Systems & Scalability Assessment', date: '27 July 2026', time: '2:00 PM', duration: '90 Minutes', questions: 3, marks: 300, registered: 132 }
];

const difficultyClass: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
};

export const AssessmentsPage: React.FC = () => {
  const [adminAssessments, setAdminAssessments] = useState<ManagedAssessment[]>([]);

  useEffect(() => {
    api.admin.getAssessments().then(setAdminAssessments);
  }, []);

  const displayAssessments = [
    ...activeAssessments,
    ...adminAssessments.filter(item => item.status === 'Published').map(item => ({
      id: item.id,
      name: item.title,
      difficulty: 'Medium',
      duration: `${item.durationMinutes} min`,
      questions: item.questionCount,
      marks: item.totalMarks,
      deadline: new Date(item.deadline).toLocaleString()
    }))
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-slate-100 font-sans flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl shadow-black/40 backdrop-blur-xl sm:p-8 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7CFF4D]/30 bg-[#7CFF4D]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7CFF4D]">
              <Sparkles className="w-3 h-3" /> Official examination portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Assigned Coding Assessments
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300">
              Attempt assigned, proctored coding assessments in real time. Each session runs in secure fullscreen mode with AI-assisted malpractice detection.
            </p>
          </section>

          {/* Quick Metrics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Total Assessments', '7', FileText, 'text-sky-400 bg-sky-500/10 border-sky-500/20'],
              ['Available Now', '3', CheckCircle2, 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'],
              ['Upcoming Assessments', '2', CalendarDays, 'text-amber-400 bg-amber-500/10 border-amber-500/20'],
              ['Completed Assessments', '2', ShieldCheck, 'text-purple-400 bg-purple-500/10 border-purple-500/20']
            ].map(([label, value, Icon, style]) => {
              const CardIcon = Icon as React.ElementType;
              return (
                <GlassCard key={label as string} className="border-slate-800 bg-slate-900/80 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 font-mono">
                        {label as string}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold font-mono text-white">
                        {value as string}
                      </p>
                    </div>
                    <span className={`rounded-2xl p-3 border shadow-inner ${style as string}`}>
                      <CardIcon className="h-5 w-5" />
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </section>

          {/* Active Assessments Table */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between bg-slate-950/60">
              <div>
                <h2 className="text-xl font-bold text-white">Active Assessments</h2>
                <p className="mt-0.5 text-xs text-slate-400">Available examinations assigned to your candidate profile.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {displayAssessments.length} Active Exams
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Assessment Name</th>
                    <th>Difficulty</th>
                    <th>Duration</th>
                    <th>Questions</th>
                    <th>Total Marks</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {displayAssessments.map((assessment) => (
                    <tr key={assessment.id} className="transition hover:bg-white/[0.03]">
                      <td className="p-4 pl-6 font-bold text-white">
                        {assessment.name}
                      </td>
                      <td>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${difficultyClass[assessment.difficulty] || 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                          {assessment.difficulty}
                        </span>
                      </td>
                      <td className="text-slate-300 font-mono">
                        <Clock3 className="mr-1 inline h-3.5 w-3.5 text-sky-400" />
                        {assessment.duration}
                      </td>
                      <td className="text-slate-300 font-mono">{assessment.questions} Qs</td>
                      <td className="text-slate-300 font-mono font-bold">{assessment.marks} pts</td>
                      <td className="text-slate-400 font-mono text-xs">{assessment.deadline}</td>
                      <td>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                          Available
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link
                          to={`/assessment/${assessment.id}/readiness`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#7CFF4D] px-4 py-2 text-xs font-extrabold text-[#091109] transition-all hover:bg-[#A3FF1A] hover:shadow-lg hover:shadow-[#7CFF4D]/20"
                        >
                          <span>Attempt Assessment</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upcoming Assessments */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Upcoming Scheduled Assessments</h2>
              <p className="mt-0.5 text-xs text-slate-400">Scheduled assessments will automatically unlock at their designated start time.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {upcomingAssessments.map((assessment) => (
                <GlassCard key={assessment.name} className="border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{assessment.name}</h3>
                      <p className="mt-1.5 inline-flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <CalendarDays className="h-4 w-4 text-amber-400" />
                        {assessment.date} · {assessment.time}
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                      Scheduled
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono border-y border-slate-800 py-3">
                    <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-sky-400" /> {assessment.duration}</span>
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-sky-400" /> {assessment.questions} Questions</span>
                    <span>🎯 Total: {assessment.marks} Marks</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-sky-400" /> {assessment.registered} Registered</span>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                  >
                    View Examination Syllabus &amp; Instructions
                  </button>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Secure Proctoring Notice */}
          <section className="rounded-2xl border border-sky-500/30 bg-slate-950/80 p-5 text-xs sm:text-sm text-slate-300 flex items-start gap-3 shadow-inner">
            <Lock className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold">Strict Proctoring Policy:</strong> Webcam verification, mandatory fullscreen enforcement, MediaPipe gaze orientation tracking, and real-time YOLOv8 unauthorized object detection are active across all formal assessments.
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

