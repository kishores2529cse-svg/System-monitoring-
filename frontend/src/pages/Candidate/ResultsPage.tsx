import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, BarChart3, CheckCircle2, Clock3, FileText, Trophy, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { PageTransition } from '../../components/ui/PageTransition';

const results = [
  { name: 'DSA Round 1 — Algorithm Assessment', date: '22 Jul 2026', score: 94, rank: 12, time: '78 min', status: 'Passed', feedback: 'View feedback' },
  { name: 'Java Programming & Data Structures', date: '18 Jul 2026', score: 89, rank: 24, time: '54 min', status: 'Passed', feedback: 'View feedback' },
  { name: 'SQL & Database Architecture', date: '12 Jul 2026', score: 82, rank: 38, time: '41 min', status: 'Passed', feedback: 'View feedback' },
  { name: 'System Design & Concurrency Round', date: '04 Jul 2026', score: 64, rank: 76, time: '90 min', status: 'Failed', feedback: 'View feedback' }
];

const skillData = [
  { skill: 'Java', score: 86 },
  { skill: 'DSA', score: 92 },
  { skill: 'SQL', score: 82 },
  { skill: 'Frontend', score: 76 },
  { skill: 'Problem Solving', score: 88 }
];

const trendData = [
  { month: 'Mar', score: 69 },
  { month: 'Apr', score: 74 },
  { month: 'May', score: 78 },
  { month: 'Jun', score: 81 },
  { month: 'Jul', score: 89 }
];

const difficultyData = [
  { name: 'Easy', score: 92 },
  { name: 'Medium', score: 84 },
  { name: 'Hard', score: 68 }
];

const panel = 'rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl';

export const ResultsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent font-sans text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 px-7 py-7 shadow-xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7CFF4D]/30 bg-[#7CFF4D]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7CFF4D]">
                <Sparkles className="w-3 h-3" /> Performance Telemetry
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Results &amp; Analytics
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                A comprehensive view of your verified proctored assessment scores, historical trends, and skills matrix.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-300 flex items-center gap-2 shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>3 of 4 Assessments Passed (75% Rate)</span>
            </div>
          </section>

          {/* Quick Metrics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Average Score', '82%', BarChart3, 'text-sky-400 bg-sky-500/10 border-sky-500/20'],
              ['Highest Score', '94%', Trophy, 'text-amber-400 bg-amber-500/10 border-amber-500/20'],
              ['Assessments Completed', '4', FileText, 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'],
              ['Certificates Earned', '2', Award, 'text-purple-400 bg-purple-500/10 border-purple-500/20']
            ].map(([label, value, Icon, tone]) => {
              const CardIcon = Icon as React.ElementType;
              return (
                <div key={label as string} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 font-mono">
                        {label as string}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold font-mono text-white">
                        {value as string}
                      </p>
                    </div>
                    <span className={`rounded-2xl p-3 border shadow-inner ${tone as string}`}>
                      <CardIcon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Assessment Results Table */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between bg-slate-950/60">
              <div>
                <h2 className="text-xl font-bold text-white">Assessment Records</h2>
                <p className="mt-0.5 text-xs text-slate-400">Formal examination scores and proctoring telemetry audit reports.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Score Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Assessment Name</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Rank</th>
                    <th>Time Taken</th>
                    <th>Status</th>
                    <th className="p-4 pr-6 text-right">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {results.map((result) => (
                    <tr key={result.name} className="transition hover:bg-white/[0.03]">
                      <td className="p-4 pl-6 font-bold text-white">{result.name}</td>
                      <td className="text-slate-400 font-mono text-xs">{result.date}</td>
                      <td>
                        <span className="font-bold text-white font-mono text-sm">{result.score}%</span>
                      </td>
                      <td className="text-slate-300 font-mono font-semibold">#{result.rank}</td>
                      <td className="text-slate-300 font-mono">
                        <Clock3 className="mr-1 inline h-3.5 w-3.5 text-sky-400" />
                        {result.time}
                      </td>
                      <td>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            result.status === 'Passed'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          type="button"
                          className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline transition"
                        >
                          {result.feedback} →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Analytics Charts Grid */}
          <section className="grid gap-6 xl:grid-cols-2">
            
            {/* Score Trend Area Chart */}
            <div className={panel}>
              <h2 className="text-base font-bold text-white">Assessment Score Progression</h2>
              <p className="mt-0.5 text-xs text-slate-400">Average verified score across recent exam cycles.</p>
              <div className="mt-5 h-64 font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7CFF4D" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#7CFF4D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#091109',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7CFF4D" strokeWidth={3} fill="url(#scoreFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Matrix Breakdown */}
            <div className={panel}>
              <h2 className="text-base font-bold text-white">Domain Competency Breakdown</h2>
              <p className="mt-0.5 text-xs text-slate-400">Mastery score derived from submitted algorithm solutions.</p>
              <div className="mt-5 space-y-4">
                {skillData.map((skill) => (
                  <div key={skill.skill} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-semibold text-slate-200">{skill.skill}</span>
                      <span className="text-emerald-400 font-bold">{skill.score}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#7CFF4D] transition-all duration-500"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty-wise Performance Bar Chart */}
            <div className={panel}>
              <h2 className="text-base font-bold text-white">Performance by Problem Complexity</h2>
              <p className="mt-0.5 text-xs text-slate-400">Average accuracy and test case passing rates.</p>
              <div className="mt-5 h-60 font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyData}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#091109',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {difficultyData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={item.name === 'Easy' ? '#10B981' : item.name === 'Medium' ? '#F59E0B' : '#EF4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overall Pass / Fail Rate Pie Chart */}
            <div className={panel}>
              <h2 className="text-base font-bold text-white">Overall Success Rate</h2>
              <p className="mt-0.5 text-xs text-slate-400">Ratio of passed assessments against total formal attempts.</p>
              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Passed', value: 75 },
                        { name: 'Needs Improvement', value: 25 }
                      ]}
                      dataKey="value"
                      innerRadius={62}
                      outerRadius={82}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#7CFF4D" />
                      <Cell fill="#334155" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#091109',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#FFFFFF'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="-mt-28 text-center text-3xl font-extrabold font-mono text-white">75%</p>
              <p className="mt-1 text-center text-xs text-slate-400 font-mono">3 of 4 Formal Assessments Cleared</p>
            </div>

          </section>

          {/* Feedback & Recommendations */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Faculty &amp; AI Proctoring Feedback</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [
                  'DSA Round 1',
                  'Excellent algorithm time complexity reasoning. Recommend reviewing boundary conditions for duplicate element inputs.',
                  'Strong Performance',
                  'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                ],
                [
                  'Java Programming',
                  'Clean object-oriented structure and memory management. Strengthen custom exception propagation in file handlers.',
                  'Good Progress',
                  'text-sky-400 border-sky-500/30 bg-sky-500/10'
                ],
                [
                  'SQL Fundamentals',
                  'Accurate relational joins and aggregation logic. Practice multi-tier window functions and index optimization.',
                  'Focus Area',
                  'text-amber-400 border-amber-500/30 bg-amber-500/10'
                ]
              ].map(([title, note, label, badgeStyle]) => (
                <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                    {label}
                  </span>
                  <h3 className="font-bold text-white text-base">{title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{note}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                  >
                    <span>Read detailed code analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </article>
              ))}
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};


