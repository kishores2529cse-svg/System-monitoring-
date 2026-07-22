import React, { useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { LockScreenOverlay } from '../../components/monitoring/LockScreenOverlay';
import { SecurityViolationModal } from '../../components/monitoring/SecurityViolationModal';
import { formatTime } from '../../utils/cn';

export const ExamPage: React.FC = () => {
  const { problems, currentProblem, secondsRemaining } = useExam();
  const { riskScore, requestFullscreen } = useMonitoring();

  // Activate Anti-Cheating System Guards
  useAntiCheating(true);

  // Automatically request fullscreen on mount
  useEffect(() => {
    requestFullscreen();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#FAFCFF] text-slate-900 flex flex-col overflow-hidden select-none font-serif-luxury">
      
      {/* Security Proctored Header */}
      <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 border border-emerald-400/20 text-emerald-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Secure Assessment Mode Active</p>
            <p className="text-xs text-slate-500">Full-screen enforced · copy/paste locked · exam focus protected</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 text-xs font-semibold">
            {currentProblem ? `Problem ${currentProblem.id} of ${problems.length}` : 'Exam in progress'}
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 text-xs font-semibold">
            {formatTime(secondsRemaining)}
          </div>
          <div className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-rose-700 text-xs font-semibold">
            Risk Score: {riskScore}%
          </div>
          <button
            onClick={requestFullscreen}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 text-xs font-semibold transition hover:bg-slate-100"
            title="Re-enter Fullscreen"
          >
            Enforce Fullscreen
          </button>
        </div>
      </header>

      {/* Main Resizable Grid Panels Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden relative">
        
        {/* Left Panel: Problem Statement (5 Cols) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <ProblemDescription />
        </div>

        {/* Right Panel: Monaco Editor & Console Split (7 Cols) */}
        <div className="lg:col-span-7 h-full flex flex-col gap-3 overflow-hidden">
          
          {/* Top: Monaco Editor Workspace */}
          <div className="flex-1 min-h-[350px]">
            <MonacoWrapper />
          </div>

          {/* Bottom: Execution Console & Test Cases */}
          <div className="h-56 shrink-0">
            <ConsoleOutput />
          </div>

        </div>

      </div>

      {/* Security Overlay Guards */}
      <LockScreenOverlay />
      <SecurityViolationModal />

    </div>
  );
};
