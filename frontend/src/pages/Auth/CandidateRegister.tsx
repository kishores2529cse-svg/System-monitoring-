import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Building, BookOpen, Mail, Phone, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageTransition } from '../../components/ui/PageTransition';

export const CandidateRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Kishore S',
    college: 'Sri Shakthi Institute of Engineering and Technology',
    department: 'Computer Science & Engineering',
    email: 'kishore@shakthi.edu',
    phone: '+91 9876543210',
    password: 'password123',
    confirmPassword: 'password123',
    termsAccepted: true
  });
  const [loading, setLoading] = useState(false);
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerCandidate(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden font-serif-luxury selection:bg-sky-500/20 selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_32%)]" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl relative z-10">
          <GlassCard glow className="p-8 border border-slate-700/60 space-y-6 bg-slate-950/70 backdrop-blur-2xl">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                  <Shield className="w-5 h-5" />
                </div>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300">
                <Sparkles className="w-3 h-3" /> Secure onboarding
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Candidate Registration</h2>
              <p className="text-sm text-slate-400">Create your institutional profile for proctored coding assessments.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Kishore S"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">College / Institution</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Sri Shakthi Institute of Engineering"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Department</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science & Engineering"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-white text-xs focus:outline-none focus:border-[#7CFF4D] focus:shadow-[0_0_15px_rgba(124,255,77,0.2)] placeholder-neutral-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-white text-xs focus:outline-none focus:border-[#7CFF4D] focus:shadow-[0_0_15px_rgba(124,255,77,0.2)] placeholder-neutral-500 shadow-2xs"
                />
              </div>
            </div>

          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Official Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="kishore@shakthi.edu"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-white text-xs focus:outline-none focus:border-[#7CFF4D] focus:shadow-[0_0_15px_rgba(124,255,77,0.2)] placeholder-neutral-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-white text-xs focus:outline-none focus:border-[#7CFF4D] focus:shadow-[0_0_15px_rgba(124,255,77,0.2)] placeholder-neutral-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-white text-xs focus:outline-none focus:border-[#7CFF4D] focus:shadow-[0_0_15px_rgba(124,255,77,0.2)] placeholder-neutral-500 shadow-2xs"
                />
              </div>
            </div>

          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-neutral-400 text-xs">
              <input
                type="checkbox"
                required
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 rounded border-neutral-600 text-[#7CFF4D] focus:ring-0 cursor-pointer"
              />
              <span>
                I agree to the <a href="#" className="text-sky-300 hover:text-sky-200 transition-colors">CodeShield AI Terms of Assessment</a> and authorize neural proctoring telemetry recording.
              </span>
            </label>
          </div>

          <GlowingButton
            variant="purple"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Candidate Registration'}
          </GlowingButton>
        </form>

            <div className="text-center text-sm text-slate-400 font-sans">
              Already registered?{' '}
              <Link to="/login" className="text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                Sign In Here
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};
