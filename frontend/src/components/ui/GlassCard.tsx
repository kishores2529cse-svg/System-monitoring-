import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl transition-[transform,box-shadow,border-color] duration-300 ease-out',
        glow ? 'glass-panel-glow' : 'glass-card',
        hoverEffect && 'hover:border-[#7CFF4D]/30 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
