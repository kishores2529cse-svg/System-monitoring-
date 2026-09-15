import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Sparkles, AlertCircle, Laptop, GraduationCap, BookOpen, Quote, Cpu, Cloud, Globe, Brain, Eye, EyeOff, ShieldAlert, Key, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/ui/PageTransition';
import { SplashCursor } from '../../components/ui/SplashCursor';
import { GlowingButton } from '../../components/ui/GlowingButton';

export const CandidateLogin: React.FC = () => {
  // Candidate State
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [showCandidatePassword, setShowCandidatePassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateErrorMessage, setCandidateErrorMessage] = useState('');

  // Admin State
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErrorMessage, setAdminErrorMessage] = useState('');

  const { loginCandidate, loginAdmin } = useAuth();
  const navigate = useNavigate();

  // Candidate Handlers
  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = candidateEmail.trim();
    const loginPass = candidatePassword.trim();

    if (!loginEmail || !loginPass) {
      setCandidateErrorMessage('Please enter both email and password.');
      return;
    }

    setCandidateLoading(true);
    setCandidateErrorMessage('');
    try {
      await loginCandidate(loginEmail, loginPass);
      navigate('/dashboard');
    } catch (err: any) {
      setCandidateErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setCandidateLoading(false);
    }
  };
  const handleAdminInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMessage('');
    setShow2FA(true);
  };

  const handleAdminFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminErrorMessage('');
    try {
      await loginAdmin(adminId, adminPassword, code2FA);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setAdminErrorMessage(err.message || 'Invalid admin credentials or passphrase.');
      setShow2FA(false);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#FACC15] via-[#CA8A04] to-[#091109] text-slate-900 font-sans selection:bg-[#7CFF4D]/30 flex items-center justify-center p-4 py-8 lg:py-12">
        
        {/* Interactive Particle Splash Cursor Animation */}
        <SplashCursor />

        {/* Soft Radial Depth Light & Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(254,240,138,0.35),_transparent_60%),radial-gradient(circle_at_85%_85%,_rgba(9,17,9,0.92),_transparent_65%)] pointer-events-none" />

        {/* Low-Opacity Educational Ambient Icons (< 5% opacity) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] text-black">
          <BookOpen className="absolute top-12 left-[10%] w-24 h-24" />
          <Sparkles className="absolute top-1/3 left-[40%] w-20 h-20" />
          <Laptop className="absolute bottom-20 left-[16%] w-28 h-28" />
          <GraduationCap className="absolute top-16 right-[36%] w-20 h-20" />
        </div>

        {/* MAIN HERO CONTAINER */}
        <div className="w-full max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-12 relative z-10 min-h-[620px]">
          
          {/* SECTION 1: INSPIRATIONAL QUOTE (Left Column, ~360px Width) */}
          <div className="w-full xl:w-[360px] space-y-6 shrink-0 z-20 flex flex-col justify-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.3em] text-[#091109] backdrop-blur-sm shadow-xs self-start">
              <Sparkles className="w-3.5 h-3.5 text-[#142911]" />
              Institutional Learning Access
            </div>

            {/* Quote Block */}
            <div className="relative space-y-4">
              <Quote className="w-8 h-8 text-[#142911]/30 -mb-2" />
              
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-[#091109] leading-[1.18] drop-shadow-xs">
                “If we want something great, <br />
                <span className="text-[#143d0e] underline decoration-[#7CFF4D] decoration-wavy decoration-3">we must sacrifice</span> <br />
                something great.”
              </h1>

              {/* Signature */}
              <div className="pt-2 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-[#142911]/40 rounded-full" />
                <p className="text-xl sm:text-2xl font-serif italic text-[#142911] font-bold tracking-wide drop-shadow-xs">
                  ~ Kishore S
                </p>
              </div>
            </div>

            {/* Sub-tagline */}
            <p className="text-xs sm:text-sm font-semibold text-[#142911]/80 tracking-wide leading-relaxed">
              Distraction-free environment • Enterprise secure assessment workspace
            </p>
          </div>

          {/* SECTION 2: WIDELY SCATTERED TECH BUBBLES & WORKSPACE */}
          <div className="w-full xl:flex-1 relative flex items-center justify-center min-h-[440px] xl:min-h-[540px] pointer-events-none pr-6 xl:pr-10 hidden lg:flex">
            
            {/* Soft Ambient Radial Glow Behind Objects */}
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />

            {/* WORKSPACE ACCESSORY 1: Graduation Cap */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-10 z-30 flex flex-col items-center"
            >
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl border border-amber-400/30 bg-amber-500/15 p-2.5 backdrop-blur-xl shadow-xl flex items-center justify-center text-amber-300 ring-1 ring-amber-400/20">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md" />
              </div>
            </motion.div>

            {/* BUBBLE 1: AI Neural Sphere */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              className="absolute top-0 right-32 z-20"
            >
              <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-black/85 to-emerald-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-emerald-300 ring-1 ring-emerald-400/30">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-emerald-400 mt-0.5">NEURAL</span>
              </div>
            </motion.div>

            {/* BUBBLE 2: Cloud Compute Sphere */}
            <motion.div
              animate={{ y: [0, 6, 0], rotate: [2, -2, 2] }}
              transition={{ duration: 7.0, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute top-44 left-10 z-20"
            >
              <div className="w-17 h-17 sm:w-20 sm:h-20 rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-500/20 via-black/85 to-slate-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-sky-300 ring-1 ring-sky-400/30">
                <Cloud className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-sky-400 mt-0.5">CLOUD</span>
              </div>
            </motion.div>

            {/* BUBBLE 3: GPU Tensor Chip Sphere */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-2, 3, -2] }}
              transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              className="absolute bottom-10 left-32 z-20"
            >
              <div className="w-14 h-14 sm:w-17 sm:h-17 rounded-full border border-[#7CFF4D]/40 bg-gradient-to-br from-[#7CFF4D]/20 via-black/85 to-emerald-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-[#7CFF4D] ring-1 ring-[#7CFF4D]/30">
                <Cpu className="w-5.5 h-5.5 sm:w-7.5 sm:h-7.5 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-[#7CFF4D] mt-0.5">GPU</span>
              </div>
            </motion.div>

            {/* BUBBLE 5: Global Network Sphere */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              className="absolute bottom-0 right-20 z-20"
            >
              <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-full border border-blue-400/40 bg-gradient-to-br from-blue-500/20 via-black/85 to-slate-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-blue-300 ring-1 ring-blue-400/30">
                <Globe className="w-6.5 h-6.5 sm:w-8 sm:h-8 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-blue-400 mt-0.5">NET</span>
              </div>
            </motion.div>

          </div>

          {/* SECTION 3: CENTRAL LOGIN CARD (Combined Candidate & Admin) */}
          <div className="w-full xl:w-auto shrink-0 flex justify-center xl:justify-end z-30 relative">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[850px]"
            >
              {/* Premium Translucent Interactive Form Card */}
              <div className="rounded-[32px] border border-[#7CFF4D]/30 bg-[#091109]/95 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-slate-100 relative overflow-hidden ring-1 ring-white/10 flex flex-col md:flex-row">
                
                {/* CANDIDATE SIDE (Left) */}
                <div className="flex-1 p-7 sm:p-8 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="text-center space-y-2 relative z-10 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-[#7CFF4D]/30 flex items-center justify-center text-[#7CFF4D] shadow-inner">
                        <Shield className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#7CFF4D]/30 bg-[#7CFF4D]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7CFF4D]">
                      <Sparkles className="w-3 h-3" /> Candidate Access
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Candidate Portal Login
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                      Enter your institutional credentials to access your learning workspace.
                    </p>
                  </div>

                  {/* Candidate Form */}
                  <form onSubmit={handleCandidateSubmit} className="space-y-4 relative z-10">
                    {candidateErrorMessage && (
                      <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/20 p-3 text-xs font-semibold text-rose-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{candidateErrorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-200">College Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="candidate@college.edu"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#131b15] border border-white/10 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#7CFF4D] focus:ring-1 focus:ring-[#7CFF4D] placeholder:text-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-200">Password</label>
                        <a href="#" className="text-[#7CFF4D] hover:text-[#A3FF1A] transition-colors font-semibold">Forgot password?</a>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showCandidatePassword ? 'text' : 'password'}
                          value={candidatePassword}
                          onChange={(e) => setCandidatePassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#131b15] border border-white/10 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#7CFF4D] focus:ring-1 focus:ring-[#7CFF4D] placeholder:text-slate-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCandidatePassword(!showCandidatePassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showCandidatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-600 bg-[#131b15] text-[#7CFF4D] focus:ring-0"
                      />
                      Remember this device
                    </label>

                    <button
                      type="submit"
                      disabled={candidateLoading}
                      className="w-full py-3.5 rounded-2xl bg-[#7CFF4D] hover:bg-[#A3FF1A] text-[#091109] font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <LogIn className="w-4 h-4" />
                      {candidateLoading ? 'Authenticating...' : 'Sign In to Candidate Portal'}
                    </button>
                  </form>

                  <div className="text-center text-sm font-medium text-slate-300 mt-8 mb-4 relative z-10 bg-slate-900/50 py-3 rounded-xl border border-slate-700/50">
                    Don't have a candidate account?{' '}
                    <Link to="/register" className="text-[#7CFF4D] font-bold hover:underline transition-colors ml-1">
                      Register here
                    </Link>
                  </div>
                </div>

                {/* ADMIN SIDE (Right) */}
                <div className="flex-1 p-7 sm:p-8 bg-slate-950/40 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="text-center space-y-2 relative z-10 mb-6 mt-4 md:mt-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-300 mx-auto">
                      <ShieldAlert className="w-3 h-3" /> Secure Admin Access
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase font-serif-luxury">
                      Admin Login
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
                      Restricted authentication portal for chief administrators and proctors.
                    </p>
                  </div>

                  {adminErrorMessage && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300 mb-4 relative z-10">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{adminErrorMessage}</span>
                    </div>
                  )}

                  {!show2FA ? (
                    <form onSubmit={handleAdminInitialSubmit} className="space-y-4 relative z-10">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Admin Identity Key (ID)</label>
                        <div className="relative">
                          <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            placeholder="admin@codeshield.ai"
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/60 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Passphrase</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <input
                            type={showAdminPassword ? 'text' : 'password'}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-900 border border-slate-700/60 text-white text-sm transition-all duration-300 focus:outline-none focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)] placeholder:text-slate-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <GlowingButton variant="rose" size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                          Verify Credentials &amp; Proceed to 2FA
                        </GlowingButton>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleAdminFinalSubmit} className="space-y-4 relative z-10">
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 text-center font-mono font-semibold">
                        Two-Factor Security Challenge (TOTP)
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-200 text-center block">Enter 6-Digit Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={code2FA}
                          onChange={(e) => setCode2FA(e.target.value)}
                          placeholder="849201"
                          className="w-full text-center py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sky-300 text-xl font-mono tracking-[0.5em] focus:outline-none focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)] font-bold"
                        />
                      </div>
                      <div className="pt-2">
                        <GlowingButton variant="cyan" size="lg" className="w-full" disabled={adminLoading} icon={<Shield className="w-4 h-4" />}>
                          {adminLoading ? 'Authenticating...' : 'Authorize Admin Portal'}
                        </GlowingButton>
                      </div>
                    </form>
                  )}

                  <div className="text-center text-xs text-slate-400 mt-8 relative z-10">
                    Don't have an admin account?{' '}
                    <Link to="/admin/register" className="text-rose-400 font-bold hover:underline transition-colors">
                      Register here
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
