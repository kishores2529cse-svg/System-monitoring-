import React from 'react';
import { ArrowLeft, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { PageTransition } from '../../components/ui/PageTransition';
import { useAntiCheating } from '../../hooks/useAntiCheating';

export const SandboxPage: React.FC = () => {
  useAntiCheating(true);

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100">
        <header className="border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                  <Code2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    HackerRank-style Sandbox
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                      Practice mode
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Solve problems, run code, and inspect test output in one polished workspace.</p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 md:flex">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Auto-save is live
            </div>
          </div>
        </header>

        <main className="mx-auto flex h-[calc(100vh-73px)] max-w-7xl flex-col gap-3 p-3 lg:p-4">
          <div className="grid h-full flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="h-full lg:col-span-5">
              <ProblemDescription />
            </div>

            <div className="flex h-full flex-col gap-3 lg:col-span-7">
              <div className="min-h-[320px] flex-1">
                <MonacoWrapper />
              </div>
              <div className="h-56 shrink-0">
                <ConsoleOutput />
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};
