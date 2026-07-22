import React, { useRef, useCallback } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hoverEffect) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    cardRef.current.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
  }, [hoverEffect]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'rounded-[28px] transition-[transform,box-shadow,border-color,background] duration-500 ease-out relative overflow-hidden',
        glow ? 'glass-panel-glow' : 'glass-card',
        hoverEffect && 'hover:border-sky-400/50 hover:shadow-xl hover:shadow-sky-500/10',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        '--glare-x': '50%',
        '--glare-y': '50%',
      } as React.CSSProperties}
      {...props}
    >
      {/* Glare overlay that follows mouse */}
      {hoverEffect && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: 'radial-gradient(circle 250px at var(--glare-x) var(--glare-y), rgba(255,255,255,0.15), transparent 70%)',
          }}
        />
      )}
      {children}
    </div>
  );
};
