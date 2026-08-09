import React, { useState } from 'react';
import { Camera, Code2, RefreshCw, Settings2 } from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { PageTransition } from '../../components/ui/PageTransition';
import { CreateProblemModal } from '../../components/dashboard/CreateProblemModal';
import { AdminManagementPanel } from '../../components/dashboard/AdminManagementPanel';
import { AdminTimerControl } from '../../components/dashboard/AdminTimerControl';
import { SplashCursor } from '../../components/ui/SplashCursor';

export const AdminDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [cameraPolicy, setCameraPolicy] = useState(true);

  const evidence = [
    ['Priya', 'Tab Switch', '10:20'],
    ['Arjun', 'Fullscreen Exit', '10:22'],
    ['Rahul', 'Face Missing', '10:26']
  ];
  const activity = [
    ['10:18', 'Rahul started exam'],
    ['10:20', 'Priya switched tab'],
    ['10:22', 'Arjun exited fullscreen'],
    ['10:25', 'Multiple faces detected'],
    ['10:27', 'Developer tools suspected']
  ];

  return (
    <PageTransition>
      <div className="min-h-screen font-sans text-slate-100 bg-[#091109] relative overflow-hidden selection:bg-[#7CFF4D]/30">
        {/* Interactive Particle Splash Cursor Animation */}
        <SplashCursor />

        {/* 4K SIET Campus Background with Dark Professional Overlay */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/siet_campus.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050b05]/90 via-[#081208]/92 to-[#040804]/96 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-5 rounded-3xl border border-white/20 bg-black/70 p-7 shadow-2xl backdrop-blur-xl md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7CFF4D] drop-shadow-md">
                  <Settings2 className="h-4 w-4" />SIET Faculty Admin Workspace
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
                  Members, evidence &amp; coding problems
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 font-medium drop-shadow-sm">
                  Manage candidate access, review security evidence, control central exam timers (Mins &amp; Secs), and set Exam Passwords from one workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => setCameraPolicy(value => !value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${cameraPolicy ? 'border-[#7CFF4D]/50 bg-[#173013] text-[#dfffd2]' : 'border-white/20 bg-white/10 text-slate-200'}`}
                >
                  <Camera className="h-4 w-4" />Camera {cameraPolicy ? 'required' : 'optional'}
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF4D] px-4 py-2.5 text-sm font-bold text-[#091109] transition hover:bg-[#A3FF1A] shadow-lg shadow-[#7CFF4D]/20"
                >
                  <Code2 className="h-4 w-4" />Add problem
                </button>
                <button
                  onClick={() => setLastRefresh(new Date())}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 backdrop-blur-md"
                >
                  <RefreshCw className="h-4 w-4" />Refresh
                </button>
              </div>
            </section>

            {/* Centralized Admin-Controlled Exam Timer */}
            <AdminTimerControl />

            <AdminManagementPanel />

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-black/65 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="font-bold text-white text-lg drop-shadow-sm">Evidence table</h2>
                <p className="mt-1 text-xs text-slate-300">Recent security evidence captured during active sessions.</p>
                <table className="mt-5 w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-slate-300 font-semibold border-b border-white/10">
                    <tr>
                      <th className="pb-3">Student</th>
                      <th>Event</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.map(([student, event, time]) => (
                      <tr key={`${student}-${time}`} className="border-t border-white/10">
                        <td className="py-3 font-semibold text-white">{student}</td>
                        <td>
                          <span className="rounded-full bg-[#FFD84D]/20 border border-[#FFD84D]/30 px-2.5 py-1 text-xs font-semibold text-[#FFD84D]">{event}</span>
                        </td>
                        <td className="font-mono text-slate-300 text-xs">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-3xl border border-white/15 bg-black/65 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="font-bold text-white text-lg drop-shadow-sm">Live activity feed</h2>
                <p className="mt-1 text-xs text-slate-300">Latest candidate and proctoring activity.</p>
                <ol className="mt-5 space-y-4">
                  {activity.map(([time, detail]) => (
                    <li key={`${time}-${detail}`} className="flex gap-4">
                      <span className="w-11 shrink-0 font-mono text-xs font-bold text-[#7CFF4D]">{time}</span>
                      <span className="border-l border-[#FFD84D]/30 pl-4 text-sm font-medium text-slate-200">{detail}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <p className="text-right text-xs font-mono text-slate-400">Last refreshed {lastRefresh.toLocaleTimeString()}</p>
          </main>
          <CreateProblemModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};
