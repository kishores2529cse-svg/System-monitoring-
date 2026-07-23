import React, { useEffect } from 'react';
import { ArrowLeft, Code2, Sparkles, Play, CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { PageTransition } from '../../components/ui/PageTransition';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { useExam } from '../../contexts/ExamContext';
import { GlowingButton } from '../../components/ui/GlowingButton';

export const SandboxPage: React.FC = () => {
  useAntiCheating(true);
  const [searchParams] = useSearchParams();
  const isAssessment = searchParams.has('assessment');
  const { runCode, submitCode, isRunning, isSubmitting, setCurrentProblemId } = useExam();

  useEffect(() => {
    const problemId = Number(searchParams.get('problem'));
    if (problemId) setCurrentProblemId(problemId);
  }, [searchParams, setCurrentProblemId]);

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-y-auto bg-transparent text-slate-100">
        <header className="border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to={isAssessment ? '/assessments' : '/dashboard'}
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
                    {isAssessment ? 'Secure Assessment Sandbox' : 'HackerRank-style Sandbox'}
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                      {isAssessment ? 'Assessment mode' : 'Practice mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Solve questions, compile code, and inspect test output in one secure workspace.</p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 md:flex">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Auto-save is live
            </div>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col gap-3 p-3 pb-24 lg:p-4 lg:pb-24">
          <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="min-h-[420px] lg:col-span-5">
              <ProblemDescription />
            </div>

            <div className="flex min-h-[700px] flex-col gap-3 lg:col-span-7">
              <div className="min-h-[480px] flex-1">
                <MonacoWrapper />
              </div>
              <div className="h-56 shrink-0">
                <ConsoleOutput />
              </div>
            </div>
          </div>
          <div className="sticky bottom-4 z-10 flex justify-end pt-2">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-xl backdrop-blur-xl">
              <GlowingButton variant="secondary" size="md" onClick={runCode} disabled={isRunning || isSubmitting} icon={<Play className="h-4 w-4 text-sky-600" />}>
                {isRunning ? 'Compiling...' : 'Run Code'}
              </GlowingButton>
              <GlowingButton variant="cyan" size="md" onClick={submitCode} disabled={isRunning || isSubmitting} icon={<CheckCircle className="h-4 w-4" />}>
                {isSubmitting ? 'Submitting...' : 'Submit Code'}
              </GlowingButton>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};
