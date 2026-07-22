import React, { useState, useEffect } from 'react';
import { Users, Search, Cpu, RefreshCw, PlusCircle, ExternalLink, AlertTriangle, Camera, ClipboardCheck, Clock3, Eye, MonitorUp, Pause, Play, Radio, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { CandidateCardData, MonitoringEvent, AdminStats } from '../../types';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { StatCard } from '../../components/dashboard/StatCard';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { LiveCandidateCard } from '../../components/dashboard/LiveCandidateCard';
import { CandidateDetailModal } from '../../components/dashboard/CandidateDetailModal';
import { CreateProblemModal } from '../../components/dashboard/CreateProblemModal';
import { PageTransition } from '../../components/ui/PageTransition';

export const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateCardData[]>([]);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCardData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [evidenceFilter, setEvidenceFilter] = useState('All');

  const loadData = async () => {
    const cData = await api.admin.getLiveSessions();
    const eData = await api.admin.getLiveEvents();
    const sData = await api.admin.getDashboard();
    setCandidates(cData);
    setEvents(eData);
    setStats(sData);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLock = async (id: string) => {
    await api.exam.lock(id, 'Admin manually locked session.');
    await loadData();
  };

  const handleUnlock = async (id: string) => {
    await api.admin.unlockUser(id);
    await loadData();
  };

  const handleExtend = async (id: string) => {
    await api.admin.extendTime(id, 15);
    await loadData();
  };

  const handleTerminate = async (id: string) => {
    await api.admin.terminateSession(id);
    await loadData();
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.problem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEvents = events.filter((event) => {
    if (evidenceFilter === 'High Risk') return event.severity === 'High' || event.severity === 'Critical';
    if (evidenceFilter === 'Face Detection') return /face|multiple/i.test(event.event);
    if (evidenceFilter === 'Fullscreen Violations') return /fullscreen/i.test(event.event);
    if (evidenceFilter === 'Copy\/Paste Attempts') return /copy|paste/i.test(event.event);
    if (evidenceFilter === 'Tab Switches') return /tab/i.test(event.event);
    return true;
  });

  const openCandidate = (candidateId: string) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    if (candidate) setSelectedCandidate(candidate);
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-100 flex flex-col selection:bg-sky-500/20 font-serif-luxury">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Command Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-sky-300 font-bold uppercase tracking-wider">AI Surveillance Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Live Candidate Telemetry & Proctoring</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Question & Test Cases</span>
            </button>

            <Link
              to="/sandbox"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:border-sky-400/40 shadow-sm transition-all flex items-center gap-2 text-xs font-medium"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Open Code Sandbox</span>
            </Link>

            <button
              onClick={loadData}
              className="p-2.5 rounded-2xl bg-slate-900/70 border border-slate-700 text-slate-200 hover:text-white hover:border-sky-400/40 shadow-sm transition-all cursor-pointer flex items-center gap-2 text-xs font-sans font-medium"
            >
              <RefreshCw className="w-4 h-4 text-sky-600" />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Students Online"
            value={stats?.liveCandidates || 48}
            change="12%"
            icon={<Users className="w-5 h-5 text-sky-600" />}
            color="cyan"
          />
          <StatCard
            title="Active Assessments"
            value={stats?.runningExams || 48}
            change="6%"
            icon={<ClipboardCheck className="w-5 h-5 text-emerald-600" />}
            color="emerald"
          />
          <StatCard
            title="High-Risk Candidates"
            value={candidates.filter((candidate) => candidate.confidenceScore < 70).length || 3}
            change="2"
            isPositive={false}
            icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
            color="rose"
          />
          <StatCard
            title="AI Events Detected"
            value={stats?.suspiciousEvents || events.length}
            change="4"
            icon={<Cpu className="w-5 h-5 text-indigo-600" />}
            color="purple"
          />
          <StatCard title="Evidence Collected" value={events.length || 18} change="3" icon={<Camera className="w-5 h-5 text-sky-600" />} color="cyan" />
          <StatCard title="Avg Remaining Time" value="46m" change="2m" icon={<Clock3 className="w-5 h-5 text-amber-600" />} color="amber" />
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm font-sans">
          <button className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white"><Play className="mr-1 inline h-3.5 w-3.5" />Start Assessment</button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><Pause className="mr-1 inline h-3.5 w-3.5" />Pause Assessment</button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><Play className="mr-1 inline h-3.5 w-3.5" />Resume Assessment</button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><Radio className="mr-1 inline h-3.5 w-3.5" />Broadcast Announcement</button>
          <button className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />Flag Candidate</button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><FileDown className="mr-1 inline h-3.5 w-3.5" />Export Report</button>
        </div>

        {/* Activity & Violation Analytics Charts */}
        <ActivityChart />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div><h2 className="font-bold text-slate-900">Live candidate monitoring</h2><p className="text-xs text-slate-500">Live webcam placeholders, risk indicators, and intervention controls.</p></div>
            <MonitorUp className="h-5 w-5 text-sky-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider"><tr><th className="p-4">Student</th><th>Assessment / question</th><th>Time</th><th>Risk</th><th>Status</th><th>Webcam</th><th>Last activity</th><th className="p-4">Actions</th></tr></thead>
              <tbody>{filteredCandidates.map((candidate) => {
                const risk = 100 - candidate.confidenceScore;
                return <tr key={candidate.id} className="border-t border-slate-100 hover:bg-slate-50"><td className="p-4 font-semibold text-slate-900">{candidate.name}</td><td><span className="block text-slate-800">{candidate.problem}</span><span className="text-slate-500">Question in progress</span></td><td className="font-mono text-slate-700">{candidate.timeLeft}</td><td><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${risk >= 40 ? 'bg-rose-500 animate-pulse' : risk >= 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} /><span className={risk >= 40 ? 'font-bold text-rose-700' : 'text-slate-700'}>{risk}%</span></div></td><td><span className={`rounded-full px-2 py-1 font-semibold ${candidate.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : candidate.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{candidate.status}</span></td><td><button onClick={() => openCandidate(candidate.id)} className="rounded-lg bg-slate-900 px-2 py-1 text-white"><Eye className="mr-1 inline h-3 w-3" />Preview</button></td><td className="text-slate-500">{candidate.startedAt}</td><td className="p-4 whitespace-nowrap"><button onClick={() => openCandidate(candidate.id)} className="mr-2 text-sky-700">View</button><button onClick={() => openCandidate(candidate.id)} className="mr-2 text-sky-700">Timeline</button><button onClick={() => openCandidate(candidate.id)} className="mr-2 text-sky-700">Evidence</button><button onClick={() => handleTerminate(candidate.id)} className="text-rose-700">End</button></td></tr>;
              })}</tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Live activity timeline</h2><div className="mt-4 space-y-3">{events.slice().reverse().slice(0, 6).map((event) => <button key={event.id} onClick={() => openCandidate(event.candidateId)} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:border-sky-200"><span><span className="block font-semibold text-slate-800">{event.event} <span className="font-normal text-slate-500">— {event.candidateName}</span></span><span className="text-xs text-slate-500">{event.timestamp} · risk {event.confidenceImpact}%</span></span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${event.severity === 'Critical' || event.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{event.severity}</span></button>)}</div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-slate-900">Evidence center</h2><select value={evidenceFilter} onChange={(event) => setEvidenceFilter(event.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700"><option>All</option><option>High Risk</option><option>Face Detection</option><option>Fullscreen Violations</option><option>Copy/Paste Attempts</option><option>Tab Switches</option></select></div><div className="mt-4 space-y-3">{filteredEvents.slice(0, 5).map((event) => <button key={event.id} onClick={() => openCandidate(event.candidateId)} className="grid w-full grid-cols-[1fr_auto] gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-sky-200"><span><span className="block font-semibold text-slate-800">{event.candidateName} · {event.event}</span><span className="text-xs text-slate-500">{event.timestamp} · contribution {event.confidenceImpact}%</span><span className="mt-1 block text-xs text-slate-500">Screenshot and webcam snapshot available</span></span><span className="h-12 w-16 rounded-lg bg-slate-200 text-center leading-[3rem] text-[10px] text-slate-500">Evidence</span></button>)}</div></div>
        </section>

        {/* Live Surveillance Candidate Grid Header & Filters */}
        <div className="space-y-4 pt-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Active Candidates Grid</h2>
              <p className="text-xs text-slate-400 font-sans">Real-time candidate telemetry feeds and quick proctor overrides</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 font-sans">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate, college..."
                  className="pl-9 pr-3 py-1.5 rounded-2xl bg-slate-900/70 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-400 w-60 shadow-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-2xl bg-slate-900/70 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-400 cursor-pointer font-mono shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Warning">Warning</option>
                <option value="Locked">Locked</option>
              </select>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((c) => (
              <LiveCandidateCard
                key={c.id}
                candidate={c}
                onViewDetails={(cand) => setSelectedCandidate(cand)}
                onLock={handleLock}
                onUnlock={handleUnlock}
                onExtend={handleExtend}
                onTerminate={handleTerminate}
              />
            ))}
          </div>

        </div>

      </main>

      {/* Candidate Deep Telemetry Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        events={events}
        onClose={() => setSelectedCandidate(null)}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onExtend={handleExtend}
        onTerminate={handleTerminate}
      />

      {/* Admin Create Question & Testcases Modal */}
      <CreateProblemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <Footer />
    </div>
    </PageTransition>
  );
};
