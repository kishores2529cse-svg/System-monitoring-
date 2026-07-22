import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const RobotSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // ─── MOUSE INTERACTION (MAX 5 DEGREE ROTATION) ───
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const rx = (dy / (window.innerHeight / 2)) * -5;
      const ry = (dx / (window.innerWidth / 2)) * 5;
      setCoords({ rx, ry });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ─── NATURAL BLINKING (6-10s) ───
  useEffect(() => {
    let timer: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        if (Math.random() > 0.65) {
          setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 120);
          }, 150);
        }
      }, 150);
      timer = setTimeout(triggerBlink, 6000 + Math.random() * 4000);
    };
    timer = setTimeout(triggerBlink, 7000);
    return () => clearTimeout(timer);
  }, []);

  // ─── 8-SECOND DIAGNOSTIC SCAN ───
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 2500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] lg:h-[750px] flex items-center justify-center select-none pointer-events-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Mouse-Tracking Wrapper */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ─── LAYER 1: FLOATING GREEN PARTICLES ─── */}
        <div className="absolute inset-0 z-0" style={{ transform: 'translateZ(-120px)' }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={`p-${i}`}
              className="absolute bg-[#7CFF4D] rounded-full animate-[floatDust_10s_ease-in-out_infinite]"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.15,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 12 + 8}s`,
                boxShadow: '0 0 8px #7CFF4D',
              }}
            />
          ))}
        </div>

        {/* ─── LAYER 2: MASSIVE ROTATING GREEN AI WHEEL ─── */}
        {/* Positioned to sit behind the robot's head (which is in the background poster image) */}
        <div 
          className="absolute z-10 pointer-events-none flex items-center justify-center transition-all duration-500" 
          style={{ 
            width: '800px',
            height: '800px',
            top: '34%',
            left: '65.5%',
            transform: 'translate3d(-50%, -50%, -40px)',
            filter: isScanning 
              ? 'brightness(1.8) drop-shadow(0 0 30px rgba(124,255,77,0.6))' 
              : 'drop-shadow(0 0 12px rgba(124,255,77,0.2))',
          }}
        >
          {/* Ring 1: Outermost dashed telemetry circle (Clockwise, slow) */}
          <svg className="absolute w-full h-full animate-[spin_55s_linear_infinite]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="98" fill="none" stroke="#7CFF4D" strokeWidth="0.3" strokeDasharray="2 5" opacity="0.25" />
            <circle cx="100" cy="100" r="95" fill="none" stroke="#7CFF4D" strokeWidth="0.15" strokeDasharray="8 4 2 4" opacity="0.2" />
          </svg>

          {/* Ring 2: Primary Thick Neon Green Arc (Counter-clockwise, medium speed) */}
          <svg className="absolute w-[84%] h-[84%] animate-[spin-reverse_28s_linear_infinite]" viewBox="0 0 200 200">
            {/* Main thick segmented arc */}
            <circle cx="100" cy="100" r="96" fill="none" stroke="#7CFF4D" strokeWidth="2" strokeDasharray="50 20 30 20" opacity="0.7" 
              style={{ filter: 'drop-shadow(0 0 6px #7CFF4D)' }} />
            {/* Yellow inner accent */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="#FFD84D" strokeWidth="1" strokeDasharray="15 8 5 8" opacity="0.5" />
            {/* Cardinal glowing dots */}
            <circle cx="100" cy="4" r="3" fill="#7CFF4D" style={{ filter: 'drop-shadow(0 0 8px #7CFF4D)' }} />
            <circle cx="100" cy="196" r="3" fill="#7CFF4D" style={{ filter: 'drop-shadow(0 0 8px #7CFF4D)' }} />
            <circle cx="4" cy="100" r="3" fill="#7CFF4D" style={{ filter: 'drop-shadow(0 0 8px #7CFF4D)' }} />
            <circle cx="196" cy="100" r="3" fill="#7CFF4D" style={{ filter: 'drop-shadow(0 0 8px #7CFF4D)' }} />
            {/* Diagonal dots */}
            <circle cx="30" cy="30" r="2" fill="#FFD84D" opacity="0.6" />
            <circle cx="170" cy="30" r="2" fill="#FFD84D" opacity="0.6" />
            <circle cx="30" cy="170" r="2" fill="#FFD84D" opacity="0.6" />
            <circle cx="170" cy="170" r="2" fill="#FFD84D" opacity="0.6" />
          </svg>

          {/* Ring 3: Mid-layer concentric track (Clockwise, different speed) */}
          <svg className="absolute w-[66%] h-[66%] animate-[spin_38s_linear_infinite]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="96" fill="none" stroke="#7CFF4D" strokeWidth="1" strokeDasharray="35 12 8 12" opacity="0.35" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="#7CFF4D" strokeWidth="0.4" strokeDasharray="4 4" opacity="0.3" />
          </svg>

          {/* Ring 4: Fast Radar Sweep Cone */}
          <div className="absolute w-[52%] h-[52%] rounded-full border border-[#7CFF4D]/20 overflow-hidden">
            <div className="w-1/2 h-full origin-right border-r-2 border-[#7CFF4D]/60 bg-gradient-to-r from-transparent to-[#7CFF4D]/15 animate-[spin_3s_linear_infinite]" />
          </div>

          {/* Ring 5: Inner Hexagon Grid (Very slow) */}
          <svg className="absolute w-[40%] h-[40%] animate-[spin_80s_linear_infinite]" viewBox="0 0 100 100">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#FFD84D" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.25" />
          </svg>

          {/* Center Crosshair */}
          <div className="absolute w-6 h-6 flex items-center justify-center">
            <span className="absolute w-4 h-[1px] bg-[#7CFF4D]/40" />
            <span className="absolute h-4 w-[1px] bg-[#7CFF4D]/40" />
            <span className="absolute w-6 h-6 rounded-full border border-[#7CFF4D]/20 animate-pulse" />
          </div>
        </div>

        {/* ─── LAYER 3: EYE VISOR GLOW ─── */}
        {/* This green glow sits on top of the background poster, directly over the robot's eye position */}
        <div 
          className="absolute z-30 transition-opacity duration-150"
          style={{
            top: '35%',
            left: '52%',
            width: '50px',
            height: '28px',
            opacity: isBlinking ? 0 : isScanning ? 1 : 0.8,
            transform: 'translateZ(60px)',
          }}
        >
          <div className="w-full h-[65%] rounded-full bg-[#7CFF4D] opacity-90 blur-[3px] shadow-[0_0_20px_#7CFF4D,0_0_40px_#7CFF4D]" />
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[40%] rounded-full bg-white/70 blur-[1px]" />
        </div>

        {/* ─── LAYER 4: HELMET SHIMMER & SCAN LASER ─── */}
        <div className="absolute inset-0 z-20 overflow-hidden" style={{ transform: 'translateZ(40px)' }}>
          {/* Titanium shimmer sweep */}
          <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-tr from-transparent via-[#7CFF4D]/8 to-transparent rotate-45 transform animate-helmet-shine" />
        </div>

        {/* Vertical 8-Second Diagnostic Scan Laser */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7CFF4D] to-transparent shadow-[0_0_20px_#7CFF4D,0_0_50px_#7CFF4D] z-40 pointer-events-none"
              style={{ transform: 'translateZ(70px)' }}
            >
              <div className="absolute w-full h-[120px] top-[-120px] bg-gradient-to-b from-transparent to-[#7CFF4D]/15 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── LAYER 5: RIGHT TELEMETRY LABELS ─── */}
        <div 
          className="absolute z-40 right-2 lg:right-4 top-[18%] bottom-[18%] flex flex-col justify-between text-right font-mono"
          style={{ transform: 'translateZ(90px)' }}
        >
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-sans">SYSTEM STATUS</span>
            <span className="text-sm font-bold text-[#7CFF4D] uppercase tracking-widest animate-pulse">ONLINE</span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-[#7CFF4D]/50 to-transparent mt-1" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-sans">STREAMING</span>
            <span className="text-sm font-bold text-[#7CFF4D] uppercase tracking-widest">ACTIVE</span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-[#7CFF4D]/50 to-transparent mt-1" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-sans">THREAT MONITORING</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-4 bg-[#7CFF4D] rounded-sm shadow-[0_0_6px_#7CFF4D]"></span>
              <span className="w-2.5 h-4 bg-[#7CFF4D] rounded-sm shadow-[0_0_6px_#7CFF4D]"></span>
              <span className="w-2.5 h-4 bg-[#7CFF4D] rounded-sm shadow-[0_0_6px_#7CFF4D]"></span>
              <span className="w-2.5 h-4 bg-[#7CFF4D] opacity-80 rounded-sm"></span>
              <span className="w-2.5 h-4 bg-[#7CFF4D] opacity-35 rounded-sm"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

