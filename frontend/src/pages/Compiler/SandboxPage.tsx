import React, { useEffect, useState } from 'react';
import { ArrowLeft, Code2, Play, CheckCircle, Clock3, PauseCircle } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { PageTransition } from '../../components/ui/PageTransition';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { useExam } from '../../contexts/ExamContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { AICameraWidget } from '../../components/monitoring/AICameraWidget';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { formatTime } from '../../utils/cn';

export const SandboxPage: React.FC = () => {
  useAntiCheating(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAssessment = searchParams.has('assessment');
  const { reportViolation } = useMonitoring();
  const {
    runCode,
    submitCode,
    isRunning,
    isSubmitting,
    setCurrentProblemId,
    secondsRemaining,
    timerStatus,
    isExamExpired
  } = useExam();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedClass, setDetectedClass] = useState<string>('');

  const triggerObjectMalpractice = async (detectedClass: string = 'unauthorized object') => {
    const type = 'Forbidden Object Detected';
    const details = `Candidate was detected holding an unauthorized object (${detectedClass}) in front of the camera.`;
    
    // Log the malpractice event
    await reportViolation(type, 'Critical', -40, details, true);
    
    // Immediately redirect to the dashboard
    navigate('/dashboard');
  };

  // Handle countdown ticks and auto-redirection on timeout (SandboxPage)
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      triggerObjectMalpractice(detectedClass);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, detectedClass]);

  useEffect(() => {
    const problemId = Number(searchParams.get('problem'));
    if (problemId) setCurrentProblemId(problemId);
  }, [searchParams, setCurrentProblemId]);

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-y-auto bg-transparent text-slate-100 relative">
        {countdown !== null && (
          <div className="bg-rose-600 text-white font-sans font-extrabold text-center py-3.5 px-4 text-xs animate-pulse flex items-center justify-center gap-2 border-b border-rose-500 shadow-lg relative z-50">
            <span>⚠️</span>
            <span>
              MALPRACTICE WARNING: FORBIDDEN OBJECT ({detectedClass.toUpperCase()}) DETECTED! REDIRECTING TO DASHBOARD IN {countdown} SECONDS
            </span>
          </div>
        )}
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

            {/* Synchronized Portal Timer Readout */}
            <div className="flex items-center gap-2">
              {timerStatus === 'PAUSED' ? (
                <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 animate-pulse flex items-center">
                  <PauseCircle className="mr-1.5 inline h-4 w-4" /> Paused by Admin
                </span>
              ) : (
                <span className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold font-mono flex items-center ${
                  isExamExpired
                    ? 'border-rose-400/40 bg-rose-500/20 text-rose-300'
                    : 'border-sky-400/30 bg-sky-500/15 text-sky-200'
                }`}>
                  <Clock3 className="mr-1.5 inline h-4 w-4 text-sky-400" />
                  {isExamExpired ? '00:00 (Expired)' : formatTime(secondsRemaining)}
                </span>
              )}
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
              <GlowingButton
                variant="secondary"
                size="md"
                onClick={runCode}
                disabled={isRunning || isSubmitting}
                icon={<Play className="h-4 w-4 text-sky-600" />}
              >
                {isRunning ? 'Compiling...' : 'Run Code'}
              </GlowingButton>
              <GlowingButton
                variant="cyan"
                size="md"
                onClick={submitCode}
                disabled={isRunning || isSubmitting}
                icon={<CheckCircle className="h-4 w-4" />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Code'}
              </GlowingButton>
            </div>
          </div>
        </main>
        
        {/* Floating Proctoring Camera Widget at Top-Right (occupies ~15% screen space) */}
        <div className="fixed top-24 right-4 z-40 shadow-2xl">
          <AICameraWidget
            onInfractionChange={(infractions) => {
              if (infractions.mobile && countdown === null) {
                setDetectedClass('mobile phone');
                setCountdown(3);
              }
            }}
          />
        </div>
      </div>
    </PageTransition>
  );
};
