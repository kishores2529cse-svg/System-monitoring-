import React, { useEffect } from 'react';
import { Shield, Camera, Monitor, Clock3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../contexts/ExamContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { LockScreenOverlay } from '../../components/monitoring/LockScreenOverlay';
import { FullscreenOverlay } from '../../components/monitoring/FullscreenOverlay';
import { SecurityViolationModal } from '../../components/monitoring/SecurityViolationModal';
import { formatTime } from '../../utils/cn';

export const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const { problems, currentProblem, secondsRemaining } = useExam();
  const { riskScore, requestFullscreen, cameraActive, isFullscreen } = useMonitoring();

  useAntiCheating(true);

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

  const handleExitAssessment = () => {
    const confirmed = window.confirm('Exit assessment? Your current session progress may be lost.');
    if (confirmed) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-screen bg-transparent text-slate-900 flex flex-col overflow-hidden select-none font-serif-luxury">
      <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950/5 border border-slate-200 text-slate-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">🔒 Secure Assessment Mode</p>
            <p className="text-xs text-slate-500">Minimal header, locked navigation, distraction-free exam.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">{currentProblem ? `Question ${currentProblem.id} of ${problems.length}` : 'Question in progress'}</span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{formatTime(secondsRemaining)}</span>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Risk {riskScore}%</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"><Camera className="mr-1 inline h-3.5 w-3.5" />{cameraActive ? 'Webcam On' : 'Webcam Off'}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"><Monitor className="mr-1 inline h-3.5 w-3.5" />{isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
          <button
            onClick={handleExitAssessment}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit Assessment
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden relative">
        <div className="lg:col-span-5 h-full overflow-hidden">
          <ProblemDescription />
        </div>

        <div className="lg:col-span-7 h-full flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 min-h-[350px]">
            <MonacoWrapper />
          </div>
          <div className="h-56 shrink-0">
            <ConsoleOutput />
          </div>
        </div>
      </div>

      <LockScreenOverlay />
      <FullscreenOverlay />
      <SecurityViolationModal />
    </div>
  );
};
