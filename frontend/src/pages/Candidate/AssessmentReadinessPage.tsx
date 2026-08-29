import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CheckCircle2, Expand, LoaderCircle, ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { PageTransition } from '../../components/ui/PageTransition';

const assessmentNames: Record<string, string> = {
  '101': 'DSA Round 1 — Algorithm Assessment',
  '102': 'Java Programming & Data Structures',
  '103': 'SQL & Database Architecture Assessment'
};

export const AssessmentReadinessPage: React.FC = () => {
  const { id = '101' } = useParams();
  const navigate = useNavigate();
  const { requestFullscreen } = useMonitoring();
  const [cameraReady, setCameraReady] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const validateCamera = async () => {
    setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not supported in this browser.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setCameraReady(true);
    } catch (cameraError) {
      setError(cameraError instanceof Error ? cameraError.message : 'Allow camera and microphone permissions to continue.');
    }
  };

  const startAssessment = async () => {
    if (!cameraReady) {
      setError('Please complete the camera and microphone verification check before starting.');
      return;
    }
    setStarting(true);
    await requestFullscreen();
    navigate(`/sandbox?assessment=${id}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent px-4 py-10 font-sans text-slate-100 sm:px-6 flex items-center justify-center">
        <main className="mx-auto max-w-3xl w-full">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/60 sm:p-10 backdrop-blur-2xl ring-1 ring-white/10 space-y-7">
            
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-[#7CFF4D]/30 bg-[#7CFF4D]/10 p-3.5 text-[#7CFF4D] shrink-0 shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                  Pre-Assessment Verification
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {assessmentNames[id] ?? 'Coding Assessment'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Complete these system hardware and proctoring checks before entering the secure assessment environment. Standard navigation will be locked.
                </p>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-4">
              {/* Camera & Mic Check */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-slate-700">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-sky-400" />
                      Camera &amp; Microphone Permissions
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Required for live AI proctoring, facial landmark orientation, and audio telemetry.
                    </p>
                  </div>
                  <button
                    onClick={validateCamera}
                    type="button"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 ${
                      cameraReady
                        ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-[#7CFF4D] text-[#091109] hover:bg-[#A3FF1A]'
                    }`}
                  >
                    {cameraReady ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Verified &amp; Active</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>Verify Camera &amp; Mic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fullscreen Mode Check */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                    <Expand className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm sm:text-base font-bold text-white">
                      Mandatory Fullscreen Secure Mode
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Fullscreen mode will automatically engage when you launch the assessment. Exiting or switching windows is immediately flagged in the audit logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Rules High-Contrast Box */}
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/85 p-5 sm:p-6 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Mandatory Examination Rules &amp; Protocols</span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                <li><strong className="text-white">Zero Tab Switching:</strong> Do not navigate away, switch windows, or exit fullscreen mode.</li>
                <li><strong className="text-white">Continuous Presence:</strong> Keep your face centered in the camera viewport and remain alone in the testing space.</li>
                <li><strong className="text-white">Real-Time Telemetry:</strong> Code compilation, clipboard actions, and suspicious object detections are logged live.</li>
                <li><strong className="text-white">No Pausing:</strong> The exam timer runs continuously and cannot be paused once initiated.</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-4 text-xs font-semibold text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Navigation & Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/assessments')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Assessments
              </button>

              <button
                type="button"
                onClick={startAssessment}
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7CFF4D] hover:bg-[#A3FF1A] text-[#091109] px-7 py-3 text-sm font-extrabold shadow-lg shadow-[#7CFF4D]/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                {starting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Entering Secure Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Start Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </main>
      </div>
    </PageTransition>
  );
};


