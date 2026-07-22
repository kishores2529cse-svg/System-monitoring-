import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Key, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlowingButton } from '../../components/ui/GlowingButton';
import { GlassCard } from '../../components/ui/GlassCard';

export const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState('ADM-CHIEF-01');
  const [password, setPassword] = useState('adminpass123');
  const [code2FA, setCode2FA] = useState('849201');
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShow2FA(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(adminId, password, code2FA);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center p-4 relative overflow-hidden font-serif-luxury">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-100/40 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="max-w-md w-full p-8 border border-slate-200 space-y-6 relative z-10 shadow-xl bg-white/95 backdrop-blur-xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-serif-luxury">Proctor Admin Command Login</h2>
          <p className="text-xs text-slate-600 font-sans">Restricted authentication portal for Chief Administrators & Proctors</p>
        </div>

        {!show2FA ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4 font-sans">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 font-serif-luxury">Admin Identity Key (ID)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="ADM-CHIEF-01"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 font-mono shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 font-serif-luxury">Passphrase</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 shadow-2xs"
                />
              </div>
            </div>

            <GlowingButton
              variant="rose"
              size="lg"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Verify Credentials & Proceed to 2FA
            </GlowingButton>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4 font-sans">
            
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center font-mono font-semibold">
              Two-Factor Security Challenge (TOTP)
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 text-center block font-serif-luxury">Enter 6-Digit Authenticator Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value)}
                placeholder="849201"
                className="w-full text-center py-3 rounded-xl bg-slate-50 border border-slate-200 text-sky-700 text-xl font-mono tracking-[0.5em] focus:outline-none focus:border-sky-500 shadow-2xs font-bold"
              />
            </div>

            <GlowingButton
              variant="cyan"
              size="lg"
              className="w-full"
              disabled={loading}
              icon={<Shield className="w-4 h-4" />}
            >
              {loading ? 'Authenticating Session...' : 'Authorize Admin Command Portal'}
            </GlowingButton>
          </form>
        )}

        <div className="text-center text-xs text-slate-600 font-sans">
          Switching to candidate view?{' '}
          <Link to="/login" className="text-sky-700 font-semibold hover:underline font-serif-luxury">
            Candidate Login Portal
          </Link>
        </div>

      </GlassCard>
    </div>
  );
};
