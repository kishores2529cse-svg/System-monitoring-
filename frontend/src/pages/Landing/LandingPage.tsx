import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Lock, Terminal, Activity, BarChart, ShieldCheck, Eye, Sparkles, ArrowRight, Zap, Scan } from 'lucide-react';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { InteractiveBackground } from '../../components/ui/InteractiveBackground';

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

/* ─── floating accent shapes ─── */
const FloatingAccent: React.FC<{
  className?: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ className = '', delay = 0, children }) => (
  <div
    className={`absolute pointer-events-none select-none ${className}`}
    style={{
      animation: `floatDeep 8s ease-in-out ${delay}s infinite`,
    }}
  >
    {children}
  </div>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-sky-500/15 relative font-serif-luxury overflow-x-hidden">

      <InteractiveBackground />
      <Navbar />

      {/* ═══════════════════════════════════════════════ HERO ═══════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-28 lg:pt-36 pb-20 sm:pb-28 lg:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">

        {/* Floating decorative accents */}
        <FloatingAccent className="top-16 left-[8%] opacity-40" delay={0}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 blur-xl" />
        </FloatingAccent>
        <FloatingAccent className="top-32 right-[12%] opacity-30" delay={1.5}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-200 blur-xl rotate-45" />
        </FloatingAccent>
        <FloatingAccent className="bottom-20 left-[15%] opacity-25" delay={3}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-sky-200 blur-2xl" />
        </FloatingAccent>
        <FloatingAccent className="bottom-32 right-[8%] opacity-20" delay={2}>
          <div className="w-14 h-14 rounded-full border border-sky-200/50" />
        </FloatingAccent>
        <FloatingAccent className="top-[45%] left-[3%] opacity-20" delay={4}>
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200/40" />
        </FloatingAccent>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-50/80 border border-sky-100 backdrop-blur-sm text-xs text-sky-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-semibold font-serif-luxury tracking-wide">Enterprise AI Proctoring Platform v2.4</span>
          </div>

          {/* Hero heading — large, clean, Google Labs typography */}
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.03em] leading-[1.08] text-slate-900">
            Next-Gen Online
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500">
              Coding Proctoring
            </span>
          </h1>

          {/* Subtitle — clean and airy */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 leading-relaxed font-sans font-light">
            Secure assessments with real-time AI surveillance, face mesh tracking, and evidence-backed confidence scoring.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/exam/101">
              <GlowingButton variant="cyan" size="lg" icon={<Terminal className="w-5 h-5" />}>
                Start Assessment
              </GlowingButton>
            </Link>
            <Link to="/admin/dashboard">
              <GlowingButton variant="secondary" size="lg" icon={<BarChart className="w-5 h-5" />}>
                Admin Dashboard
              </GlowingButton>
            </Link>
          </div>

          {/* Feature preview mockup — Google Labs style floating card */}
          <div className="pt-16 max-w-4xl mx-auto">
            <div className="relative">
              {/* Soft glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-200/40 via-indigo-200/30 to-purple-200/40 rounded-3xl blur-3xl scale-105 pointer-events-none" />

              <div className="relative glass-deep rounded-3xl p-1 border border-slate-200/60 shadow-2xl">
                <div className="bg-white/95 rounded-[20px] p-5 sm:p-6 text-left font-mono text-xs space-y-4">

                  {/* Window chrome */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-300" />
                      <span className="w-3 h-3 rounded-full bg-amber-300" />
                      <span className="w-3 h-3 rounded-full bg-emerald-300" />
                      <span className="text-slate-400 text-[11px] ml-3 font-sans">main.go — CodeShield</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-100 font-sans text-[11px] font-medium">
                      <Activity className="w-3.5 h-3.5 text-emerald-500" />
                      <span>AI Active — 94%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Code editor */}
                    <div className="lg:col-span-3 space-y-2 p-4 bg-[#0f172a] text-slate-100 rounded-xl border border-slate-800">
                      <span className="text-slate-500 font-sans text-[10px]">// Two Sum — Go</span>
                      <pre className="text-cyan-300/90 font-mono text-[11px] leading-relaxed">
{`func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        if idx, ok := m[target-num]; ok {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}`}
                      </pre>
                    </div>

                    {/* Proctor sidebar */}
                    <div className="lg:col-span-2 p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 text-[11px] font-sans">Proctor Feed</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-mono">LIVE</span>
                      </div>
                      <div className="h-28 rounded-lg bg-slate-200/60 border border-slate-200 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Scan className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="absolute inset-2 border border-sky-400/60 rounded" />
                        <div className="absolute bottom-1 left-1 right-1 flex justify-between text-[8px] text-slate-500 font-mono px-1">
                          <span>face: 98.2%</span>
                          <span>gaze: center</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-slate-500">
                        <div className="bg-white rounded-lg px-2 py-1.5 border border-slate-100">
                          <span className="text-slate-400">Tabs</span>
                          <span className="float-right font-semibold text-slate-700">0</span>
                        </div>
                        <div className="bg-white rounded-lg px-2 py-1.5 border border-slate-100">
                          <span className="text-slate-400">DevTools</span>
                          <span className="float-right font-semibold text-emerald-600">Blocked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ FEATURES ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">
              Built for Uncompromising Integrity
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base font-sans font-light leading-relaxed">
              AI telemetry, face mesh vectoring, and real-time safe browser lockdown — replacing manual review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Neural Face & Eye Mesh</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                68-point facial landmark tracking with continuous gaze angle analysis — detecting off-screen glances and dual-person presence.
              </p>
            </GlassCard>

            <GlassCard className="p-8 space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Safe Exam Lockdown</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Intercepts tab switches, right-clicks, copy/paste, DevTools shortcuts, and secondary monitor setups.
              </p>
            </GlassCard>

            <GlassCard className="p-8 space-y-5 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Monaco Compiler</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Full Monaco Editor with Go starter code, custom test runners, memory profiling, and real-time execution.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STEPS ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">
              How It Works
            </h2>
            <p className="text-slate-500 text-base font-sans font-light">Four seamless steps from entry to audit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <ShieldCheck className="w-5 h-5 text-sky-600" />, title: 'Identity Check', desc: 'Webcam, mic, screen, and biometric verification before exam start.', iconBg: 'bg-sky-50 border-sky-100' },
              { step: '02', icon: <Lock className="w-5 h-5 text-indigo-600" />, title: 'Viewport Lock', desc: 'Fullscreen enforced, DevTools blocked, copy/paste monitored.', iconBg: 'bg-indigo-50 border-indigo-100' },
              { step: '03', icon: <Eye className="w-5 h-5 text-purple-600" />, title: 'AI Telemetry', desc: 'Continuous face mesh, voice detection, confidence scoring.', iconBg: 'bg-purple-50 border-purple-100' },
              { step: '04', icon: <BarChart className="w-5 h-5 text-emerald-600" />, title: 'Audit Log', desc: 'Flagged timeline, confidence graphs for admin review.', iconBg: 'bg-emerald-50 border-emerald-100' },
            ].map((s, idx) => (
              <GlassCard key={idx} className="p-6 space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold font-mono text-slate-200 group-hover:text-sky-200 transition-colors duration-500">{s.step}</span>
                  <div className={`p-2.5 rounded-xl border ${s.iconBg}`}>{s.icon}</div>
                </div>
                <h4 className="font-bold text-slate-900 text-base font-serif-luxury">{s.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STATS ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-deep rounded-3xl p-10 sm:p-14 border border-slate-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold text-sky-600 font-mono tracking-tight">
                  <AnimatedNumber target={100000} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-sans">Exams</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold text-indigo-600 font-mono tracking-tight">
                  <AnimatedNumber target={99.8} suffix="%" decimals={1} />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-sans">Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 font-mono tracking-tight">
                  <AnimatedNumber target={15} prefix="<" suffix="ms" />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-sans">Latency</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-600 font-mono tracking-tight">
                  <AnimatedNumber target={500} suffix="+" />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-sans">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ BOTTOM CTA ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-700 font-sans">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-medium">Trusted by 500+ enterprises worldwide</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">
            Ready to secure your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">assessments?</span>
          </h2>
          <p className="text-lg text-slate-500 font-sans font-light max-w-xl mx-auto">
            Deploy AI proctoring in minutes. No hardware setup required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <GlowingButton variant="cyan" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </GlowingButton>
            </Link>
            <Link to="/admin/dashboard">
              <GlowingButton variant="ghost" size="lg">
                View Demo
              </GlowingButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
