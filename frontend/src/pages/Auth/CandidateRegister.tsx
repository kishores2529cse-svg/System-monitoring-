import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Building, BookOpen, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';

export const CandidateRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Vijay Rathinam',
    college: 'Sri Shakthi Institute of Engineering and Technology',
    department: 'Computer Science & Engineering',
    email: 'vijay@shakthi.edu',
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
    <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center p-4 relative overflow-hidden py-12 font-serif-luxury">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="max-w-xl w-full p-8 border border-slate-200 space-y-6 relative z-10 shadow-xl bg-white/95 backdrop-blur-xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-serif-luxury">Candidate Registration</h2>
          <p className="text-xs text-slate-600 font-sans">Create your institutional profile for proctored coding assessments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 font-serif-luxury">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vijay Rathinam"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 font-serif-luxury">College / Institution</label>
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
              <label className="font-semibold text-slate-800 font-serif-luxury">Department</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science & Engineering"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 font-serif-luxury">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 font-serif-luxury">Official Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vijay@shakthi.edu"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 font-serif-luxury">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 font-serif-luxury">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 text-xs">
              <input
                type="checkbox"
                required
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>
                I agree to the <a href="#" className="text-indigo-700 hover:underline font-semibold font-serif-luxury">CodeShield AI Terms of Assessment</a> and authorize neural proctoring telemetry recording.
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

        <div className="text-center text-xs text-slate-600 font-sans">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-700 font-semibold hover:underline font-serif-luxury">
            Sign In Here
          </Link>
        </div>

      </GlassCard>
    </div>
  );
};
