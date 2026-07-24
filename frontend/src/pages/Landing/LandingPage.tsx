import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Lock, Terminal, BarChart2, ShieldCheck, Eye, Sparkles, Crosshair, User } from 'lucide-react';
import { Footer } from '../../components/common/Footer';
import { InteractiveBackground } from '../../components/ui/InteractiveBackground';
import { RobotSection } from '../../components/ui/RobotSection';
import heroFull from '../../assets/hero-full.jpg';

/* ─── animated counter ─── */
const AnimatedNumber: React.FC<{ target: number; suffix?: string; prefix?: string; decimals?: number }> = ({ target, suffix = '', prefix = '', decimals = 0 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const start = performance.now();
        const dur = 1800;
        const step = (now: number) => {
          const progress = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.round(val)}{suffix}</span>;
};

export const LandingPage: React.FC = () => {
  const headingWord1 = "SYSTEM";
  const headingWord2 = "MONITORING";

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 90, damping: 12 }
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-[#7CFF4D]/20 selection:text-white relative font-serif-luxury overflow-x-hidden">
      
      {/* Cinematic Canvas Background */}
      <InteractiveBackground />

      {/* ═══════════════════════════════════════════════ HERO ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 overflow-hidden z-10">
        
        {/* FULL-BLEED POSTER BACKGROUND — the robot is baked into this image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroFull} 
            alt="" 
            className="w-full h-full object-cover object-[70%_center] scale-[1.05]"
            style={{ filter: 'brightness(0.85) contrast(1.1)' }}
          />
          {/* Dark gradient overlay on the left side for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/80 to-transparent" />
          {/* Subtle top and bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/60 via-transparent to-[#090909]/80" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* LEFT SIDE (45%) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 z-20">
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-[#7CFF4D]/40 text-xs text-[#7CFF4D] shadow-[0_0_10px_rgba(124,255,77,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84D] animate-pulse" />
              <span className="font-semibold font-sans tracking-widest uppercase text-[10px]">FACULTY COMMAND CENTER</span>
            </motion.div>

            {/* Title - Sequential Letter Reveal */}
            <div className="space-y-1">
              {/* Word 1: SYSTEM */}
              <motion.h1 
                variants={letterContainer}
                initial="hidden"
                animate="show"
                className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] text-white flex flex-wrap"
              >
                {headingWord1.split("").map((char, index) => (
                  <motion.span 
                    key={index}
                    variants={letterAnimation}
                    className="inline-block relative hover:text-[#7CFF4D] transition-colors duration-200"
                    style={{ textShadow: '0 0 30px rgba(255,255,255,0.05)' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Word 2: MONITORING */}
              <motion.h1 
                variants={letterContainer}
                initial="hidden"
                animate="show"
                className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] text-[#7CFF4D] flex flex-wrap"
              >
                {headingWord2.split("").map((char, index) => (
                  <motion.span 
                    key={index}
                    variants={letterAnimation}
                    className="inline-block relative hover:text-[#FFD84D] transition-colors duration-200"
                    style={{ textShadow: '0 0 25px rgba(124,255,77,0.15)' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            {/* Paragraph 1 - Fade Up */}
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-neutral-300 text-base sm:text-lg leading-relaxed font-sans font-light text-justify"
            >
              A system monitoring tool (running on Windows) which would help the faculty to sit in a single system and monitor all student desktops in his/her desktop. All student screens should be continuously streamed to the server and the faculty system should be able to see all the screens in parallel.
            </motion.p>

            {/* Paragraph 2 - Staggered Fade Up with Target Icon */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-[#FFD84D]/10 border border-[#FFD84D]/25 shrink-0 text-[#FFD84D] mt-0.5">
                <Crosshair className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans font-light text-justify">
                Additional points would be given to the software which is also able to report <span className="text-[#FFD84D] font-medium font-mono">un-usual behaviour</span> by any individual system and bring it automatically as full screen to the main faculty system.
              </p>
            </motion.div>

            {/* CTA Button Row */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 15,
                delay: 1.0 
              }}
              className="pt-2 flex items-center gap-4 flex-wrap"
            >
              <Link to="/login">
                <button
                  ref={buttonRef}
                  onClick={handleButtonClick}
                  className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7CFF4D] via-[#A3FF1A] to-[#FFD84D] text-black font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(124,255,77,0.25)] border border-[#7CFF4D]/30 transition-all duration-300 hover:shadow-[0_0_35px_rgba(124,255,77,0.45)] hover:-translate-y-1 cursor-pointer active:scale-95 select-none"
                  style={{ willChange: 'transform' }}
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <AnimatePresence>
                    {ripples.map(ripple => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-[ripple_0.6s_ease-out]"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: '100px',
                          height: '100px',
                        }}
                      />
                    ))}
                  </AnimatePresence>

                  <User className="w-4 h-4 text-black group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">LOGIN</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 font-sans font-bold">→</span>
                </button>
              </Link>

              <Link to="/about">
                <button
                  className="group relative px-8 py-4 rounded-2xl bg-transparent text-white font-mono font-bold tracking-wider text-sm flex items-center justify-center gap-3 overflow-hidden border border-white/25 transition-all duration-300 hover:border-[#7CFF4D]/50 hover:bg-[#7CFF4D]/10 hover:shadow-[0_0_25px_rgba(124,255,77,0.15)] hover:-translate-y-1 cursor-pointer active:scale-95 select-none backdrop-blur-sm"
                  style={{ willChange: 'transform' }}
                >
                  <Sparkles className="w-4 h-4 text-[#FFD84D] group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">ABOUT US</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 font-sans font-bold">→</span>
                </button>
              </Link>
            </motion.div>

          </div>

          {/* RIGHT SIDE (55%) — Only animated HUD overlay rings, the robot is in the background poster */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex justify-center items-center"
          >
            <RobotSection />
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════ FEATURES ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-neutral-900/60 bg-[#090909]/40">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif-luxury">
              Built for Uncompromising Integrity
            </h2>
            <div className="w-16 h-[2px] bg-[#7CFF4D] mx-auto rounded-full" />
            <p className="text-neutral-400 max-w-xl mx-auto text-base font-sans font-light leading-relaxed">
              AI telemetry, face mesh vectoring, and real-time safe browser lockdown — replacing manual review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 space-y-5 rounded-3xl border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-md hover:border-[#7CFF4D]/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-[#7CFF4D]/10 border border-[#7CFF4D]/20 flex items-center justify-center text-[#7CFF4D] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(124,255,77,0.05)]">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif-luxury">Neural Face & Eye Mesh</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans font-light">
                68-point facial landmark tracking with continuous gaze angle analysis — detecting off-screen glances and dual-person presence.
              </p>
            </div>

            <div className="p-8 space-y-5 rounded-3xl border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-md hover:border-[#FFD84D]/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD84D]/10 border border-[#FFD84D]/20 flex items-center justify-center text-[#FFD84D] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,216,77,0.05)]">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif-luxury">Safe Exam Lockdown</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans font-light">
                Intercepts tab switches, right-clicks, copy/paste, DevTools shortcuts, and secondary monitor setups.
              </p>
            </div>

            <div className="p-8 space-y-5 rounded-3xl border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-md hover:border-[#7CFF4D]/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-[#7CFF4D]/10 border border-[#7CFF4D]/20 flex items-center justify-center text-[#7CFF4D] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(124,255,77,0.05)]">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif-luxury">Monaco Compiler</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans font-light">
                Full Monaco Editor with Go starter code, custom test runners, memory profiling, and real-time execution.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STEPS ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#090909]/20">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif-luxury">
              How It Works
            </h2>
            <div className="w-16 h-[2px] bg-[#FFD84D] mx-auto rounded-full" />
            <p className="text-neutral-400 text-base font-sans font-light">Four seamless steps from entry to audit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <ShieldCheck className="w-5 h-5 text-[#7CFF4D]" />, title: 'Identity Check', desc: 'Webcam, mic, screen, and biometric verification before exam start.', iconBg: 'bg-[#7CFF4D]/10 border-[#7CFF4D]/20' },
              { step: '02', icon: <Lock className="w-5 h-5 text-[#FFD84D]" />, title: 'Viewport Lock', desc: 'Fullscreen enforced, DevTools blocked, copy/paste monitored.', iconBg: 'bg-[#FFD84D]/10 border-[#FFD84D]/20' },
              { step: '03', icon: <Eye className="w-5 h-5 text-[#7CFF4D]" />, title: 'AI Telemetry', desc: 'Continuous face mesh, voice detection, confidence scoring.', iconBg: 'bg-[#7CFF4D]/10 border-[#7CFF4D]/20' },
              { step: '04', icon: <BarChart2 className="w-5 h-5 text-[#FFD84D]" />, title: 'Audit Log', desc: 'Flagged timeline, confidence graphs for admin review.', iconBg: 'bg-[#FFD84D]/10 border-[#FFD84D]/20' },
            ].map((s, idx) => (
              <div key={idx} className="p-6 space-y-4 rounded-3xl border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-md relative group hover:border-neutral-700 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold font-mono text-neutral-800 group-hover:text-[#7CFF4D]/20 transition-colors duration-500">{s.step}</span>
                  <div className={`p-2.5 rounded-xl border ${s.iconBg}`}>{s.icon}</div>
                </div>
                <h4 className="font-bold text-white text-base font-serif-luxury">{s.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed font-sans font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STATS ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#090909]/40">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-10 sm:p-14 border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Tech grid markings */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#7CFF4D]/35" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#7CFF4D]/35" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#7CFF4D]/35" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#7CFF4D]/35" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-[#7CFF4D] font-mono tracking-tight">
                  <AnimatedNumber target={100000} suffix="+" />
                </div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold font-sans">Exams</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  <AnimatedNumber target={99.8} suffix="%" decimals={1} />
                </div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold font-sans">Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-[#FFD84D] font-mono tracking-tight">
                  <AnimatedNumber target={15} prefix="<" suffix="ms" />
                </div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold font-sans">Latency</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  <AnimatedNumber target={500} suffix="+" />
                </div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-semibold font-sans">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dark Footer */}
      <Footer theme="dark" />
    </div>
  );
};
