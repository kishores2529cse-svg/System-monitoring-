import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CheckCircle2, Expand, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';

const assessmentNames: Record<string, string> = { '101': 'DSA Round 1', '102': 'Java Programming Assessment', '103': 'SQL Fundamentals Assessment' };

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
    if (!cameraReady) { setError('Complete the camera and microphone check before starting.'); return; }
    setStarting(true);
    await requestFullscreen();
    navigate(`/sandbox?assessment=${id}`);
  };

  return <div className="min-h-screen bg-premium-light px-4 py-10 font-sans text-slate-900 sm:px-6"><main className="mx-auto max-w-3xl"><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10"><div className="flex items-center gap-3"><span className="rounded-2xl bg-sky-50 p-3 text-sky-700"><ShieldCheck className="h-7 w-7" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Assessment readiness</p><h1 className="mt-1 text-2xl font-semibold">{assessmentNames[id] ?? 'Coding Assessment'}</h1></div></div><p className="mt-6 text-sm leading-6 text-slate-600">Complete these checks before you enter the secure assessment environment. The normal navigation bar will be hidden during the examination.</p><div className="mt-8 space-y-4"><div className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Camera and microphone permission</h2><p className="mt-1 text-sm text-slate-500">Required for AI proctoring and evidence collection.</p></div><button onClick={validateCamera} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${cameraReady ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-950 text-white'}`}>{cameraReady ? <><CheckCircle2 className="h-4 w-4" />Verified</> : <><Camera className="h-4 w-4" />Check camera</>}</button></div></div><div className="rounded-2xl border border-slate-200 p-5"><div className="flex items-center gap-3"><Expand className="h-5 w-5 text-sky-600" /><div><h2 className="font-semibold">Fullscreen secure mode</h2><p className="mt-1 text-sm text-slate-500">Fullscreen is requested when you click Start Assessment. Exiting it is logged as a security event.</p></div></div></div></div><div className="mt-8 rounded-2xl bg-premium-light p-5 text-sm text-slate-600"><h2 className="font-semibold text-slate-900">Assessment rules</h2><ul className="mt-3 list-disc space-y-2 pl-5"><li>Do not switch tabs, exit fullscreen, or use copy/paste.</li><li>Keep your face visible and remain alone throughout the assessment.</li><li>The timer starts immediately and cannot be paused.</li><li>All questions, activity events, and risk signals are recorded.</li></ul></div>{error && <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>}<div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => navigate('/assessments')} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600">Back to assessments</button><button onClick={startAssessment} disabled={starting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{starting && <LoaderCircle className="h-4 w-4 animate-spin" />}Start Assessment</button></div></div></main></div>;
};

