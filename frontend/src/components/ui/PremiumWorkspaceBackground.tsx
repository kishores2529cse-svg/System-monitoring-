import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

type Ripple = { x: number; y: number; radius: number; opacity: number };

/** A low-density canvas layer for authenticated workspace routes only. */
export const PremiumWorkspaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !layer || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: window.innerWidth * 0.55, y: window.innerHeight * 0.35, targetX: window.innerWidth * 0.55, targetY: window.innerHeight * 0.35, lastX: window.innerWidth * 0.55, lastY: window.innerHeight * 0.35 };
    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;
    let frame = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const density = coarsePointer ? 22 : 48;
      particles = Array.from({ length: density }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
        x,
        y,
        homeX: x,
        homeY: y,
        previousX: x,
        previousY: y,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        size: Math.random() * 1.2 + 0.45,
        phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const movePointer = (event: PointerEvent) => {
      const velocity = Math.hypot(event.clientX - pointer.lastX, event.clientY - pointer.lastY);
      if (!reducedMotion && velocity > 30) {
        ripples.push({ x: event.clientX, y: event.clientY, radius: 4, opacity: Math.min(0.22, velocity / 250) });
        ripples = ripples.slice(-4);
      }
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
    };

    const updateScroll = () => { scrollY = window.scrollY; };

    const draw = (time: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      const nx = pointer.x / width - 0.5;
      const ny = pointer.y / height - 0.5;
      layer.style.setProperty('--pointer-x', `${nx * 18}px`);
      layer.style.setProperty('--pointer-y', `${ny * 18}px`);
      layer.style.setProperty('--pointer-x-slow', `${nx * -12}px`);
      layer.style.setProperty('--pointer-y-slow', `${ny * -12}px`);
      layer.style.setProperty('--pointer-x-fast', `${nx * 28}px`);
      layer.style.setProperty('--pointer-y-fast', `${ny * 28}px`);
      layer.style.setProperty('--cursor-left', `${pointer.x}px`);
      layer.style.setProperty('--cursor-top', `${pointer.y}px`);
      layer.style.setProperty('--scroll-shift', `${Math.min(scrollY * 0.025, 42)}px`);

      context.clearRect(0, 0, width, height);
      const spotlight = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.min(width, height) * 0.43);
      spotlight.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      spotlight.addColorStop(0.38, 'rgba(99, 102, 241, 0.045)');
      spotlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = spotlight;
      context.fillRect(0, 0, width, height);

      ripples = ripples.filter((ripple) => ripple.opacity > 0.008);
      ripples.forEach((ripple) => {
        ripple.radius += 3.1;
        ripple.opacity *= 0.952;
        context.strokeStyle = `rgba(56, 189, 248, ${ripple.opacity})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.stroke();
      });

      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.vx += (particle.homeX - particle.x) * 0.00042;
        particle.vy += (particle.homeY - particle.y) * 0.00042;
        if (!reducedMotion && distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.065;
          particle.vy += (dy / distance) * force * 0.065;
          particle.vx += (-dy / distance) * force * 0.012;
          particle.vy += (dx / distance) * force * 0.012;
        }
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy + (reducedMotion ? 0 : Math.sin(time * 0.00045 + particle.phase) * 0.025);
        if (particle.x < -18 || particle.x > width + 18 || particle.y < -18 || particle.y > height + 18) {
          particle.x = particle.homeX;
          particle.y = particle.homeY;
          particle.vx = 0;
          particle.vy = 0;
        }
      });

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        for (let neighbor = index + 1; neighbor < particles.length; neighbor += 1) {
          const other = particles[neighbor];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 118) {
            context.strokeStyle = `rgba(56, 189, 248, ${(1 - distance / 118) * 0.105})`;
            context.lineWidth = 0.55;
            const middleX = (particle.x + other.x) / 2;
            const middleY = (particle.y + other.y) / 2;
            const pointerDistance = Math.hypot(middleX - pointer.x, middleY - pointer.y);
            const bend = Math.max(0, 1 - pointerDistance / 190) * 18;
            const directionX = (middleX - pointer.x) / (pointerDistance || 1);
            const directionY = (middleY - pointer.y) / (pointerDistance || 1);
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.quadraticCurveTo(middleX + directionX * bend, middleY + directionY * bend, other.x, other.y);
            context.stroke();
          }
        }
        const glow = 0.22 + Math.sin(time * 0.0011 + particle.phase) * 0.09;
        context.strokeStyle = `rgba(14, 165, 233, ${glow * 0.18})`;
        context.lineWidth = particle.size * 0.7;
        context.beginPath();
        context.moveTo(particle.previousX, particle.previousY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
        context.fillStyle = `rgba(14, 165, 233, ${glow})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', movePointer, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
      window.removeEventListener('scroll', updateScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="premium-workspace-background" aria-hidden="true">
      <canvas ref={canvasRef} className="premium-workspace-background__canvas" />
      <div className="premium-workspace-background__aurora" />
      <div className="premium-workspace-background__orb premium-workspace-background__orb--one" />
      <div className="premium-workspace-background__orb premium-workspace-background__orb--two" />
      <div className="premium-workspace-background__glass premium-workspace-background__glass--one" />
      <div className="premium-workspace-background__glass premium-workspace-background__glass--two" />
      <div className="premium-workspace-background__ring" />
      <div className="premium-workspace-background__cursor-aura" />
    </div>
  );
};
