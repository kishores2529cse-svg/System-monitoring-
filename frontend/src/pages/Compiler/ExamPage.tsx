import React, { useEffect, useState } from 'react';
import { Shield, Clock, Maximize, ChevronLeft, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExam } from '../../contexts/ExamContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { ProblemDescription } from '../../components/compiler/ProblemDescription';
import { MonacoWrapper } from '../../components/compiler/MonacoWrapper';
import { ConsoleOutput } from '../../components/compiler/ConsoleOutput';
import { AICameraWidget } from '../../components/monitoring/AICameraWidget';
import { SuspiciousTimeline } from '../../components/monitoring/SuspiciousTimeline';
import { LockScreenOverlay } from '../../components/monitoring/LockScreenOverlay';
import { SecurityViolationModal } from '../../components/monitoring/SecurityViolationModal';
import { formatTime } from '../../utils/cn';

export const ExamPage: React.FC = () => {
  const { secondsRemaining } = useExam();
  const { confidenceScore, requestFullscreen } = useMonitoring();
  const [showTimeline, setShowTimeline] = useState(false);

  // Activate Anti-Cheating System Guards
  useAntiCheating(true);

  // Automatically request fullscreen on mount
  useEffect(() => {
    requestFullscreen();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#FAFCFF] text-slate-900 flex flex-col overflow-hidden select-none font-serif-luxury">
      
      {/* Security Proctored Header */}
      <header className="h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        
        {/* Left: Brand & Problem Title */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 font-serif-luxury hidden sm:inline">Go Advanced Coding Exam</span>
            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-mono border border-sky-200 font-bold">
              PROCTOR_MODE: STRICT
            </span>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs font-mono text-sm">
          <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
          <span className="text-slate-600 text-xs font-sans">TIME REMAINING:</span>
          <span className="font-bold text-emerald-700 tracking-wider">
            {formatTime(secondsRemaining)}
          </span>
        </div>

        {/* Right: AI Score Pulse & Fullscreen Button */}
        <div className="flex items-center gap-3 font-sans">
          
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-slate-600">AI Confidence:</span>
            <span className={`font-mono font-bold ${confidenceScore >= 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {confidenceScore}%
            </span>
          </button>

          <button
            onClick={requestFullscreen}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Enter Fullscreen Secure Viewport"
          >
            <Maximize className="w-4 h-4" />
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

        {/* Floating AI Camera Widget (Fixed Bottom Right Overlay) */}
        <div className="absolute bottom-6 right-6 z-30 hidden md:block">
          <AICameraWidget isCompact={true} />
        </div>

        {/* Floating Timeline Drawer Overlay */}
        {showTimeline && (
          <div className="absolute top-4 right-4 z-40 w-80 shadow-2xl">
            <SuspiciousTimeline />
          </div>
        )}

      </div>

      {/* Security Overlay Guards */}
      <LockScreenOverlay />
      <SecurityViolationModal />

    </div>
  );
};
