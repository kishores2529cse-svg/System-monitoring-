import React, { useState } from 'react';
import { X, ShieldAlert, Camera, FileCode } from 'lucide-react';
import type { CandidateCardData, MonitoringEvent } from '../../types';
import { getConfidenceColor, getSeverityBadge } from '../../utils/cn';
import { GlowingButton } from '../ui/GlowingButton';

interface CandidateDetailModalProps {
  candidate: CandidateCardData | null;
  events: MonitoringEvent[];
  onClose: () => void;
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onExtend: (id: string) => void;
  onTerminate: (id: string) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  events,
  onClose,
  onLock,
  onUnlock,
  onExtend
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'events' | 'code' | 'logs'>('stream');

  if (!candidate) return null;

  const candidateEvents = events.filter(e => e.candidateId === candidate.id || e.candidateName === candidate.name);
  const confColors = getConfidenceColor(candidate.confidenceScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-0 my-8 font-serif-luxury">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={candidate.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg font-serif-luxury">{candidate.name}</h3>
                <span className="text-xs font-mono text-sky-700 font-bold">({candidate.id})</span>
              </div>
              <p className="text-xs text-slate-500 font-sans">{candidate.college} • {candidate.department}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 py-2 font-sans">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stream' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Surveillance Feed & Telemetry
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'events' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Violation History ({candidateEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'code' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              Current Code Inspector
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {candidate.status === 'Locked' ? (
              <GlowingButton variant="emerald" size="sm" onClick={() => onUnlock(candidate.id)}>
                Unlock
              </GlowingButton>
            ) : (
              <GlowingButton variant="rose" size="sm" onClick={() => onLock(candidate.id)}>
                Lock User
              </GlowingButton>
            )}
            <GlowingButton variant="secondary" size="sm" className="text-xs" onClick={() => onExtend(candidate.id)}>
              +15m
            </GlowingButton>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {activeTab === 'stream' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Live Feed Simulator */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-serif-luxury">AI Vision Stream</h4>
                <div className="relative w-full h-56 rounded-2xl bg-slate-900 overflow-hidden border border-slate-300 flex items-center justify-center shadow-inner">
                  <img
                    src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt="Stream"
                    className="w-full h-full object-cover"
                  />
                  {/* Bounding box */}
                  <div className="absolute inset-8 border-2 border-sky-400 rounded-xl pointer-events-none flex items-start justify-between p-2">
                    <span className="text-[10px] font-mono bg-sky-600 text-white px-1.5 py-0.5 rounded font-bold">
                      FACE_ID: VERIFIED
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                      EYE_LOCK: 99.4%
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Telemetry Metrics */}
              <div className="space-y-3 font-sans">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-serif-luxury">Proctor Telemetry</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">AI Confidence Score:</span>
                    <span className={`font-mono font-bold ${confColors.text}`}>{candidate.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="h-full rounded-full bg-sky-600" style={{ width: `${candidate.confidenceScore}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Timer Remaining</span>
                      <span className="text-slate-900 font-bold">{candidate.timeLeft}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Warnings Issued</span>
                      <span className="text-amber-700 font-bold">{candidate.warnings} / 3</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3 font-sans">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-serif-luxury">Flagged Proctor Events Timeline</h4>
              <div className="space-y-2">
                {candidateEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No proctor violations logged for this candidate.</p>
                ) : (
                  candidateEvents.map(e => {
                    const isUnauthObj = e.event.includes('UNAUTHORIZED OBJECT DETECTED') || e.event.includes('Mobile Phone');
                    const isFocusShift = e.event.includes('Focus Shift') || e.event.includes('Turned Around');

                    return (
                      <div
                        key={e.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs shadow-2xs transition-all ${
                          isUnauthObj
                            ? 'bg-rose-50/90 border-rose-400 text-rose-950 ring-1 ring-rose-400/30'
                            : isFocusShift
                            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold font-serif-luxury text-sm ${isUnauthObj ? 'text-rose-700 font-mono font-black' : 'text-slate-900'}`}>
                              {e.event}
                            </span>
                            {isUnauthObj && (
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-mono font-bold tracking-wider uppercase animate-pulse">
                                YOLOv8-N Malpractice Flag
                              </span>
                            )}
                            {isFocusShift && (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-bold tracking-wider uppercase">
                                MediaPipe Face Landmark Flag
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{e.details}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${getSeverityBadge(e.severity)}`}>
                            {e.severity}
                          </span>
                          <div className="font-mono text-[10px] text-slate-500 mt-1">{e.timestamp}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-serif-luxury">Live Buffer Inspector ({candidate.language})</h4>
              <pre className="p-4 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                {candidate.codeSnippet || '// Candidate code snippet sync in progress...'}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
