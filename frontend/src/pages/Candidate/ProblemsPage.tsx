import React, { useState } from 'react';
import { Search, Layers, Zap } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

const problems = [
  { title: 'Binary Search Tree Traversal', difficulty: 'Medium', category: 'Data Structures' },
  { title: 'Concurrent Go Pipeline', difficulty: 'Hard', category: 'Concurrency' },
  { title: 'Sorting Stability Analysis', difficulty: 'Easy', category: 'Algorithms' }
];

const categories = ['All', 'Algorithms', 'Data Structures', 'Concurrency', 'Security'];

export const ProblemsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('All');

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selected === 'All' || problem.category === selected;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500/20 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <GlassCard className="p-8 bg-white/90 border-slate-200 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Practice problems</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sharpen your coding edge</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Access a curated problem set for algorithms, data structures, and secure assessment readiness.</p>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-slate-950 to-slate-800 text-white border-slate-900 shadow-lg">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sky-200">Practice readiness</div>
              <p className="mt-4 text-2xl font-semibold">Problem categories</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Filter by difficulty and topic to stay focused on targeted practice.</p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Recommended</p>
                  <p className="mt-2 text-lg font-semibold">Medium difficulty</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Focus</p>
                  <p className="mt-2 text-lg font-semibold">Secure exam flow</p>
                </div>
              </div>
            </GlassCard>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Search problems</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Find the right challenge</h2>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or keyword"
                    className="w-full rounded-3xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelected(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${selected === category ? 'border-sky-500 bg-sky-500/10 text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {filteredProblems.map((problem) => (
                  <div key={problem.title} className="rounded-3xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{problem.title}</p>
                        <p className="mt-2 text-sm text-slate-500">{problem.category}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">{problem.difficulty}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                      <span>Practice history</span>
                      <span>Most recent</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.3em]">
                <Layers className="h-4 w-4" />
                Problem categories
              </div>
              <div className="mt-6 grid gap-3">
                {['Algorithms', 'Data Structures', 'Concurrency', 'Security'].map((category) => (
                  <div key={category} className="rounded-3xl border border-slate-200 p-4 text-sm text-slate-700 hover:border-slate-300 transition">
                    {category}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 text-slate-500 uppercase tracking-[0.3em] text-xs"><Zap className="h-4 w-4" /> Recent practice</div>
                <p className="mt-3">Continue where you left off in problems that match your exam readiness.</p>
              </div>
            </GlassCard>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};
