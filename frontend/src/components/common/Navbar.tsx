import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShieldCheck, Home, BarChart3, Code, UserCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavbarProps {
  theme?: 'light' | 'dark';
}

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'Exam', to: '/exam/101', icon: Code },
  { label: 'Leaderboard', to: '/leaderboard', icon: ShieldCheck }
];

export const Navbar: React.FC<NavbarProps> = ({ theme = 'light' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500',
      isDark ? 'bg-slate-950/80 border-slate-800/70 text-slate-100' : 'bg-white/70 border-slate-200/70 text-slate-900'
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:scale-[1.02]">
          <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg', isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/80')}>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold">CodeShield</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Secure Exam</span>
          </span>
        </Link>

        <nav className="hidden gap-1 md:flex md:items-center md:gap-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className={cn(
                'group inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition duration-300',
                isDark
                  ? 'border-slate-800 bg-slate-950/70 text-slate-100 hover:border-slate-600 hover:bg-slate-900/90 hover:text-white'
                  : 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300 hover:bg-white hover:text-slate-950'
              )}
            >
              <Icon className="h-4 w-4 text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.7)] backdrop-blur-sm md:inline-flex bg-emerald-500/10 border-emerald-400/20">
            Secure Mode Active
          </div>
          <Link
            to="/profile"
            className={cn(
              'hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-300',
              isDark
                ? 'border-slate-800 bg-slate-950/70 text-slate-100 hover:border-slate-600 hover:bg-slate-900/90'
                : 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300 hover:bg-white'
            )}
          >
            <UserCircle className="h-4 w-4 text-cyan-400" />
            Candidate
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(prev => !prev)}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-300 md:hidden',
              isDark ? 'border-slate-800 bg-slate-950/70 text-slate-100 hover:border-slate-600' : 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300'
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={cn(
          'border-t backdrop-blur-xl transition-all duration-300 md:hidden',
          isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/85'
        )}>
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 sm:px-6">
            {navItems.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold transition duration-300',
                  isDark
                    ? 'border-slate-800 bg-slate-950/80 text-slate-100 hover:border-slate-600 hover:bg-slate-900/95'
                    : 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300 hover:bg-white'
                )}
              >
                <Icon className="h-4 w-4 text-sky-400" />
                {label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold transition duration-300',
                isDark
                  ? 'border-slate-800 bg-slate-950/80 text-slate-100 hover:border-slate-600 hover:bg-slate-900/95'
                  : 'border-slate-200 bg-white/80 text-slate-900 hover:border-slate-300 hover:bg-white'
              )}
            >
              <UserCircle className="h-4 w-4 text-cyan-400" />
              Candidate Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
