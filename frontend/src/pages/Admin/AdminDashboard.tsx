import React, { useState, useEffect } from 'react';
import { Users, Lock, Activity, Search, Cpu, RefreshCw } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateCardData, MonitoringEvent, AdminStats } from '../../types';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { StatCard } from '../../components/dashboard/StatCard';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { LiveCandidateCard } from '../../components/dashboard/LiveCandidateCard';
import { CandidateDetailModal } from '../../components/dashboard/CandidateDetailModal';
import { PageTransition } from '../../components/ui/PageTransition';

export const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateCardData[]>([]);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCardData | null>(null);

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

          <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Live Candidates"
            value={stats?.liveCandidates || 48}
            change="12%"
            icon={<Users className="w-5 h-5 text-sky-600" />}
            color="cyan"
          />
          <StatCard
            title="Avg Confidence Score"
            value={`${stats?.averageConfidenceScore || 92.4}%`}
            change="1.4%"
            icon={<Activity className="w-5 h-5 text-emerald-600" />}
            color="emerald"
          />
          <StatCard
            title="Locked Users"
            value={stats?.lockedUsers || 3}
            change="1"
            isPositive={false}
            icon={<Lock className="w-5 h-5 text-rose-600" />}
            color="rose"
          />
          <StatCard
            title="AI Detection Accuracy"
            value={`${stats?.aiAccuracy || 99.2}%`}
            change="0.2%"
            icon={<Cpu className="w-5 h-5 text-indigo-600" />}
            color="purple"
          />
        </div>

        {/* Activity & Violation Analytics Charts */}
        <ActivityChart />

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

      <Footer />
    </div>
    </PageTransition>
  );
};
