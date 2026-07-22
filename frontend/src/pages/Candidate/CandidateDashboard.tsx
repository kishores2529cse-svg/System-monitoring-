import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../../components/ui/PageTransition';
import { GlassCard } from '../../components/ui/GlassCard';

export const CandidateDashboard: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-2xl">
          <GlassCard glow className="p-8 border border-slate-700/60 bg-slate-950/80 shadow-2xl shadow-slate-950/40">
            <div className="space-y-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200 shadow-sm shadow-emerald-500/10">
                <Sparkles className="w-4 h-4" /> Assessment Readiness
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Permutations</h1>
                <p className="mx-auto max-w-xl text-sm leading-7 text-slate-300">
                  Your secure assessment begins immediately. Focus only on the exam, with no secondary actions or distractions.
                </p>
              </div>
              <Link
                to="/exam/101"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400/15 px-8 py-4 text-lg font-semibold text-emerald-100 border border-emerald-400/30 shadow-xl shadow-emerald-500/10 transition hover:bg-emerald-400/20"
              >
                <Sparkles className="w-5 h-5" />
                Start Assessment
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};
