import React, { useEffect, useState } from 'react';
import { Shield, Camera, Monitor, Clock3, LogOut, PauseCircle, Play, CheckCircle } from 'lucide-react';
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
import { ExamPasswordGateModal } from '../../components/monitoring/ExamPasswordGateModal';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { formatTime } from '../../utils/cn';

import { AICameraWidget } from '../../components/monitoring/AICameraWidget';

export const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const { problems, currentProblem, secondsRemaining, timerStatus, isExamExpired, runCode, submitCode, isRunning, isSubmitting } = useExam();
  const { riskScore, requestFullscreen, cameraActive, isFullscreen, reportViolation } = useMonitoring();
  const [isExamUnlocked, setIsExamUnlocked] = useState<boolean>(false);
  const [infractions, setInfractions] = useState<{ mobile: boolean; turnedAround: boolean; unauthorizedObject?: boolean; objectName?: string; focusShift?: boolean }>({ mobile: false, turnedAround: false });
  const [countdown, setCountdown] = useState<number | null>(null);

  useAntiCheating(true);

  // Monitor infractions and start countdown
  useEffect(() => {
    if (infractions.mobile || infractions.unauthorizedObject) {
      if (countdown === null) {
        setCountdown(3); // 3 seconds warning for unauthorized object
      }
    } else if (infractions.turnedAround || infractions.focusShift) {
      if (countdown === null) {
        setCountdown(6); // 6 seconds warning for focus shift
      }
    } else {
      setCountdown(null);
    }
  }, [infractions, countdown]);

  // Handle countdown ticks and auto-redirection on timeout
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      const isObject = infractions.mobile || infractions.unauthorizedObject;
      const type = isObject ? 'UNAUTHORIZED OBJECT DETECTED!!!' : 'Focus Shift Detected (MediaPipe Face Landmark)';
      const desc = isObject
        ? `Candidate was detected using an unauthorized object (${infractions.objectName || 'cell phone'}) during proctored exam via YOLOv8-Nano.`
        : 'Candidate shifted gaze/focus away from the exam viewport via MediaPipe Face Landmark analysis.';
      
      const triggerRedirect = async () => {
        await reportViolation(type, 'Critical', -35, desc, true);
        setIsExamUnlocked(false);
        navigate('/dashboard');
      };

      triggerRedirect();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, infractions, navigate, reportViolation]);

  useEffect(() => {
    if (isExamUnlocked) {
      requestFullscreen();
    }
  }, [isExamUnlocked, requestFullscreen]);

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
      setIsExamUnlocked(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-screen bg-transparent text-slate-900 flex flex-col overflow-hidden select-none font-serif-luxury relative">
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
          <span className="rounded-full border border-slate-200 bg-premium-light px-3 py-2 text-xs font-semibold text-slate-700">
            {currentProblem ? `Question ${currentProblem.id} of ${problems.length}` : 'Question in progress'}
          </span>

          {/* Synchronized Timer Readout */}
          {timerStatus === 'PAUSED' ? (
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 animate-pulse flex items-center">
              <PauseCircle className="mr-1 inline h-3.5 w-3.5" /> Paused by Admin
            </span>
          ) : (
            <span className={`rounded-full border px-3 py-2 text-xs font-semibold font-mono flex items-center ${
              isExamExpired
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-sky-200 bg-sky-50 text-sky-700'
            }`}>
              <Clock3 className="mr-1 inline h-3.5 w-3.5" />
              {isExamExpired ? '00:00 (Time Expired)' : formatTime(secondsRemaining)}
            </span>
          )}

          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Risk {riskScore}%</span>
          <span className="rounded-full border border-slate-200 bg-premium-light px-3 py-2 text-xs font-semibold text-slate-700">
            <Camera className="mr-1 inline h-3.5 w-3.5" />{cameraActive ? 'Webcam On' : 'Webcam Off'}
          </span>
          <span className="rounded-full border border-slate-200 bg-premium-light px-3 py-2 text-xs font-semibold text-slate-700">
            <Monitor className="mr-1 inline h-3.5 w-3.5" />{isFullscreen ? 'Fullscreen' : 'Windowed'}
          </span>
          <button
            onClick={handleExitAssessment}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit Assessment
          </button>
        </div>
      </header>

      {countdown !== null && (
        <div className="bg-rose-600 text-white font-bold py-2 px-4 text-center text-xs tracking-wider animate-pulse flex items-center justify-center gap-2 shrink-0 border-b border-rose-700 z-50">
          <span className="text-lg">⚠️</span>
          <span>
            MALPRACTICE WARNING: {infractions.mobile ? 'MOBILE PHONE' : 'LOOK AWAY'} DETECTED! 
            REDIRECTING TO DASHBOARD IN <span className="font-mono text-sm underline px-1">{countdown}</span> SECONDS.
          </span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden relative">
        <div className="lg:col-span-5 h-full overflow-hidden">
          <ProblemDescription />
        </div>

        <div className="lg:col-span-7 h-full flex flex-col gap-3 overflow-hidden relative">
          <div className="flex-1 min-h-[350px]">
            <MonacoWrapper />
          </div>
          <div className="h-56 shrink-0 relative">
            <ConsoleOutput />
            {/* Embedded Action Bar */}
            <div className="absolute right-3 top-2.5 z-10 flex items-center gap-2">
              <GlowingButton
                variant="secondary"
                size="sm"
                onClick={runCode}
                disabled={isRunning || isSubmitting || !isExamUnlocked}
                icon={<Play className="h-3.5 w-3.5 text-sky-600" />}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </GlowingButton>
              <GlowingButton
                variant="cyan"
                size="sm"
                onClick={submitCode}
                disabled={isRunning || isSubmitting || !isExamUnlocked}
                icon={<CheckCircle className="h-3.5 w-3.5" />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Code'}
              </GlowingButton>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Examination Re-Entry Security Password Gate */}
      <ExamPasswordGateModal
        isOpen={!isExamUnlocked}
        onSuccess={() => setIsExamUnlocked(true)}
      />

      {isExamUnlocked && (
        <>
          <LockScreenOverlay />
          <FullscreenOverlay />
          <SecurityViolationModal />
          <div className="fixed top-24 right-4 z-40 shadow-2xl">
            <AICameraWidget
              onInfractionChange={setInfractions}
            />
          </div>
        </>
      )}
    </div>
  );
};
