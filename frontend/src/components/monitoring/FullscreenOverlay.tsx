import React from 'react';
import { Monitor, AlertTriangle } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { useExam } from '../../contexts/ExamContext';
import { GlowingButton } from '../ui/GlowingButton';

export const FullscreenOverlay: React.FC = () => {
  const { isFullscreen, isLocked, requestFullscreen } = useMonitoring();
  const { isSubmittedSuccessfully } = useExam();

  // Do not display if fullscreen is active, the exam is permanently locked, or it has been submitted
  if (isFullscreen || isLocked || isSubmittedSuccessfully) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/85 flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel-glow rounded-3xl p-8 border border-amber-500/30 text-center space-y-6 animate-pulse-slow shadow-2xl shadow-amber-950/50">
        
        {/* Monitor Lock Icon with Radar Pulse */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500/20 opacity-75"></span>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 p-[1px] shadow-xl shadow-amber-500/40">
            <div className="w-full h-full bg-[#0E060A] rounded-[15px] flex items-center justify-center">
              <Monitor className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Warning Title & Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Fullscreen Required</h2>
          <p className="text-sm text-slate-300">
            Fullscreen mode is mandatory. Please click <span className="text-amber-400 font-semibold">'Resume Exam'</span> to re-enter fullscreen.
          </p>
        </div>

        {/* Informational warning block */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider text-[10px]">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Security Warning
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            Exiting fullscreen mode is flagged as a malpractice event. Repeated exits will result in an automatic exam session lock requiring administrator unlock.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <GlowingButton
            variant="purple"
            size="md"
            className="w-full"
            onClick={requestFullscreen}
          >
            Resume Exam
          </GlowingButton>
        </div>

      </div>
    </div>
  );
};
