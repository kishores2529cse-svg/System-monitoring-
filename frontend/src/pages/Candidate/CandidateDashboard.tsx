import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Terminal, CheckCircle2, Cpu, Camera, Mic, Eye, Play, Bell, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowingButton } from '../../components/ui/GlowingButton';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showSysCheck, setShowSysCheck] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex flex-col selection:bg-sky-500/20 font-serif-luxury">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-100 border border-sky-200/80 shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-sky-800 text-xs font-mono border border-sky-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Identity Verified • Candidate ID: USR001</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">
                Welcome, {user?.name || 'Vijay Rathinam'}
              </h1>
              <p className="text-sm text-slate-600 font-sans">
                {user?.college || 'Sri Shakthi Institute of Engineering and Technology'} • {user?.department || 'Computer Science & Engineering'}
              </p>
            </div>

            {/* Launch Exam CTA */}
            <div className="flex items-center gap-3">
              <GlowingButton
                variant="cyan"
                size="lg"
                onClick={() => setShowSysCheck(true)}
                icon={<Terminal className="w-5 h-5" />}
              >
                Launch Assessment Workspace
              </GlowingButton>
            </div>

          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          
          {/* Active / Upcoming Assessment */}
          <div className="lg:col-span-2 space-y-6">
            
            <GlassCard className="p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">Active Assessment Ready</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-mono border border-emerald-200 font-semibold">
                  DURATION: 90 MINS
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-lg font-serif-luxury">Go Advanced Coding & Algorithmic Challenge</h4>
                  <span className="text-xs text-slate-600 font-mono">100 Points Max</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Includes problem statements covering Hash Maps, LRU Cache Data Structure, and Dynamic Programming algorithms with Go compiler runtime.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-600 pt-1">
                  <span>Language: <strong className="text-sky-700">Go 1.22</strong></span>
                  <span>Proctoring: <strong className="text-emerald-700">Neural Face Mesh</strong></span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link to="/exam/101">
                  <GlowingButton variant="cyan" size="md" icon={<Play className="w-4 h-4" />}>
                    Enter Safe Exam Workspace
                  </GlowingButton>
                </Link>
              </div>
            </GlassCard>

            {/* Previous Attempts Performance */}
            <GlassCard className="p-6 border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">Previous Assessment Scorecards</h3>
              
              <div className="space-y-3 text-xs">
                {[
                  { title: 'Data Structures & Algorithms in Go', score: '98/100', conf: '96%', date: '2026-07-15', status: 'Passed' },
                  { title: 'System Design & Concurrency', score: '92/100', conf: '94%', date: '2026-06-28', status: 'Passed' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-900 font-serif-luxury text-sm">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.date} • AI Proctor Score: {item.conf}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-emerald-700 font-bold text-sm">{item.score}</div>
                      <span className="text-[10px] text-slate-500">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* Right Panel AI Proctor Status & Leaderboard Preview */}
          <div className="space-y-6 font-sans">
            
            {/* AI Proctor Telemetry Readiness Card */}
            <GlassCard className="p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-serif-luxury">
                  <Cpu className="w-4 h-4 text-sky-600" /> System Readiness
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">READY</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2 text-slate-700 font-sans">
                    <Camera className="w-4 h-4 text-sky-600" /> Webcam Stream
                  </span>
                  <span className="text-emerald-700 font-bold">ACTIVE</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2 text-slate-700 font-sans">
                    <Mic className="w-4 h-4 text-indigo-600" /> Audio Microphone
                  </span>
                  <span className="text-emerald-700 font-bold">ACTIVE</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2 text-slate-700 font-sans">
                    <Eye className="w-4 h-4 text-amber-600" /> Safe Browser Lock
                  </span>
                  <span className="text-emerald-700 font-bold">ENFORCED</span>
                </div>
              </div>
            </GlassCard>

            {/* Notifications Feed */}
            <GlassCard className="p-6 border border-slate-200 space-y-3 text-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-serif-luxury">
                <Bell className="w-4 h-4 text-amber-600" /> Recent Proctor Alerts
              </h3>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5 shadow-2xs">
                  <div className="text-slate-900 font-semibold font-serif-luxury">System Verification Verified</div>
                  <div className="text-slate-500 text-[11px] font-sans">Proctor node verified your face ID mesh baseline.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-0.5 shadow-2xs">
                  <div className="text-slate-900 font-semibold font-serif-luxury">Leaderboard Ranking #1</div>
                  <div className="text-slate-500 text-[11px] font-sans">Congratulations! You are ranked #1 in Go algorithms.</div>
                </div>
              </div>
            </GlassCard>

          </div>

        </div>

      </main>

      {/* System Check Pre-Exam Modal */}
      {showSysCheck && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-sky-200 text-center space-y-5 shadow-2xl animate-in zoom-in duration-200 font-sans">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-sky-600 shadow-2xs">
              <Shield className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Pre-Exam System Check</h3>
              <p className="text-xs text-slate-600">
                Please grant webcam & mic access and ensure fullscreen mode is enabled before starting.
              </p>
            </div>

            <div className="space-y-2 text-left text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">Webcam & Face Mesh</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> PASSED</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">Microphone Noise Isolation</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> PASSED</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">Network Ping Latency</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 24ms</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <GlowingButton variant="secondary" size="md" className="w-1/2" onClick={() => setShowSysCheck(false)}>
                Cancel
              </GlowingButton>
              <GlowingButton
                variant="cyan"
                size="md"
                className="w-1/2"
                onClick={() => {
                  setShowSysCheck(false);
                  navigate('/exam/101');
                }}
              >
                Begin Exam Now
              </GlowingButton>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
