import React, { useState, useEffect } from 'react';
import { Trophy, Search, Award } from 'lucide-react';
import { api } from '../../api/client';
import type { LeaderboardEntry } from '../../types';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.leaderboard.get().then(setEntries);
  }, []);

  const filtered = entries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.college.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = filtered.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex flex-col selection:bg-sky-500/20 font-serif-luxury">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-mono border border-amber-200 shadow-2xs font-semibold">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>GLOBAL ALGORITHMIC LEADERBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">Top Assessment Performers</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-sans">Verified score rankings backed by CodeShield AI proctoring telemetry</p>
        </div>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto">
            
            {/* Rank 2 - Silver */}
            <GlassCard className="p-6 border border-slate-200 text-center space-y-3 order-2 md:order-1 mt-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-700 font-bold text-lg font-mono">
                #2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-serif-luxury">{topThree[1].name}</h3>
                <p className="text-xs text-slate-500 font-sans truncate">{topThree[1].college}</p>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-800">{topThree[1].score} pts</div>
              <div className="text-xs text-slate-500 font-mono">{topThree[1].solved} Solved • {topThree[1].accuracy} Acc</div>
            </GlassCard>

            {/* Rank 1 - Gold */}
            <GlassCard className="p-6 border border-amber-300 text-center space-y-3 order-1 md:order-2 shadow-xl shadow-amber-500/10 bg-gradient-to-b from-amber-50/50 to-white">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-700 font-bold text-xl font-mono shadow-2xs">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl font-serif-luxury">{topThree[0].name}</h3>
                <p className="text-xs text-slate-500 font-sans truncate">{topThree[0].college}</p>
              </div>
              <div className="text-3xl font-extrabold font-mono text-amber-700">{topThree[0].score} pts</div>
              <div className="text-xs text-amber-800 font-mono font-semibold">{topThree[0].solved} Solved • {topThree[0].accuracy} Acc</div>
            </GlassCard>

            {/* Rank 3 - Bronze */}
            <GlassCard className="p-6 border border-slate-200 text-center space-y-3 order-3 mt-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 font-bold text-lg font-mono">
                #3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-serif-luxury">{topThree[2].name}</h3>
                <p className="text-xs text-slate-500 font-sans truncate">{topThree[2].college}</p>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-800">{topThree[2].score} pts</div>
              <div className="text-xs text-slate-500 font-mono">{topThree[2].solved} Solved • {topThree[2].accuracy} Acc</div>
            </GlassCard>

          </div>
        )}

        {/* Search & Full Rankings Table */}
        <div className="space-y-4 pt-4 font-serif-luxury">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Full Leaderboard Table</h3>
            <div className="relative font-sans">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name or college..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500 w-64 shadow-2xs"
              />
            </div>
          </div>

          <GlassCard className="p-0 border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-mono uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Candidate Name</th>
                    <th className="py-3.5 px-4">College / University</th>
                    <th className="py-3.5 px-4">Solved</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Time Taken</th>
                    <th className="py-3.5 px-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        #{row.rank}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 font-serif-luxury text-sm">{row.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.college}</td>
                      <td className="py-3.5 px-4 font-mono text-sky-700 font-bold">{row.solved} / 5</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{row.accuracy}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{row.time}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right text-sm">{row.score}</td>
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
  );
};
