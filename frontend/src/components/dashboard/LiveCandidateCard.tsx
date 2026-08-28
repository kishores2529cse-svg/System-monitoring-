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
    <div className={`rounded-2xl p-4 transition-all duration-300 relative overflow-hidden border ${
      candidate.status === 'Locked'
        ? 'bg-rose-50/90 border-rose-300 shadow-sm'
        : candidate.status === 'Warning'
        ? 'bg-amber-50/90 border-amber-300 shadow-sm'
        : 'bg-white border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md'
    }`}>
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
            {candidate.status === 'Locked' && (
              <div className="absolute inset-0 bg-rose-900/60 backdrop-blur-xs flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base tracking-tight font-serif-luxury">{candidate.name}</h4>
            <p className="text-[11px] text-slate-500 font-sans truncate max-w-[170px]">{candidate.college}</p>
          </div>
        </div>

        {/* Status Pill */}
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
          candidate.status === 'Locked'
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : candidate.status === 'Warning'
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {candidate.status}
        </span>
      </div>

      {/* Prominent Malpractice Alert Banner */}
      {(candidate.unauthorizedObjectDetected || candidate.malpracticeAlert?.includes('UNAUTHORIZED OBJECT')) ? (
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
        <div className="my-2 p-2 rounded-xl bg-amber-500/90 text-slate-950 flex items-center justify-between gap-2 shadow-sm border border-amber-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="font-mono font-bold text-[11px] tracking-tight truncate">
              FOCUS SHIFT DETECTED
            </span>
          </div>
          <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
            MediaPipe
          </span>
        </div>
      ) : null}

      {/* Sensor AI Indicators Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
        <div>
          <span className="text-slate-500 block text-[10px] font-sans">Timer Remaining</span>
          <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-600" /> {candidate.timeLeft}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-sans">AI Confidence Score</span>
          <span className={`font-mono font-bold ${confColors.text}`}>
            {candidate.confidenceScore}% Score
          </span>
        </div>
      </div>

      {/* Problem & Warnings row */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/80 pt-2.5 mb-3 font-sans">
        <span className="truncate max-w-[180px]">
          Problem: <strong className="text-slate-900 font-serif-luxury">{candidate.problem}</strong> ({candidate.language})
        </span>
        <span className="font-mono text-amber-700 font-semibold shrink-0 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> {candidate.warnings} Warns
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
          className="col-span-1 text-[11px] px-1.5 text-rose-700 hover:bg-rose-100 font-sans"
          onClick={() => onTerminate(candidate.id)}
          title="Terminate Exam Session"
        >
          End
        </GlowingButton>
      </div>

    </div>
  );
};
