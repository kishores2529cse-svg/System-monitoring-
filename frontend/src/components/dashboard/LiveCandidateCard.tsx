import React from 'react';
import { Lock, Clock, AlertTriangle } from 'lucide-react';
import type { CandidateCardData } from '../../types';
import { getConfidenceColor } from '../../utils/cn';
import { GlowingButton } from '../ui/GlowingButton';

interface LiveCandidateCardProps {
  candidate: CandidateCardData;
  onViewDetails: (c: CandidateCardData) => void;
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onExtend: (id: string) => void;
  onTerminate: (id: string) => void;
}

export const LiveCandidateCard: React.FC<LiveCandidateCardProps> = ({
  candidate,
  onViewDetails,
  onLock,
  onUnlock,
  onExtend,
  onTerminate
}) => {
  const confColors = getConfidenceColor(candidate.confidenceScore);

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 relative overflow-hidden border font-sans ${
        candidate.status === 'Locked'
          ? 'bg-rose-950/70 border-rose-500/50 shadow-xl shadow-rose-950/30'
          : candidate.status === 'Warning'
          ? 'bg-amber-950/70 border-amber-500/50 shadow-xl shadow-amber-950/30'
          : 'bg-slate-900/90 border-slate-800 hover:border-sky-400/40 shadow-lg'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow-sm">
            <img
              src={
                candidate.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
            {candidate.status === 'Locked' && (
              <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-xs flex items-center justify-center">
                <Lock className="w-5 h-5 text-rose-400" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-white text-base tracking-tight truncate">{candidate.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{candidate.college}</p>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${
            candidate.status === 'Locked'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : candidate.status === 'Warning'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {candidate.status}
        </span>
      </div>

      {/* Prominent Malpractice Alert Banner */}
      {candidate.unauthorizedObjectDetected || candidate.malpracticeAlert?.includes('UNAUTHORIZED OBJECT') ? (
        <div className="my-2 p-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white flex items-center justify-between gap-2 shadow-md animate-pulse border border-rose-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-white shrink-0 animate-bounce" />
            <span className="font-mono font-black text-[11px] tracking-tight truncate">
              UNAUTHORIZED OBJECT DETECTED!!!
            </span>
          </div>
          <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
            YOLOv8-N
          </span>
        </div>
      ) : candidate.focusShiftDetected ? (
        <div className="my-2 p-2 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-between gap-2 shadow-sm border border-amber-500/40">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono font-bold text-[11px] tracking-tight truncate">
              FOCUS SHIFT DETECTED
            </span>
          </div>
          <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
            MediaPipe
          </span>
        </div>
      ) : null}

      {/* Sensor AI Indicators Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">Timer Remaining</span>
          <span className="font-mono font-bold text-white flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> {candidate.timeLeft}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">AI Trust Score</span>
          <span className={`font-mono font-bold block mt-0.5 ${confColors.text}`}>
            {candidate.confidenceScore}% Trust
          </span>
        </div>
      </div>

      {/* Problem & Warnings row */}
      <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-2.5 mb-3 font-mono">
        <span className="truncate max-w-[180px]">
          Problem: <strong className="text-white font-bold">{candidate.problem}</strong>
        </span>
        <span className="text-amber-400 font-bold shrink-0 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {candidate.warnings} Warns
        </span>
      </div>

      {/* Action Control Buttons */}
      <div className="grid grid-cols-4 gap-1.5 pt-1">
        <GlowingButton
          variant="secondary"
          size="sm"
          className="col-span-1 text-[11px] px-1.5 font-sans"
          onClick={() => onViewDetails(candidate)}
          title="View Details & Telemetry"
        >
          View
        </GlowingButton>

        {candidate.status === 'Locked' ? (
          <GlowingButton
            variant="emerald"
            size="sm"
            className="col-span-1 text-[11px] px-1.5 font-sans"
            onClick={() => onUnlock(candidate.id)}
            title="Unlock Candidate"
          >
            Unlock
          </GlowingButton>
        ) : (
          <GlowingButton
            variant="rose"
            size="sm"
            className="col-span-1 text-[11px] px-1.5 font-sans"
            onClick={() => onLock(candidate.id)}
            title="Lock Session"
          >
            Lock
          </GlowingButton>
        )}

        <GlowingButton
          variant="secondary"
          size="sm"
          className="col-span-1 text-[11px] px-1.5 font-sans"
          onClick={() => onExtend(candidate.id)}
          title="Extend Exam Time (+15m)"
        >
          +15m
        </GlowingButton>

        <GlowingButton
          variant="ghost"
          size="sm"
          className="col-span-1 text-[11px] px-1.5 text-rose-400 hover:bg-rose-500/20 font-sans"
          onClick={() => onTerminate(candidate.id)}
          title="Terminate Exam Session"
        >
          End
        </GlowingButton>
      </div>

    </div>
  );
};

