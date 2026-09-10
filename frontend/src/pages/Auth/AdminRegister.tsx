import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Key, Lock, ShieldAlert, Sparkles, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

export const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await registerAdmin({
        username,
        email,
        password,
        name: username
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-serif-luxury selection:bg-rose-500/20 selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_32%)]" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md relative z-10">
          <GlassCard glow className="p-8 border border-slate-700/60 space-y-6 bg-slate-950/70 backdrop-blur-2xl mt-8 mb-8">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-rose-400/30 flex items-center justify-center text-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.2)]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-300">
                <Sparkles className="w-3 h-3" /> Secure admin creation
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Proctor Enrollment</h2>
              <p className="text-sm text-slate-400">Establish a new administrator identity.</p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300 font-sans">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Admin Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ChiefProctor01"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Admin Email Key</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@codeshield.ai"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Passphrase</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Confirm Passphrase</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <GlowingButton
                  variant="rose"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  icon={<Shield className="w-4 h-4" />}
                >
                  {loading ? 'Registering...' : 'Register Administrator Identity'}
                </GlowingButton>
              </div>
            </form>

            <div className="text-center text-sm text-slate-400 font-sans space-y-2 flex flex-col">
              <div>
                Already have an admin account?{' '}
                <Link to="/login" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
                  Login here
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};
