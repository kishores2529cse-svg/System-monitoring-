import React, { useState, useEffect } from 'react';
import { Trophy, Search, Award } from 'lucide-react';
import { api } from '../../api/client';
import type { LeaderboardEntry } from '../../types';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.leaderboard.get().then(setEntries);
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.college.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = filtered.slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Title Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-mono font-bold tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>GLOBAL ALGORITHMIC LEADERBOARD</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Top Assessment Performers
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Verified algorithmic score rankings backed by continuous AI proctoring telemetry audit checks.
            </p>
          </div>

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto items-end">
              
              {/* Rank 2 - Silver */}
              <GlassCard className="p-6 border border-slate-700 bg-slate-900/90 text-center space-y-3 order-2 md:order-1 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center mx-auto text-slate-200 font-bold text-lg font-mono shadow-inner">
                  #2
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{topThree[1].name}</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[200px] mx-auto">{topThree[1].college}</p>
                </div>
                <div className="text-2xl font-extrabold font-mono text-slate-200">{topThree[1].score} pts</div>
                <div className="text-xs text-slate-400 font-mono">{topThree[1].solved} Solved • {topThree[1].accuracy} Acc</div>
              </GlassCard>

              {/* Rank 1 - Gold (Elevated Center) */}
              <GlassCard className="p-7 border border-amber-400/50 text-center space-y-3 order-1 md:order-2 shadow-2xl shadow-amber-500/10 bg-gradient-to-b from-amber-500/15 via-slate-900/95 to-slate-950">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 font-bold text-2xl font-mono shadow-lg">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                    🥇 Overall Rank #1
                  </div>
                  <h3 className="font-extrabold text-white text-xl">{topThree[0].name}</h3>
                  <p className="text-xs text-slate-300 truncate max-w-[220px] mx-auto">{topThree[0].college}</p>
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400">{topThree[0].score} pts</div>
                <div className="text-xs text-amber-300 font-mono font-bold">{topThree[0].solved} Solved • {topThree[0].accuracy} Acc</div>
              </GlassCard>

              {/* Rank 3 - Bronze */}
              <GlassCard className="p-6 border border-amber-700/40 bg-slate-900/90 text-center space-y-3 order-3 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-900/30 border border-amber-700/50 flex items-center justify-center mx-auto text-amber-300 font-bold text-lg font-mono shadow-inner">
                  #3
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{topThree[2].name}</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[200px] mx-auto">{topThree[2].college}</p>
                </div>
                <div className="text-2xl font-extrabold font-mono text-amber-300/90">{topThree[2].score} pts</div>
                <div className="text-xs text-slate-400 font-mono">{topThree[2].solved} Solved • {topThree[2].accuracy} Acc</div>
              </GlassCard>

            </div>
          )}

          {/* Search & Full Rankings Table */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">Full Leaderboard Rankings</h3>
                <p className="text-xs text-slate-400">All verified candidate assessment performances.</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate or college..."
                  className="pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-400 w-full sm:w-72 shadow-inner transition"
                />
              </div>
            </div>

            <GlassCard className="p-0 border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-3.5 px-5">Rank</th>
                      <th className="py-3.5 px-5">Candidate Name</th>
                      <th className="py-3.5 px-5">College / University</th>
                      <th className="py-3.5 px-5">Solved</th>
                      <th className="py-3.5 px-5">Accuracy</th>
                      <th className="py-3.5 px-5">Time Taken</th>
                      <th className="py-3.5 px-5 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-slate-300">
                          #{row.rank}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-white">{row.name}</td>
                        <td className="py-3.5 px-5 text-slate-300">{row.college}</td>
                        <td className="py-3.5 px-5 font-mono text-sky-300 font-bold">{row.solved} / 5</td>
                        <td className="py-3.5 px-5 font-mono text-emerald-400 font-bold">{row.accuracy}</td>
                        <td className="py-3.5 px-5 font-mono text-slate-400">{row.time}</td>
                        <td className="py-3.5 px-5 font-mono font-extrabold text-[#7CFF4D] text-right text-sm">{row.score} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};


