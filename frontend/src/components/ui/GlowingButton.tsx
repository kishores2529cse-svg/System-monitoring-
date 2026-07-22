import React, { useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  className,
  variant = 'cyan',
  size = 'md',
  icon,
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    /* magnetic pull: subtle translate toward cursor */
    const pullX = x * 0.15;
    const pullY = y * 0.15;
    btnRef.current.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.03)`;
    btnRef.current.style.setProperty('--btn-glow-x', `${e.clientX - rect.left}px`);
    btnRef.current.style.setProperty('--btn-glow-y', `${e.clientY - rect.top}px`);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translate(0px, 0px) scale(1)';
  }, []);

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4.5 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6.5 py-3 text-base rounded-2xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    cyan: 'bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 text-white shadow-[0_10px_30px_rgba(14,165,233,0.22)] hover:shadow-[0_14px_40px_rgba(14,165,233,0.28)] hover:from-sky-500 hover:to-indigo-500 border border-sky-400/40',
    purple: 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)] hover:shadow-[0_14px_40px_rgba(139,92,246,0.28)] hover:from-violet-500 hover:to-indigo-500 border border-violet-400/40',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.28)] border border-emerald-400/40',
    rose: 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-[0_10px_30px_rgba(244,63,94,0.22)] hover:shadow-[0_14px_40px_rgba(244,63,94,0.28)] border border-rose-400/40',
    secondary: 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-100 border border-slate-700/80 hover:border-slate-500 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-white/10 text-slate-200 hover:text-white',
  };

  return (
    <button
      ref={btnRef}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium font-serif-luxury transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer select-none relative overflow-hidden will-change-transform',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: 'transform',
        '--btn-glow-x': '50%',
        '--btn-glow-y': '50%',
      } as React.CSSProperties}
      {...props}
    >
      {/* Cursor glow effect */}
      <span
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle 80px at var(--btn-glow-x) var(--btn-glow-y), rgba(255,255,255,0.2), transparent 70%)',
        }}
      />
      <span className="relative z-10 flex items-center gap-[inherit]">
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    </button>
  );
};
