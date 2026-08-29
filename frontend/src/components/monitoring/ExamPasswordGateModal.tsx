import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, LogOut, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

interface ExamPasswordGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const ExamPasswordGateModal: React.FC<ExamPasswordGateModalProps> = ({ isOpen, onSuccess }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the examination password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await api.exam.verifyPassword(password);
      if (isValid) {
        onSuccess();
      } else {
        setError('Invalid examination password. Please contact your proctor/faculty administrator.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-300 font-sans">
      <div className="max-w-md w-full rounded-3xl border border-white/20 bg-gradient-to-br from-[#121c12] via-[#091109] to-[#040804] p-7 shadow-2xl text-slate-100 space-y-5 relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-400">
          <Lock className="h-7 w-7" />
        </div>

        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Restricted Examination Gate
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Faculty Admin Authorization Required. To enter or re-enter this formal assessment session, enter the passcode provided by your instructor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-[#7CFF4D]" />
              Exam Access Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter exam password..."
                className="w-full rounded-xl border border-white/15 bg-black/50 pl-4 pr-11 py-3 text-sm font-mono text-white placeholder-slate-500 outline-none focus:border-[#7CFF4D] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#7CFF4D] px-4 py-3 text-sm font-bold text-[#091109] transition hover:bg-[#A3FF1A] disabled:opacity-50 shadow-lg shadow-[#7CFF4D]/10"
            >
              {loading ? (
                <span>Verifying Passcode...</span>
              ) : (
                <>
                  <span>Unlock Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
