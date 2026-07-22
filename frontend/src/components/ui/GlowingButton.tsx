import React from 'react';
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
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4.5 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6.5 py-3 text-base rounded-2xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    cyan: 'bg-[#7CFF4D] text-[#090909] border border-[#A3FF1A]/70 shadow-[0_10px_28px_rgba(124,255,77,0.16)] hover:bg-[#A3FF1A] hover:-translate-y-0.5',
    purple: 'bg-[#FFD84D] text-[#090909] border border-[#FFD84D]/70 shadow-[0_10px_28px_rgba(255,216,77,0.14)] hover:bg-[#ffe477] hover:-translate-y-0.5',
    emerald: 'bg-[#173013] text-[#dfffd2] border border-[#7CFF4D]/30 hover:bg-[#203c1a] hover:-translate-y-0.5',
    rose: 'bg-[#3a1e19] text-[#ffd8cf] border border-[#d58d7d]/30 hover:bg-[#4a2720] hover:-translate-y-0.5',
    secondary: 'bg-white/5 hover:bg-white/10 text-[#fdf8e8] border border-white/10 hover:border-[#FFD84D]/30',
    ghost: 'bg-transparent hover:bg-white/5 text-[#d7dfd2] hover:text-white',
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium font-serif-luxury transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none relative overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-[inherit]">
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    </button>
  );
};
