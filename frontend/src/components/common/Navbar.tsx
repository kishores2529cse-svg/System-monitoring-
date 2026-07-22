import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Cpu, LogOut, Award, Terminal, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { GlowingButton } from '../ui/GlowingButton';

export const Navbar: React.FC = () => {
  const { user, role, logout, loginAdmin, loginCandidate } = useAuth();
  const { confidenceScore, isLocked } = useMonitoring();
  const navigate = useNavigate();
  const location = useLocation();

  const isExamPage = location.pathname.startsWith('/exam');

  const handleRoleToggle = async () => {
    if (role === 'admin') {
      await loginCandidate('vijay@shakthi.edu', 'pass');
      navigate('/dashboard');
    } else {
      await loginAdmin('ADM-CHIEF-01', 'pass');
      navigate('/admin/dashboard');
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 p-[1px] shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900 font-serif-luxury">CodeShield</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-sky-50 text-sky-700 border border-sky-200 font-semibold">AI v2.4</span>
            </div>
            <span className="text-[9px] text-slate-500 font-sans tracking-widest uppercase">ENTERPRISE PROCTORING</span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!isExamPage && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                location.pathname === '/' ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </Link>
            
            {role === 'candidate' && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                    location.pathname === '/dashboard' ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Candidate Hub
                </Link>
                <Link
                  to="/exam/101"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1.5 ${
                    location.pathname.startsWith('/exam') ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-sky-600" />
                  Live Exam Workspace
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1.5 ${
                    location.pathname === '/admin/dashboard' ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/logs"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                    location.pathname === '/admin/logs' ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Audit Logs
                </Link>
              </>
            )}

            <Link
              to="/leaderboard"
              className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1 ${
                location.pathname === '/leaderboard' ? 'bg-white text-sky-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Leaderboard
            </Link>
          </div>
        )}

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          
          {/* AI Monitoring Pulse Badge */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLocked ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
              </span>
              <span className="text-slate-600 font-medium font-serif-luxury">AI Surveillance:</span>
              <span className={`font-mono font-bold ${isLocked ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isLocked ? 'LOCKED' : `${confidenceScore}% Confidence`}
              </span>
            </div>
          )}

          {/* Quick Demo Role Switcher */}
          <button
            onClick={handleRoleToggle}
            className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Click to toggle between Candidate and Admin view"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role: <strong className="capitalize text-slate-900">{role || 'Guest'}</strong></span>
          </button>

          {/* Auth Button or User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline font-serif-luxury">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <GlowingButton variant="ghost" size="sm">Login</GlowingButton>
              </Link>
              <Link to="/register">
                <GlowingButton variant="cyan" size="sm">Start Assessment</GlowingButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
