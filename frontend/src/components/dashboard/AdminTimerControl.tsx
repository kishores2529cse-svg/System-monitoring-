import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, StopCircle, Settings2, ShieldCheck, Plus, Lock, KeyRound } from 'lucide-react';
import { api } from '../../api/client';
import { formatTime } from '../../utils/cn';

export const AdminTimerControl: React.FC = () => {
  const [timerState, setTimerState] = useState<{
    id: number;
    duration_minutes: number;
    duration_seconds?: number;
    exam_password?: string;
    status: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'ENDED';
    remaining_seconds: number;
    total_duration_seconds: number;
  }>({
    id: 1,
    duration_minutes: 60,
    duration_seconds: 0,
    exam_password: 'exam123',
    status: 'NOT_STARTED',
    remaining_seconds: 3600,
    total_duration_seconds: 3600
  });

  const [inputMinutes, setInputMinutes] = useState<number>(60);
  const [inputSeconds, setInputSeconds] = useState<number>(0);
  const [inputPassword, setInputPassword] = useState<string>('exam123');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      const res = await api.timer.getStatus();
      if (res) {
        setTimerState(res);
        if (res.exam_password) {
          setInputPassword(res.exam_password);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleConfig = async (mins: number, secs: number, pwd?: string) => {
    setLoading(true);
    try {
      const targetPwd = pwd !== undefined ? pwd : inputPassword;
      const res = await api.timer.config(mins, secs, targetPwd);
      if (res) {
        fetchStatus();
        setShowPasswordSuccess(true);
        setTimeout(() => setShowPasswordSuccess(false), 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await api.timer.start();
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await api.timer.pause();
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await api.timer.resume();
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (mins: number, secs: number) => {
    setLoading(true);
    try {
      await api.timer.extend(mins, secs);
      fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (window.confirm('Are you sure you want to end the exam for ALL candidates immediately?')) {
      setLoading(true);
      try {
        await api.timer.end();
        fetchStatus();
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = () => {
    switch (timerState.status) {
      case 'RUNNING':
        return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 animate-pulse"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Active Assessment</span>;
      case 'PAUSED':
        return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-400"></span>Paused</span>;
      case 'ENDED':
        return <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400"><span className="h-2 w-2 rounded-full bg-rose-400"></span>Assessment Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400"><span className="h-2 w-2 rounded-full bg-cyan-400"></span>Not Started</span>;
    }
  };

  const presets = [
    { label: '30s', mins: 0, secs: 30 },
    { label: '1m', mins: 1, secs: 0 },
    { label: '5m', mins: 5, secs: 0 },
    { label: '30m', mins: 30, secs: 0 },
    { label: '60m', mins: 60, secs: 0 },
    { label: '90m', mins: 90, secs: 0 },
    { label: '120m', mins: 120, secs: 0 }
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c160c] via-[#091109] to-[#040804] p-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7CFF4D]/30 bg-[#173013] text-[#7CFF4D] shadow-inner">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Centralized Faculty Exam Timer &amp; Security</h2>
              {getStatusBadge()}
            </div>
            <p className="mt-0.5 text-xs text-slate-400">Customize duration (Mins &amp; Secs) and set Exam Access Password for formal examination re-entry.</p>
          </div>
        </div>

        {/* Live Synchronized Timer Readout for Admin */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl px-5 py-3">
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Remaining Time</div>
            <div className="font-mono text-2xl font-bold tracking-wider text-[#7CFF4D]">
              {formatTime(timerState.remaining_seconds)}
            </div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-left">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Configured</div>
            <div className="text-sm font-mono font-semibold text-white">
              {formatTime(timerState.total_duration_seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preset & Custom Duration Config (Minutes + Seconds) */}
        <div className="lg:col-span-6 space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-[#7CFF4D]" />
              Duration Setup (Minutes &amp; Seconds)
            </label>
            <span className="text-[11px] text-slate-400">Faculty Admin</span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                disabled={loading || timerState.status === 'RUNNING'}
                onClick={() => {
                  setInputMinutes(p.mins);
                  setInputSeconds(p.secs);
                  handleConfig(p.mins, p.secs);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold font-mono transition ${
                  timerState.total_duration_seconds === p.mins * 60 + p.secs
                    ? 'border border-[#7CFF4D] bg-[#7CFF4D]/20 text-[#7CFF4D]'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Precision Minutes & Seconds Inputs */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="300"
                disabled={loading || timerState.status === 'RUNNING'}
                value={inputMinutes}
                onChange={(e) => setInputMinutes(Math.max(0, Number(e.target.value)))}
                placeholder="Mins"
                className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#7CFF4D]/60 disabled:opacity-50"
              />
              <span className="text-xs font-semibold text-slate-400">m</span>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="59"
                disabled={loading || timerState.status === 'RUNNING'}
                value={inputSeconds}
                onChange={(e) => setInputSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                placeholder="Secs"
                className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#7CFF4D]/60 disabled:opacity-50"
              />
              <span className="text-xs font-semibold text-slate-400">s</span>
            </div>

            <button
              disabled={loading || timerState.status === 'RUNNING'}
              onClick={() => handleConfig(inputMinutes, inputSeconds)}
              className="rounded-xl border border-[#7CFF4D]/30 bg-[#173013] px-3.5 py-2 text-xs font-semibold text-[#dfffd2] transition hover:bg-[#1f4219] disabled:opacity-50"
            >
              Apply Time
            </button>
          </div>

          {/* Exam Password Setup Card for Formal Assessment Re-entry */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                Exam Access Password (Formal Exams Only)
              </label>
              {showPasswordSuccess && (
                <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">Password Updated!</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Set exam access password"
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-400/60"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => handleConfig(inputMinutes, inputSeconds, inputPassword)}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50 shrink-0"
              >
                Save Passcode
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Candidates entering or re-entering formal exams (/exam) must provide this exact passcode. Practice problems (/sandbox) will not prompt for a password.
            </p>
          </div>
        </div>

        {/* Global Timer Actions & Precision Extensions */}
        <div className="lg:col-span-6 space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#7CFF4D]" />
              Live Controls &amp; Extensions
            </span>
            <span className="text-[11px] font-mono text-[#7CFF4D]">Applies to all problems</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {timerState.status === 'NOT_STARTED' && (
              <button
                disabled={loading}
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/30"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Assessment Timer
              </button>
            )}

            {timerState.status === 'RUNNING' && (
              <button
                disabled={loading}
                onClick={handlePause}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/20 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/30"
              >
                <Pause className="h-4 w-4 fill-current" />
                Pause Assessment
              </button>
            )}

            {(timerState.status === 'PAUSED' || timerState.status === 'NOT_STARTED') && timerState.status !== 'NOT_STARTED' && (
              <button
                disabled={loading}
                onClick={handleResume}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/30"
              >
                <RotateCcw className="h-4 w-4" />
                Resume Assessment
              </button>
            )}

            {/* Precision Extension buttons */}
            <div className="flex items-center gap-1">
              {[
                { label: '+30s', m: 0, s: 30 },
                { label: '+1m', m: 1, s: 0 },
                { label: '+5m', m: 5, s: 0 },
                { label: '+10m', m: 10, s: 0 }
              ].map((ext) => (
                <button
                  key={ext.label}
                  disabled={loading}
                  onClick={() => handleExtend(ext.m, ext.s)}
                  className="inline-flex items-center rounded-xl border border-sky-500/30 bg-sky-500/10 px-2.5 py-2 text-xs font-semibold font-mono text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-50"
                  title={`Add ${ext.label}`}
                >
                  <Plus className="h-3 w-3 mr-0.5" />
                  {ext.label}
                </button>
              ))}
            </div>

            <button
              disabled={loading || timerState.status === 'ENDED'}
              onClick={handleEnd}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/20 px-3.5 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/30 disabled:opacity-50"
            >
              <StopCircle className="h-4 w-4" />
              End Exam Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
