import React from 'react';
import { Lock, AlertTriangle, UserCheck } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { GlowingButton } from '../ui/GlowingButton';

export const LockScreenOverlay: React.FC = () => {
  const { isLocked, lockReason, unlockExam } = useMonitoring();

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/85 flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel-glow rounded-3xl p-8 border border-rose-500/30 text-center space-y-6 animate-pulse-slow shadow-2xl shadow-rose-950/50">
        
        {/* Shield Lock Icon with Radar Pulse */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500/20 opacity-75"></span>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 p-[1px] shadow-xl shadow-rose-500/40">
            <div className="w-full h-full bg-[#0E060A] rounded-[15px] flex items-center justify-center">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Lock Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Suspicious Activity Detected</h2>
          <p className="text-sm text-slate-300">
            Your assessment workspace has been strictly <span className="text-rose-400 font-semibold">PAUSED & LOCKED</span> by the CodeShield AI proctoring engine.
          </p>
        </div>

        {/* Violation Reason Box */}
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold uppercase tracking-wider text-[10px]">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Security Violation Summary
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {lockReason || 'Multiple forbidden actions detected (Tab Switch, Fullscreen exit, or Keyboard shortcut breach).'}
          </p>
        </div>

        {/* Action Status & Admin Approval Waiting Spinner */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Awaiting Administrator Authorization Code...</span>
        </div>

        {/* Admin Quick Override Option */}
        <div className="pt-2 flex flex-col gap-2">
          <GlowingButton
            variant="rose"
            size="md"
            className="w-full"
            onClick={unlockExam}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Admin Override: Unlock Assessment Session
          </GlowingButton>
          <span className="text-[10px] text-slate-500 font-mono">
            Proctor Passkey ID: ADM-SESSION-REV-094
          </span>
        </div>

      </div>
    </div>
  );
};
