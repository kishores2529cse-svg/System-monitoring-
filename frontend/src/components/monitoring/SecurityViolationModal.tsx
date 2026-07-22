import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { GlowingButton } from '../ui/GlowingButton';

export const SecurityViolationModal: React.FC = () => {
  const { activeWarningModal, dismissWarningModal } = useMonitoring();

  if (!activeWarningModal?.open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-amber-500/40 text-center space-y-4 animate-in fade-in zoom-in duration-200">
        
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight">{activeWarningModal.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeWarningModal.message}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 text-left font-mono">
          ⚠️ Notice: Security proctoring telemetry will permanently flag this action in the official audit log.
        </div>

        <div className="pt-2">
          <GlowingButton
            variant="cyan"
            size="md"
            className="w-full"
            onClick={dismissWarningModal}
          >
            I Acknowledge & Return to Exam
          </GlowingButton>
        </div>

      </div>
    </div>
  );
};
