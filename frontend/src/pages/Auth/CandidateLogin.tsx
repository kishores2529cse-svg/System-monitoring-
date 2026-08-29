import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Sparkles, AlertCircle, Laptop, GraduationCap, PenTool, Mouse, BookOpen, Quote, Cpu, Cloud, Globe, Brain, Layers, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/ui/PageTransition';
import { SplashCursor } from '../../components/ui/SplashCursor';

export const CandidateLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { loginCandidate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await loginCandidate(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
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

        {/* MAIN HERO CONTAINER (QUOTE → SPACIOUS SCATTERED BUBBLES & WORKSPACE → LOGIN CARD) */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10 min-h-[620px]">
          
          {/* SECTION 1: INSPIRATIONAL QUOTE (Left Column, ~360px Width) */}
          <div className="w-full lg:w-[360px] space-y-6 shrink-0 z-20 flex flex-col justify-center">
            
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

          {/* SECTION 2: WIDELY SCATTERED TECH BUBBLES & WORKSPACE (Center Open Area — 50px Safety Gap to Login Card) */}
          <div className="w-full lg:flex-1 relative flex items-center justify-center min-h-[440px] lg:min-h-[540px] pointer-events-none pr-6 lg:pr-10">
            
            {/* Soft Ambient Radial Glow Behind Objects */}
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />

            {/* CENTRAL ANCHOR: Sleek Floating Laptop */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, -1.2, 0]
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative z-20 flex flex-col items-center"
            >
              {/* Laptop Glass Shell */}
              <div className="relative w-64 sm:w-72 lg:w-80 h-44 sm:h-48 lg:h-52 rounded-2xl border border-white/30 bg-slate-950/90 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl flex flex-col justify-between overflow-hidden ring-1 ring-white/10">
                {/* Screen Glow & Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[9px] font-mono text-[#7CFF4D] tracking-widest uppercase font-semibold">
                    CodeShield • Active
                  </span>
                </div>

                {/* Minimal Premium UI Screen Text */}
                <div className="space-y-2 py-2 px-1 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#7CFF4D]/30 bg-[#7CFF4D]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#7CFF4D]">
                    <ShieldCheck className="w-3 h-3" /> CODESHIELD • SECURE WORKSPACE
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase drop-shadow-sm">
                    BUILD YOUR FUTURE
                  </h3>

                  <p className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">
                    WRITE • LEARN • ACHIEVE
                  </p>

                  <div className="pt-1 flex justify-center gap-2 sm:gap-3 text-[9px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1"><span className="text-[#7CFF4D]">✓</span> Secure Assessment</span>
                    <span className="flex items-center gap-1"><span className="text-[#7CFF4D]">✓</span> Distraction-Free</span>
                    <span className="flex items-center gap-1"><span className="text-[#7CFF4D]">✓</span> Enterprise Ready</span>
                  </div>
                </div>

                {/* Keyboard Base Silhouette */}
                <div className="h-2 w-full bg-white/10 rounded-full" />
              </div>

              {/* Laptop Depth Contact Shadow */}
              <div className="w-60 h-3 bg-black/40 blur-md rounded-[100%] mt-4" />
            </motion.div>

            {/* WORKSPACE ACCESSORY 1: Graduation Cap (Top-Left) */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [-3, 3, -3]
              }}
              transition={{
                duration: 7.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -top-4 sm:-top-8 left-14 sm:left-20 z-30 flex flex-col items-center"
            >
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl border border-amber-400/30 bg-amber-500/15 p-2.5 backdrop-blur-xl shadow-xl flex items-center justify-center text-amber-300 ring-1 ring-amber-400/20">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md" />
              </div>
              <div className="w-9 h-1.5 bg-black/30 blur-sm rounded-full mt-1.5" />
            </motion.div>

            {/* WORKSPACE ACCESSORY 2: Wireless Mouse (Bottom-Left) */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [-4, 4, -4]
              }}
              transition={{
                duration: 6.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -bottom-4 left-24 sm:left-32 z-30 flex flex-col items-center"
            >
              <div className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl border border-[#7CFF4D]/30 bg-[#7CFF4D]/15 p-2 backdrop-blur-xl shadow-lg flex items-center justify-center text-[#7CFF4D] ring-1 ring-[#7CFF4D]/20">
                <Mouse className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
              </div>
              <div className="w-7 h-1.5 bg-black/30 blur-sm rounded-full mt-1.5" />
            </motion.div>

            {/* WORKSPACE ACCESSORY 3: Precision Stylus / Pen (Top-Center) */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [15, 22, 15]
              }}
              transition={{
                duration: 5.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-sky-400/30 bg-sky-500/15 p-2 backdrop-blur-xl shadow-lg flex items-center justify-center text-sky-300 ring-1 ring-sky-400/20">
                <PenTool className="w-4.5 h-4.5 sm:w-5 sm:h-5 drop-shadow-md" />
              </div>
              <div className="w-7 h-1.5 bg-black/30 blur-sm rounded-full mt-1.5" />
            </motion.div>

            {/* 6 WIDELY SCATTERED NON-OVERLAPPING TECH BUBBLES (Minimum 80px+ Gap, Strict 50px+ Gap to Login Card) */}
            
            {/* BUBBLE 1: AI Neural Sphere (Top-Far-Left Corner) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              className="absolute -top-10 -left-6 sm:-left-12 z-20"
            >
              <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-black/85 to-emerald-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-emerald-300 ring-1 ring-emerald-400/30">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-emerald-400 mt-0.5">NEURAL</span>
              </div>
            </motion.div>

            {/* BUBBLE 2: Cloud Compute Sphere (Mid-Far-Left Edge) */}
            <motion.div
              animate={{ y: [0, 6, 0], rotate: [2, -2, 2] }}
              transition={{ duration: 7.0, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute top-44 -left-12 sm:-left-20 z-20"
            >
              <div className="w-17 h-17 sm:w-20 sm:h-20 rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-500/20 via-black/85 to-slate-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-sky-300 ring-1 ring-sky-400/30">
                <Cloud className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-sky-400 mt-0.5">CLOUD</span>
              </div>
            </motion.div>

            {/* BUBBLE 3: GPU Tensor Chip Sphere (Bottom-Far-Left Corner) */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-2, 3, -2] }}
              transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              className="absolute -bottom-8 left-0 sm:left-4 z-20"
            >
              <div className="w-14 h-14 sm:w-17 sm:h-17 rounded-full border border-[#7CFF4D]/40 bg-gradient-to-br from-[#7CFF4D]/20 via-black/85 to-emerald-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-[#7CFF4D] ring-1 ring-[#7CFF4D]/30">
                <Cpu className="w-5.5 h-5.5 sm:w-7.5 sm:h-7.5 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-[#7CFF4D] mt-0.5">GPU CORE</span>
              </div>
            </motion.div>

            {/* BUBBLE 4: Cybersecurity Shield Sphere (Top-Center-Right) */}
            <motion.div
              animate={{ y: [0, 7, 0], rotate: [2, -3, 2] }}
              transition={{ duration: 6.6, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
              className="absolute -top-12 left-64 sm:left-72 z-20"
            >
              <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-black/85 to-amber-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-amber-300 ring-1 ring-amber-400/30">
                <Shield className="w-6.5 h-6.5 sm:w-8 sm:h-8 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-amber-400 mt-0.5">SECURITY</span>
              </div>
            </motion.div>

            {/* BUBBLE 5: Global Network Sphere (Bottom-Center-Right) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              className="absolute -bottom-8 left-56 sm:left-64 z-20"
            >
              <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-full border border-blue-400/40 bg-gradient-to-br from-blue-500/20 via-black/85 to-slate-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-blue-300 ring-1 ring-blue-400/30">
                <Globe className="w-6.5 h-6.5 sm:w-8 sm:h-8 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-blue-400 mt-0.5">NETWORK</span>
              </div>
            </motion.div>

            {/* BUBBLE 6: Data Stream & Mesh Sphere (Mid-Bottom Inner Left) */}
            <motion.div
              animate={{ y: [0, 5, 0], rotate: [2, -2, 2] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              className="absolute bottom-20 left-36 sm:left-44 z-20"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-purple-400/40 bg-gradient-to-br from-purple-500/20 via-black/85 to-purple-950/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center justify-center text-purple-300 ring-1 ring-purple-400/30">
                <Layers className="w-5.5 h-5.5 sm:w-7 sm:h-7 drop-shadow-md" />
                <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-purple-400 mt-0.5">DATA MESH</span>
              </div>
            </motion.div>

          </div>

          {/* SECTION 3: CANDIDATE LOGIN CARD (Dominant Right Element — STRICT 50px+ SAFETY EXCLUSION ZONE) */}
          <div className="w-full lg:w-[430px] shrink-0 flex justify-center lg:justify-end z-30">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              {/* Premium Translucent Interactive Form Card */}
              <div className="rounded-[32px] border border-[#7CFF4D]/40 bg-[#091109]/95 p-7 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-slate-100 space-y-5 relative overflow-hidden ring-1 ring-white/10">
                
                {/* Soft Glow Ambient Lighting */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#7CFF4D]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="text-center space-y-2 relative z-10">
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

                {/* Interactive Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/20 p-3 text-xs font-semibold text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* College Email Address Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200">College Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@college.edu"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/70 border border-white/15 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#7CFF4D] focus:ring-1 focus:ring-[#7CFF4D] placeholder:text-slate-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-200">Password</label>
                      <a href="#" className="text-[#7CFF4D] hover:text-[#A3FF1A] transition-colors font-semibold">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl bg-black/70 border border-white/15 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#7CFF4D] focus:ring-1 focus:ring-[#7CFF4D] placeholder:text-slate-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-600 bg-black/70 text-[#7CFF4D] focus:ring-0"
                    />
                    Remember this device
                  </label>

                  {/* Sign In Button with Periodic 6s Glow Pulse */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(124,255,77,0)',
                        '0 0 25px rgba(124,255,77,0.6)',
                        '0 0 0px rgba(124,255,77,0)'
                      ]
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatDelay: 3.6,
                      ease: 'easeInOut'
                    }}
                    className="rounded-2xl overflow-hidden"
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl bg-[#7CFF4D] hover:bg-[#A3FF1A] text-[#091109] font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <LogIn className="w-4 h-4" />
                      {loading ? 'Authenticating...' : 'Sign In to Candidate Portal'}
                    </button>
                  </motion.div>
                </form>

                {/* Google Institutional Workspace Button */}
                <div className="space-y-3 pt-2">
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-white/10 w-full" />
                    <span className="bg-[#091109] px-3 text-[10px] text-slate-400 font-mono uppercase tracking-[0.25em]">
                      OR CONTINUE WITH
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                    className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Google Institutional Workspace
                  </button>
                </div>

                {/* Footer Register Link */}
                <div className="text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#7CFF4D] font-bold hover:underline transition-colors">
                    Register for Assessment
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
