import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { getSeverityBadge } from '../../utils/cn';

export const SuspiciousTimeline: React.FC = () => {
  const { events } = useMonitoring();

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          Proctoring Audit Log
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          {events.length} Events Logged
        </span>
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No suspicious activity detected. Candidate telemetry is clear.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {evt.severity === 'Critical' || evt.severity === 'High' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-200 flex items-center gap-2">
                    <span>{evt.event}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getSeverityBadge(evt.severity)}`}>
                      {evt.severity}
                    </span>
                  </div>
                  {evt.details && (
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{evt.details}</p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {evt.timestamp}
                </div>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    evt.confidenceImpact < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {evt.confidenceImpact > 0 ? `+${evt.confidenceImpact}%` : `${evt.confidenceImpact}%`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
