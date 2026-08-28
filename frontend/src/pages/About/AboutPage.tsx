import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Trophy, Sparkles } from 'lucide-react';

import kishoreImg from '../../assets/kishore.jpg';

/* ─── SVG Rotating Dashed Ring ─── */
const RotatingDashedRing: React.FC<{
  size: number;
  strokeColor: string;
  strokeColor2?: string;
  dashArray?: string;
  duration?: number;
  reverse?: boolean;
  offset?: number;
}> = ({
  size,
  strokeColor,
  strokeColor2,
  dashArray = '12 8',
  duration = 8,
  reverse = false,
  offset = 0,
}) => {
  const r = (size - 6) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const gradientId = `ring-grad-${size}-${offset}`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute top-1/2 left-1/2"
      style={{
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="100%" stopColor={strokeColor2 || strokeColor} />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeDashoffset={offset}
      />
    </motion.svg>
  );
};

/* ─── Floating Particles Background ─── */
const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      'rgba(124,255,77,', // green
      'rgba(255,60,60,',  // red
      'rgba(255,216,77,', // gold
      'rgba(255,255,255,', // white
    ];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

/* ─── Profile Card ─── */
const ProfileCard: React.FC<{
  name: string;
  image: string;
  bio: string;
  badge: string;
  accentColor: string;
  accentColor2: string;
  delay: number;
  icon: React.ReactNode;
}> = ({ name, image, bio, badge, accentColor, accentColor2, delay, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        type: 'spring',
        stiffness: 80,
        damping: 15,
      }}
      className="flex flex-col items-center group max-w-md mx-auto"
    >
      {/* Avatar container with rotating dashed rings */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-8 flex items-center justify-center">
        {/* Outer ring — slow, dashed */}
        <RotatingDashedRing
          size={270}
          strokeColor={accentColor}
          strokeColor2={accentColor2}
          dashArray="18 12 6 12"
          duration={12}
          offset={0}
        />
        {/* Middle ring — medium, offset dash */}
        <RotatingDashedRing
          size={244}
          strokeColor={accentColor2}
          strokeColor2={accentColor}
          dashArray="8 14"
          duration={8}
          reverse
          offset={20}
        />
        {/* Inner ring — fast, fine dash */}
        <RotatingDashedRing
          size={218}
          strokeColor={accentColor}
          strokeColor2="rgba(255,216,77,0.7)"
          dashArray="4 10 8 10"
          duration={6}
          offset={40}
        />

        {/* Glow pulse behind avatar */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 190,
            height: 190,
            top: '50%',
            left: '50%',
            marginLeft: -95,
            marginTop: -95,
            background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Profile image — circular crop */}
        <div
          className="absolute rounded-full overflow-hidden border-2 shadow-2xl transition-transform duration-500 group-hover:scale-105"
          style={{
            width: 190,
            height: 190,
            top: '50%',
            left: '50%',
            marginLeft: -95,
            marginTop: -95,
            borderColor: accentColor,
            boxShadow: `0 0 30px ${accentColor}33, 0 0 60px ${accentColor}11`,
          }}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Name */}
      <motion.h3
        className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif-luxury mb-2 text-center"
        style={{ textShadow: `0 0 20px ${accentColor}33` }}
      >
        {name}
      </motion.h3>

      {/* Badge pill */}
      <motion.div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-semibold tracking-wider uppercase mb-5"
        style={{
          borderColor: `${accentColor}55`,
          backgroundColor: `${accentColor}11`,
          color: accentColor,
        }}
        whileHover={{ scale: 1.05 }}
      >
        {icon}
        <span>{badge}</span>
      </motion.div>

      {/* Bio */}
      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans font-light text-center max-w-md px-2">
        {bio}
      </p>

      {/* SIET Hackathon badge */}
      <motion.div
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl border backdrop-blur-md"
        style={{
          borderColor: 'rgba(255,216,77,0.3)',
          backgroundColor: 'rgba(255,216,77,0.06)',
        }}
        whileHover={{
          borderColor: 'rgba(255,216,77,0.6)',
          boxShadow: '0 0 20px rgba(255,216,77,0.15)',
        }}
      >
        <Trophy className="w-4 h-4 text-[#FFD84D]" />
        <span className="text-xs font-mono font-bold text-[#FFD84D] tracking-wider">
          SIET HACKATHON FINALIST
        </span>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════ ABOUT PAGE ═══════════════════════════════════════════════ */
export const AboutPage: React.FC = () => {
  const member = {
    name: 'KISHORE S',
    image: kishoreImg,
    bio: 'Java Full Stack Developer | 100+ LeetCode Problems Solved | DSA & Competitive Programming Enthusiast | Building AI-Powered Web Applications & Scalable Solutions | Cloud Computing | 2nd Year CSE Student.',
    badge: 'Full Stack Dev',
    accentColor: '#7CFF4D',
    accentColor2: '#00E5FF',
    icon: <Code2 className="w-3.5 h-3.5" />,
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-serif-luxury selection:bg-[#7CFF4D]/20 selection:text-white">
      {/* ═══ Green-Red Gradient Background ═══ */}
      <div className="fixed inset-0 z-0">
        {/* Base dark */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Green glow — top left */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-25"
          style={{
            background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)',
            top: '-15%',
            left: '-10%',
          }}
        />

        {/* Red glow — bottom right */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-25"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)',
            bottom: '-15%',
            right: '-10%',
          }}
        />

        {/* Green glow — center bottom */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)',
            bottom: '5%',
            left: '30%',
          }}
        />

        {/* Red accent — top right */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
            top: '10%',
            right: '20%',
          }}
        />

        {/* Subtle mesh grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* ═══ Content ═══ */}
      <div className="relative z-10">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8 px-6 sm:px-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-sans font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <div className="text-center pt-12 pb-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-white/10 text-xs text-neutral-300 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD84D] animate-pulse" />
            <span className="font-semibold font-sans tracking-[0.2em] uppercase text-[10px]">
              THE MIND BEHIND CODESHIELD
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] mb-4"
          >
            MEET THE{' '}
            <span className="bg-gradient-to-r from-[#22c55e] via-[#7CFF4D] to-[#FFD84D] bg-clip-text text-transparent">
              CREATOR
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-[3px] mx-auto rounded-full mb-6"
            style={{
              background: 'linear-gradient(90deg, #22c55e, #ef4444)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg font-sans font-light leading-relaxed"
          >
            Passionate full stack developer and competitive programmer building
            the future of secure, AI-powered examination and anti-malpractice monitoring systems.
          </motion.p>
        </div>

        {/* ═══ Profile Card (Centered) ═══ */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 flex justify-center">
          <ProfileCard
            {...member}
            delay={0.3}
          />
        </div>

        {/* ═══ Bottom CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center pb-20 px-4"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl">
            <img
              src={member.image}
              alt={member.name}
              className="w-11 h-11 rounded-full border-2 border-[#7CFF4D] object-cover object-top shadow-lg shadow-[#7CFF4D]/20"
            />
            <div className="text-left">
              <p className="text-white text-sm font-bold font-serif-luxury">
                Built with 🔥 by Kishore S
              </p>
              <p className="text-neutral-500 text-xs font-sans">
                SIET Hackathon Finalist — CodeShield Creator
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

