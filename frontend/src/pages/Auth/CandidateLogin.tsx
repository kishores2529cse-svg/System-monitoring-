import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

export const CandidateLogin: React.FC = () => {
  const [email, setEmail] = useState('vijay@shakthi.edu');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loginCandidate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginCandidate(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 py-10 relative overflow-hidden font-serif-luxury selection:bg-sky-500/20 selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.18),_transparent_35%)]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <GlassCard glow className="p-8 border border-slate-700/60 space-y-6 bg-slate-950/70 backdrop-blur-2xl">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                  <Shield className="w-5 h-5" />
                </div>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300">
                <Sparkles className="w-3 h-3" /> Candidate access
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Candidate Portal Login</h2>
              <p className="text-sm text-slate-400">Enter your institutional credentials to access your assessment workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">College Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@college.edu"
                    className="w-full pl-10 pr-4 py-2.75 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white text-sm transition-all duration-300 focus:outline-none focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-200">Password</label>
                  <a href="#" className="text-sky-300 hover:text-sky-200 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.75 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white text-sm transition-all duration-300 focus:outline-none focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] placeholder:text-slate-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-0"
                />
                Remember this device
              </label>

              <GlowingButton variant="cyan" size="lg" className="w-full" disabled={loading} icon={<LogIn className="w-4 h-4" />}>
                {loading ? 'Authenticating...' : 'Sign In to Candidate Portal'}
              </GlowingButton>
            </form>

            <div className="space-y-3 pt-2 font-sans">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-700/80 w-full" />
                <span className="bg-slate-950/80 px-3 text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em]">Or Continue With</span>
              </div>

              <button
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                className="w-full py-2.75 rounded-2xl bg-white/95 hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">...</svg>
                Google Institutional Workspace
              </button>
            </div>

            <div className="text-center text-sm text-slate-400 font-sans">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                Register for Assessment
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};
