import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock3, FileText, Lock, ShieldCheck, Users } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

const activeAssessments = [
  { id: '101', name: 'DSA Round 1', difficulty: 'Medium', duration: '90 min', questions: 5, marks: 500, deadline: 'Today 5:00 PM' },
  { id: '102', name: 'Java Programming Assessment', difficulty: 'Easy', duration: '60 min', questions: 20, marks: 200, deadline: 'Today 7:00 PM' },
  { id: '103', name: 'SQL Fundamentals Assessment', difficulty: 'Medium', duration: '45 min', questions: 15, marks: 150, deadline: 'Tomorrow 3:00 PM' }
];

const upcomingAssessments = [
  { name: 'Frontend Development Challenge', date: '25 July 2026', time: '10:00 AM', duration: '120 Minutes', questions: 4, marks: 400, registered: 248 },
  { name: 'System Design Assessment', date: '27 July 2026', time: '2:00 PM', duration: '90 Minutes', questions: 3, marks: 300, registered: 132 }
];

const difficultyClass: Record<string, string> = { Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200', Medium: 'bg-amber-50 text-amber-700 border-amber-200', Hard: 'bg-rose-50 text-rose-700 border-rose-200' };

export const AssessmentsPage: React.FC = () => (
  <PageTransition>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-sm backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Official examination portal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Coding assessments</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Attempt assigned, proctored coding assessments. Each assessment contains multiple questions and is completed in secure exam mode.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Total Assessments', '7', FileText, 'text-sky-600 bg-sky-50'],
            ['Available Now', '3', CheckCircle2, 'text-emerald-600 bg-emerald-50'],
            ['Upcoming Assessments', '2', CalendarDays, 'text-blue-600 bg-blue-50'],
            ['Completed Assessments', '2', ShieldCheck, 'text-violet-600 bg-violet-50']
          ].map(([label, value, Icon, style]) => { const CardIcon = Icon as React.ElementType; return <GlassCard key={label as string} className="border-slate-200 bg-white/85 p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label as string}</p><p className="mt-3 text-3xl font-semibold text-slate-950">{value as string}</p></div><span className={`rounded-2xl p-3 ${style as string}`}><CardIcon className="h-5 w-5" /></span></div></GlassCard>; })}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold text-slate-950">Active assessments</h2><p className="mt-1 text-sm text-slate-500">Available official assessments assigned to your account.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />3 available</span></div>
          <div className="overflow-x-auto"><table className="min-w-[1000px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4 pl-6">Assessment</th><th>Difficulty</th><th>Duration</th><th>Questions</th><th>Total Marks</th><th>Deadline</th><th>Status</th><th className="p-4 pr-6">Action</th></tr></thead><tbody>{activeAssessments.map((assessment) => <tr key={assessment.id} className="border-t border-slate-100 transition hover:bg-sky-50/40"><td className="p-4 pl-6 font-semibold text-slate-900">{assessment.name}</td><td><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyClass[assessment.difficulty]}`}>{assessment.difficulty}</span></td><td><Clock3 className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{assessment.duration}</td><td>{assessment.questions}</td><td>{assessment.marks}</td><td className="text-slate-600">{assessment.deadline}</td><td><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Available</span></td><td className="p-4 pr-6"><Link to={`/assessment/${assessment.id}/readiness`} className="inline-flex whitespace-nowrap rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">Attempt Assessment</Link></td></tr>)}</tbody></table></div>
        </section>

        <section><div className="mb-4"><h2 className="text-xl font-semibold text-slate-950">Upcoming assessments</h2><p className="mt-1 text-sm text-slate-500">Scheduled assessments will unlock at their assigned time.</p></div><div className="grid gap-5 lg:grid-cols-2">{upcomingAssessments.map((assessment) => <GlassCard key={assessment.name} className="border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-slate-950">{assessment.name}</h3><p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4 text-sky-600" />{assessment.date} · {assessment.time}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Upcoming</span></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600"><span><Clock3 className="mr-1 inline h-4 w-4 text-slate-400" />{assessment.duration}</span><span><FileText className="mr-1 inline h-4 w-4 text-slate-400" />{assessment.questions} Questions</span><span>🎯 Total Marks: {assessment.marks}</span><span><Users className="mr-1 inline h-4 w-4 text-slate-400" />{assessment.registered} Candidates</span></div><button className="mt-6 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">View Details</button></GlassCard>)}</div></section>

        <section className="rounded-3xl border border-sky-100 bg-sky-50/70 p-5 text-sm text-slate-600"><Lock className="mr-2 inline h-4 w-4 text-sky-700" /><strong className="text-slate-800">Secure assessment policy:</strong> camera, fullscreen mode, AI risk monitoring, and activity logging are required before an assessment can start.</section>
      </main>
      <Footer />
    </div>
  </PageTransition>
);
