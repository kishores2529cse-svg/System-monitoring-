import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, Clock3, Flame, Search, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const catalog = [
  ['Two Sum', 'Easy', 'Arrays', '92%', 'Not Attempted', 101],
  ['Valid Parentheses', 'Easy', 'Stack', '90%', 'Solved', 101],
  ['Reverse Linked List', 'Easy', 'Linked List', '88%', 'Attempted', 101],
  ['Maximum Depth of Binary Tree', 'Easy', 'Trees', '85%', 'Not Attempted', 101],
  ['Merge Intervals', 'Medium', 'Arrays', '74%', 'Not Attempted', 101],
  ['Number of Islands', 'Medium', 'Graphs', '69%', 'Attempted', 101],
  ['Course Schedule', 'Medium', 'Graphs', '63%', 'Not Attempted', 101],
  ['Longest Increasing Subsequence', 'Medium', 'Dynamic Programming', '56%', 'Not Attempted', 101],
  ['LRU Cache', 'Hard', 'Design', '41%', 'Locked', 102],
  ['Merge K Sorted Lists', 'Hard', 'Linked List', '38%', 'Locked', 102]
].map(([title, difficulty, category, acceptance, status, problemId], index) => ({
  id: index + 1,
  title: title as string,
  difficulty: difficulty as Difficulty,
  category: category as string,
  acceptance: acceptance as string,
  status: status as string,
  problemId: problemId as number
}));

const badge: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
};

const categories = ['All', 'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Stack', 'Queue', 'SQL', 'Design'];

export const ProblemsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      catalog.filter(
        (problem) =>
          problem.title.toLowerCase().includes(query.toLowerCase()) &&
          (difficulty === 'All' || problem.difficulty === difficulty) &&
          (category === 'All' || problem.category === category)
      ),
    [query, difficulty, category]
  );

  const items = filtered.slice((page - 1) * 6, page * 6);
  const pages = Math.max(1, Math.ceil(filtered.length / 6));

  const setFilter = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent font-sans text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_310px]">
            
            {/* Main Content: Problems Table */}
            <section className="min-w-0 space-y-6">
              
              {/* Header */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl backdrop-blur-xl space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                  <Sparkles className="w-3 h-3" /> Algorithm Training Library
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Practice Problems
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Sharpen your algorithmic thinking and data structure skills in a distraction-free compiler sandbox.
                </p>
              </div>

              {/* Filters Toolbar */}
              <div className="sticky top-20 z-20 rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search problems by title, tag, or topic..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 transition"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={difficulty}
                      onChange={(e) => setFilter(setDifficulty, e.target.value)}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-sky-400"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>

                    <select
                      value={category}
                      onChange={(e) => setFilter(setCategory, e.target.value)}
                      className="max-w-44 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-sky-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
                  <div>
                    <h2 className="text-base font-bold text-white">Algorithm Challenges</h2>
                    <p className="text-xs text-slate-400">{filtered.length} challenges match your criteria</p>
                  </div>
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[850px] w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-4 pl-6">#</th>
                        <th>Problem Title</th>
                        <th>Difficulty</th>
                        <th>Category</th>
                        <th>Acceptance</th>
                        <th>Status</th>
                        <th className="p-4 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {items.map((problem) => (
                        <tr key={problem.id} className="transition hover:bg-white/[0.03]">
                          <td className="p-4 pl-6 font-mono text-slate-400">{problem.id}</td>
                          <td className="font-bold text-white hover:text-sky-300 transition">
                            <Link to={`/sandbox?problem=${problem.problemId}`}>
                              {problem.title}
                            </Link>
                          </td>
                          <td>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge[problem.difficulty]}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="text-slate-300 font-medium">{problem.category}</td>
                          <td className="text-slate-400 font-mono">{problem.acceptance}</td>
                          <td>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold font-mono ${
                                problem.status === 'Solved'
                                  ? 'text-emerald-400'
                                  : problem.status === 'Attempted'
                                  ? 'text-amber-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {problem.status === 'Solved' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                              {problem.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <Link
                              to={`/sandbox?problem=${problem.problemId}`}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#7CFF4D] px-3.5 py-1.5 text-xs font-extrabold text-[#091109] transition-all hover:bg-[#A3FF1A] hover:shadow-md hover:shadow-[#7CFF4D]/20"
                            >
                              <span>{problem.status === 'Attempted' ? 'Continue' : problem.status === 'Solved' ? 'Solve Again' : 'Solve'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {items.length === 0 && (
                  <div className="p-12 text-center text-sm text-slate-400 space-y-2">
                    <p className="font-semibold text-white">No matching practice problems found.</p>
                    <p className="text-xs text-slate-500">Try adjusting your keyword search or category filters.</p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 text-xs font-mono text-slate-400 bg-slate-950/60">
                  <span>Page {page} of {pages} ({filtered.length} total)</span>
                  <div className="flex gap-2 font-sans">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar Stats & Analytics */}
            <aside className="space-y-5">
              
              {/* Practice Progress Card */}
              <GlassCard className="border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h2 className="font-bold text-white text-sm">Practice Progress</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                    <p className="text-2xl font-extrabold font-mono text-emerald-400">24</p>
                    <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Solved</p>
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                    <p className="text-2xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="h-5 w-5 fill-amber-400 text-amber-400" /> 7
                    </p>
                    <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Day Streak</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs font-mono">
                  {[
                    ['Easy', '72%', 'bg-emerald-400', 'text-emerald-400'],
                    ['Medium', '41%', 'bg-amber-400', 'text-amber-400'],
                    ['Hard', '12%', 'bg-rose-400', 'text-rose-400']
                  ].map(([label, value, color, textColor]) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-xs">
                        <span className={textColor}>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                        <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Practice Analytics Card */}
              <GlassCard className="border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-sky-400" />
                  <h2 className="font-bold text-white text-sm">Practice Analytics</h2>
                </div>

                <div className="flex h-24 items-end gap-2 pt-2 px-1">
                  {[34, 62, 48, 74, 57, 88, 66].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t bg-gradient-to-t from-sky-600 to-[#7CFF4D] transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`Activity: ${height}%`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-mono text-center">Coding activity (last 7 days)</p>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold font-mono text-white">4h 32m</p>
                    <p className="text-[11px] text-slate-400">Total practice time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-emerald-400">94.2%</p>
                    <p className="text-[11px] text-slate-400">Avg accuracy</p>
                  </div>
                </div>
              </GlassCard>

              {/* Recently Solved List */}
              <GlassCard className="border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-sky-400" />
                  <h2 className="font-bold text-white text-sm">Recent Solved</h2>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
                  {['Valid Parentheses (Easy)', 'Binary Search (Easy)', 'Two Sum (Easy)'].map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2 rounded-xl bg-slate-950/60 p-2 border border-slate-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

            </aside>

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};


