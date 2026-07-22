import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Cpu, LogOut, Award, Terminal, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { GlowingButton } from '../ui/GlowingButton';

export const Navbar: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => {
  const { user, role, logout, loginAdmin, loginCandidate } = useAuth();
  const { confidenceScore, isLocked } = useMonitoring();
  const navigate = useNavigate();
  const location = useLocation();

  const isExamPage = location.pathname.startsWith('/exam');
  const isDark = theme === 'dark';

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
    <nav className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-300 ${
      isDark 
        ? 'bg-[#090909]/80 border-b border-neutral-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-white/85 border-b border-slate-200/80 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl p-[1px] shadow-sm transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-tr from-[#7CFF4D] via-[#FFD84D] to-[#7CFF4D]'
              : 'bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600'
          }`}>
            <div className={`w-full h-full rounded-[11px] flex items-center justify-center ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
              <Shield className={`w-5 h-5 group-hover:scale-110 transition-transform duration-300 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-xl tracking-tight font-serif-luxury ${isDark ? 'text-white' : 'text-slate-900'}`}>CodeShield</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded font-semibold ${
                isDark 
                  ? 'bg-[#7CFF4D]/10 text-[#7CFF4D] border border-[#7CFF4D]/25' 
                  : 'bg-sky-50 text-sky-700 border border-sky-200'
              }`}>AI v2.4</span>
            </div>
            <span className={`text-[9px] font-sans tracking-widest uppercase ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>ENTERPRISE PROCTORING</span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!isExamPage && (
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-xl border ${
            isDark 
              ? 'bg-neutral-900/60 border-neutral-800' 
              : 'bg-slate-100/80 border-slate-200/80'
          }`}>
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                location.pathname === '/' 
                  ? isDark 
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                    : 'bg-white text-sky-700 font-semibold shadow-xs' 
                  : isDark 
                    ? 'text-neutral-400 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </Link>
            
            {role === 'candidate' && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                    location.pathname === '/dashboard' 
                      ? isDark 
                        ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                        : 'bg-white text-sky-700 font-semibold shadow-xs' 
                      : isDark 
                        ? 'text-neutral-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Candidate Hub
                </Link>
                <Link
                  to="/exam/101"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1.5 ${
                    location.pathname.startsWith('/exam') 
                      ? isDark 
                        ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                        : 'bg-white text-sky-700 font-semibold shadow-xs' 
                      : isDark 
                        ? 'text-neutral-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} />
                  Live Exam Workspace
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1.5 ${
                    location.pathname === '/admin/dashboard' 
                      ? isDark 
                        ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                        : 'bg-white text-sky-700 font-semibold shadow-xs' 
                      : isDark 
                        ? 'text-neutral-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#FFD84D]' : 'text-indigo-600'}`} />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/logs"
                  className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg ${
                    location.pathname === '/admin/logs' 
                      ? isDark 
                        ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                        : 'bg-white text-sky-700 font-semibold shadow-xs' 
                      : isDark 
                        ? 'text-neutral-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Audit Logs
                </Link>
              </>
            )}

            <Link
              to="/leaderboard"
              className={`px-3 py-1.5 text-xs font-serif-luxury transition-all rounded-lg flex items-center gap-1 ${
                location.pathname === '/leaderboard' 
                  ? isDark 
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs' 
                    : 'bg-white text-sky-700 font-semibold shadow-xs' 
                  : isDark 
                    ? 'text-neutral-400 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${isDark ? 'text-[#FFD84D]' : 'text-amber-600'}`} />
              Leaderboard
            </Link>
          </div>
        )}

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          
          {/* AI Monitoring Pulse Badge */}
          {user && (
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border ${
              isDark 
                ? 'bg-neutral-900/60 border-neutral-800 text-white' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLocked ? 'bg-rose-500' : isDark ? 'bg-[#7CFF4D]' : 'bg-emerald-500'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLocked ? 'bg-rose-600' : isDark ? 'bg-[#7CFF4D]' : 'bg-emerald-600'
                }`}></span>
              </span>
              <span className={`${isDark ? 'text-neutral-400' : 'text-slate-600'} font-medium font-serif-luxury`}>AI Surveillance:</span>
              <span className={`font-mono font-bold ${
                isLocked ? 'text-rose-500' : isDark ? 'text-[#7CFF4D]' : 'text-emerald-700'
              }`}>
                {isLocked ? 'LOCKED' : `${confidenceScore}% Confidence`}
              </span>
            </div>
          )}

          {/* Quick Demo Role Switcher */}
          <button
            onClick={handleRoleToggle}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border hover:bg-opacity-80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-[#7CFF4D] hover:bg-neutral-800'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Click to toggle between Candidate and Admin view"
          >
            <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-indigo-600'}`} />
            <span>Role: <strong className={`capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{role || 'Guest'}</strong></span>
          </button>

          {/* Auth Button or User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className={`flex items-center gap-2 p-1 pr-3 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                }`}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                />
                <span className={`text-xs font-semibold hidden sm:inline font-serif-luxury ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <GlowingButton variant={isDark ? 'ghost' : 'ghost'} size="sm" className={isDark ? 'text-white hover:text-neutral-300' : ''}>Login</GlowingButton>
              </Link>
              <Link to="/register">
                <GlowingButton variant={isDark ? 'emerald' : 'cyan'} size="sm" className={isDark ? 'bg-gradient-to-r from-[#7CFF4D] to-[#FFD84D] text-black border-[#7CFF4D]/30 font-bold hover:shadow-[0_0_15px_rgba(124,255,77,0.3)]' : ''}>Start Assessment</GlowingButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
