import React, { useState } from 'react';
import { Award, ShieldCheck, Check, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { PageTransition } from '../../components/ui/PageTransition';

export const UserProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Kishore S',
    email: user?.email || 'kishore@shakthi.edu',
    college: user?.college || 'Sri Shakthi Institute of Engineering and Technology',
    department: user?.department || 'Computer Science & Engineering',
    phone: user?.phone || '+91 9876543210'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Profile Banner Header */}
          <GlassCard className="p-6 border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center gap-6 shadow-xl backdrop-blur-xl">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#7CFF4D]/60 shadow-lg shadow-[#7CFF4D]/10"
            />
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                <Sparkles className="w-3 h-3" /> Candidate Profile
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{user?.name || 'Kishore S'}</h1>
              <p className="text-xs text-slate-300">{user?.college} • {user?.department}</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/30 font-bold uppercase mt-1">
                <UserCheck className="w-3 h-3" /> Role: {user?.role || 'candidate'}
              </span>
            </div>
          </GlassCard>

          {/* Profile Settings Form & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            
            <GlassCard className="lg:col-span-2 p-6 border border-slate-800 bg-slate-900/80 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Personal &amp; Institutional Credentials</h3>
                  <p className="text-xs text-slate-400">Manage your verified university examination details.</p>
                </div>
                {saved && (
                  <span className="text-xs text-emerald-300 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5" /> Saved Successfully
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-200 font-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold">College / Institution</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold">Department / Major</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold">Institutional Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-200 font-semibold">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-sky-400 transition"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <GlowingButton variant="cyan" size="md">
                    Save Profile Changes
                  </GlowingButton>
                </div>
              </form>
            </GlassCard>

            {/* Badges & Achievements */}
            <div className="space-y-6">
              <GlassCard className="p-6 border border-slate-800 bg-slate-900/80 space-y-4 text-xs shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Award className="w-4 h-4 text-amber-400" /> Verified Achievements
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">#1 Rank Algorithm Master</div>
                      <div className="text-[11px] text-slate-400">Awarded for top score in algorithm challenge</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">100% Clean Proctor Audit</div>
                      <div className="text-[11px] text-slate-400">Zero security flags across 10 assessments</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border border-slate-800 bg-slate-900/80 space-y-3 text-xs shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sky-400" /> Security Status
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Candidate identity is cryptographically linked with proctoring audit logs.
                </p>
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-[11px] font-mono text-sky-300">
                  Status: Full Clearance (ID-VERIFIED)
                </div>
              </GlassCard>
            </div>

          </div>

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};


