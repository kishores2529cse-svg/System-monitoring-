import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Key, Lock, ShieldAlert, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

export const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = async (mockEmail: string, mockPass: string) => {
    setAdminId(mockEmail);
    setPassword(mockPass);
    setCode2FA('123456');
    setLoading(true);
    setErrorMessage('');
    try {
      await loginAdmin(mockEmail, mockPass, '123456');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin credentials or passphrase.');
      setShow2FA(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setShow2FA(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await loginAdmin(adminId, password, code2FA);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin credentials or passphrase.');
      setShow2FA(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-serif-luxury selection:bg-rose-500/20 selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_32%)]" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md relative z-10">
          <GlassCard glow className="p-8 border border-slate-700/60 space-y-6 bg-slate-950/70 backdrop-blur-2xl">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-rose-400/30 flex items-center justify-center text-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.2)]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-300">
                <Sparkles className="w-3 h-3" /> Secure admin access
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Proctor Admin Command Login</h2>
              <p className="text-sm text-slate-400">Restricted authentication portal for chief administrators and proctors.</p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300 font-sans">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

        {!show2FA ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4 font-serif-luxury">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 font-serif-luxury">Admin Identity Key (ID)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="ADM-CHIEF-01"
                  className="w-full pl-10 pr-4 py-2.75 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 font-serif-luxury">Passphrase</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 shadow-2xs"
                />
              </div>
            </div>

            <GlowingButton
              variant="rose"
              size="lg"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Verify Credentials & Proceed to 2FA
            </GlowingButton>

            <div className="pt-2 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-mono">⚡ Quick Demo Login</span>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => handleMockLogin('abc@gmail.com', 'xyz')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold font-mono transition-all animate-pulse"
                >
                  Admin ABC (abc@gmail.com)
                </button>
                <button
                  type="button"
                  onClick={() => handleMockLogin('admin@codeshield.ai', 'admin123')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold font-mono transition-all"
                >
                  Chief Admin (admin@codeshield.ai)
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4 font-sans">
            
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center font-mono font-semibold">
              Two-Factor Security Challenge (TOTP)
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 text-center block font-serif-luxury">Enter 6-Digit Authenticator Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value)}
                placeholder="849201"
                className="w-full text-center py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-sky-300 text-xl font-mono tracking-[0.5em] focus:outline-none focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] font-bold"
              />
            </div>

            <GlowingButton
              variant="cyan"
              size="lg"
              className="w-full"
              disabled={loading}
              icon={<Shield className="w-4 h-4" />}
            >
              {loading ? 'Authenticating Session...' : 'Authorize Admin Command Portal'}
            </GlowingButton>
          </form>
        )}

            <div className="text-center text-sm text-slate-400 font-sans">
              Switching to candidate view?{' '}
              <Link to="/login" className="text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                Candidate Login Portal
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};
