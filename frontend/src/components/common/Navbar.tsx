import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Shield, Home, ClipboardList, BookOpen, BarChart3, UserCircle, ShieldCheck } from 'lucide-react';
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
        { label: 'Profile', to: '/profile', icon: UserCircle }
      ]
    : candidateNavItems;

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b border-slate-200/70 backdrop-blur-xl transition duration-300',
      isDark ? 'bg-slate-950/90 text-slate-100' : 'bg-white/90 text-slate-900'
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 transition duration-300 hover:scale-[1.01]">
          <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-3xl border shadow-sm', isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/90')}>
            <Shield className={cn('h-5 w-5', isDark ? 'text-emerald-400' : 'text-sky-500')} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-[0.02em]">CodeShield</span>
            <span className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{isAdmin ? 'Admin Command' : 'Candidate Hub'}</span>
          </div>
        </NavLink>

        <nav className="hidden flex-1 items-center justify-center gap-3 md:flex">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => cn(
                'group relative inline-flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold transition duration-300',
                isActive
                  ? 'border-sky-500 bg-sky-500/10 text-slate-900 shadow-sm shadow-sky-500/10'
                  : 'border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4 text-sky-500 transition-transform duration-300 group-hover:-translate-y-0.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">{isAdmin ? 'Administrator' : 'Candidate'}</span>
          <NavLink to="/profile" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition duration-300 hover:border-slate-300 hover:bg-slate-100">
            <UserCircle className="h-4 w-4 text-sky-500" />
            Profile
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-3xl border transition duration-300 md:hidden',
            isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
          )}
          aria-label="Open navigation menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 pt-3 sm:px-6">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => cn(
                  'group flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold transition duration-300',
                  isActive
                    ? 'border-sky-500 bg-sky-500/10 text-slate-900 shadow-sm shadow-sky-500/10'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className="h-4 w-4 text-sky-500" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
