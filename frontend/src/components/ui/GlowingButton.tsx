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
    cyan: 'bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 hover:from-sky-500 hover:to-blue-600 border border-sky-400/40',
    purple: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 hover:from-indigo-500 hover:to-violet-600 border border-indigo-400/40',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 border border-emerald-400/40',
    rose: 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 border border-rose-400/40',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 hover:border-slate-400 shadow-xs hover:shadow-md',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900',
  };

  return (
    <button
      ref={btnRef}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium font-serif-luxury transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer select-none relative overflow-hidden',
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
