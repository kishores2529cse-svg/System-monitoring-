import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Shield, Home, ClipboardList, BookOpen, BarChart3, UserCircle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  theme?: 'light' | 'dark';
}

const candidateNavItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Assessments', to: '/assessments', icon: ClipboardList },
  { label: 'Problems', to: '/problems', icon: BookOpen },
  { label: 'Results', to: '/results', icon: BarChart3 },
  { label: 'Admin', to: '/admin/dashboard', icon: ShieldCheck },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Profile', to: '/profile', icon: UserCircle }
];

export const Navbar: React.FC<NavbarProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role } = useAuth();
  const isDark = true;
  const isAdmin = role === 'admin';
  const navItems = isAdmin
    ? [
        { label: 'Admin', to: '/admin/dashboard', icon: ShieldCheck },
        { label: 'Leaderboard', to: '/leaderboard', icon: BarChart3 },
        { label: 'About', to: '/about', icon: Info },
        { label: 'Profile', to: '/profile', icon: UserCircle }
      ]
    : candidateNavItems;

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b border-[#FFD84D]/10 bg-[#07110a]/88 text-slate-100 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-colors duration-500',
      isDark ? 'text-slate-100' : 'text-slate-900'
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <NavLink to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="group flex items-center gap-3 transition duration-500 hover:scale-[1.015]">
          <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-[#10200f] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_-16px_rgba(124,255,77,0.8)] transition duration-500 group-hover:-rotate-3 group-hover:border-[#7CFF4D]/55 group-hover:shadow-[0_16px_28px_-16px_rgba(124,255,77,0.9)]', isDark ? 'border-[#FFD84D]/15' : 'border-slate-200 bg-white/90')}>
            <Shield className={cn('h-5 w-5 transition-transform duration-500 group-hover:scale-110', isDark ? 'text-[#7CFF4D]' : 'text-sky-500')} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-[0.02em]">CodeShield</span>
            <span className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{isAdmin ? 'Admin Command' : 'Candidate Hub'}</span>
          </div>
        </NavLink>

        <nav className="hidden flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[#FFD84D]/10 bg-black/15 p-1.5 md:flex">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => cn(
                'group relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-500 ease-out',
                isActive
                  ? 'border-[#7CFF4D]/30 bg-[#7CFF4D]/12 text-[#fdf8e8] shadow-[0_8px_20px_-14px_rgba(124,255,77,0.85)]'
                  : 'border-transparent text-slate-300 hover:-translate-y-0.5 hover:border-[#FFD84D]/15 hover:bg-white/[0.055] hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 text-[#7CFF4D] transition-all duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full border border-[#FFD84D]/15 bg-[#FFD84D]/[0.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFD84D]">{isAdmin ? 'Administrator' : 'Candidate'}</span>
          <NavLink to="/profile" className="group inline-flex items-center gap-2 rounded-xl border border-[#FFD84D]/15 bg-white/[0.045] px-3.5 py-2.5 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:border-[#7CFF4D]/40 hover:bg-[#7CFF4D]/10 hover:shadow-[0_12px_24px_-18px_rgba(124,255,77,1)]">
            <UserCircle className="h-4 w-4 text-[#7CFF4D] transition-transform duration-500 group-hover:scale-110" />
            Profile
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-500 md:hidden',
            isDark ? 'border-[#FFD84D]/15 bg-white/[0.045] text-slate-100 hover:border-[#7CFF4D]/45 hover:bg-[#7CFF4D]/10' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          )}
          aria-label="Open navigation menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#FFD84D]/10 bg-[#091109]/95 backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 pt-3 sm:px-6">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => cn(
                  'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-500',
                  isActive
                    ? 'border-[#7CFF4D]/30 bg-[#7CFF4D]/12 text-white shadow-[0_8px_20px_-14px_rgba(124,255,77,0.85)]'
                    : 'border-transparent text-slate-300 hover:border-[#FFD84D]/15 hover:bg-white/[0.055] hover:text-white'
                )}
              >
                <Icon className="h-4 w-4 text-[#7CFF4D] transition-transform duration-500 group-hover:scale-110" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
