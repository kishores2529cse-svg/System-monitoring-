import React, { useState } from 'react';
import { Award, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { PageTransition } from '../../components/ui/PageTransition';

export const UserProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Vijay Rathinam',
    email: user?.email || 'vijay@shakthi.edu',
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
      <div className="min-h-screen text-slate-100 flex flex-col selection:bg-sky-500/20 font-serif-luxury">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Banner Header */}
        <GlassCard className="p-6 border border-slate-200 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
          />
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300">
              <Sparkles className="w-3 h-3" /> Profile overview
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name || 'Vijay Rathinam'}</h1>
            <p className="text-xs text-slate-400 font-sans">{user?.college} • {user?.department}</p>
            <span className="inline-block px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-300 text-xs font-mono border border-sky-400/20 font-bold uppercase mt-1">
              Role: {user?.role || 'candidate'}
            </span>
          </div>
        </GlassCard>

        {/* Profile Settings Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          
          <GlassCard className="lg:col-span-2 p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-white">Personal & Institutional Details</h3>
              {saved && <span className="text-xs text-emerald-300 font-mono flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved Successfully</span>}
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-200 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold font-serif-luxury">College / Institution</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold font-serif-luxury">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold font-serif-luxury">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold font-serif-luxury">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <GlowingButton variant="cyan" size="md">
                  Save Changes
                </GlowingButton>
              </div>
            </form>
          </GlassCard>

          {/* Badges & Achievements */}
          <div className="space-y-6">
            <GlassCard className="p-6 border border-slate-200 space-y-3 text-xs shadow-sm">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Achievements Wall
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-serif-luxury text-sm">#1 Rank Go Master</div>
                    <div className="text-[11px] text-slate-500 font-sans">Awarded for top score in algorithm challenge</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-bold shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-serif-luxury text-sm">100% Clean Proctor Audit</div>
                    <div className="text-[11px] text-slate-500 font-sans">Zero security flags across 10 assessments</div>
                  </div>
                </div>
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
