import React from 'react';
import { ChevronDown, Lock, Sparkles, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../../components/ui/PageTransition';
import { GlassCard } from '../../components/ui/GlassCard';

export const CandidateDashboard: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <GlassCard glow className="p-6 border border-slate-700/60 bg-slate-950/70">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300">
                <Sparkles className="w-3 h-3" /> Assessment readiness
              </div>
              <h1 className="mt-3 text-2xl font-extrabold text-white">Permutations</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-2 text-slate-300 text-sm font-medium border border-slate-700">
              <ChevronDown className="w-4 h-4" />
              Overview
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-700/70 bg-slate-900/60 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">L5 - Practice - PS - Permutation - Level I</p>
                <p className="mt-2 text-xs text-slate-400">Opened: Friday, 3 July 2026, 10:17 PM</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 border border-slate-600">
                <Lock className="w-4 h-4 text-slate-400" /> Locked
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-800/60 p-5 border border-slate-700 text-sm leading-6 text-slate-300">
              <span className="font-semibold text-white">Not available unless:</span>
              <span className="ml-1">The activity <strong className="text-slate-100">L5 - Maths - Quiz 2</strong> is complete and passed.</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/sandbox"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Code2 className="h-4 w-4" />
                Open sandbox
              </Link>
              <Link
                to="/exam/101"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4" />
                Open exam view
              </Link>
            </div>
          </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};
