import React, { useEffect, useRef } from 'react';

const spring = (cur: number, target: number, vel: number, stiffness = 0.03, damping = 0.85) => {
  const force = (target - cur) * stiffness;
  const nv = (vel + force) * damping;
  return { val: cur + nv, vel: nv };
};

interface Blob {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
  radius: number;
  hue: number; sat: number; light: number;
  phase: number; speed: number;
  drag: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseAlpha: number;
  radius: number;
  hue: number;
}

interface TrailPoint {
  x: number; y: number;
  age: number;
  maxAge: number;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -9999, y: -9999,
    tx: -9999, ty: -9999,
    nx: 0, ny: 0,
    tnx: 0, tny: 0,
    speed: 0,
    prevX: 0, prevY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let frameId: number;
    let time = 0;

    /* ─── organic blobs ─── */
    const buildBlobs = (): Blob[] => {
      const blobs: Blob[] = [];
      const configs = [
        { rx: 0.22, ry: 0.28, r: 0, h: 200, s: 80, l: 82, sp: 0.15, drag: 0.012 },
        { rx: 0.78, ry: 0.32, r: 0, h: 220, s: 75, l: 80, sp: 0.12, drag: 0.010 },
        { rx: 0.50, ry: 0.65, r: 0, h: 250, s: 70, l: 83, sp: 0.18, drag: 0.014 },
        { rx: 0.15, ry: 0.75, r: 0, h: 180, s: 65, l: 81, sp: 0.10, drag: 0.008 },
        { rx: 0.85, ry: 0.70, r: 0, h: 270, s: 60, l: 84, sp: 0.14, drag: 0.011 },
        { rx: 0.50, ry: 0.15, r: 0, h: 160, s: 85, l: 80, sp: 0.09, drag: 0.009 },
      ];
      configs.forEach(c => {
        const bx = c.rx * W;
        const by = c.ry * H;
        const radius = Math.min(W, H) * (0.18 + Math.random() * 0.12);
        blobs.push({
          x: bx, y: by, vx: 0, vy: 0,
          baseX: bx, baseY: by,
          radius, hue: c.h, sat: c.s, light: c.l,
          phase: Math.random() * Math.PI * 2,
          speed: c.sp, drag: c.drag,
        });
      });
      return blobs;
    };

    /* ─── particles ─── */
    const buildParticles = (): Particle[] => {
      const count = Math.min(Math.floor((W * H) / 14000), 65);
      const ps: Particle[] = [];
      for (let i = 0; i < count; i++) {
        ps.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          baseAlpha: 0.08 + Math.random() * 0.18,
          radius: 1 + Math.random() * 2,
          hue: 195 + Math.random() * 40,
        });
      }
      return ps;
    };

    let blobs = buildBlobs();
    let particles = buildParticles();
    const trail: TrailPoint[] = [];
    const MAX_TRAIL = 30;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      blobs = buildBlobs();
      particles = buildParticles();
    };
    window.addEventListener('resize', onResize);

    const onMouse = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.tx = e.clientX;
      m.ty = e.clientY;
      m.tnx = (e.clientX / W) * 2 - 1;
      m.tny = (e.clientY / H) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouse);

    /* ─── render loop ─── */
    const render = () => {
      const m = mouseRef.current;
      time += 0.016;

      /* lerp mouse */
      const prevX = m.x;
      const prevY = m.y;
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      m.nx += (m.tnx - m.nx) * 0.05;
      m.ny += (m.tny - m.ny) * 0.05;
      m.speed = Math.sqrt((m.x - prevX) ** 2 + (m.y - prevY) ** 2);

      /* cursor trail */
      if (m.x > -5000) {
        trail.push({ x: m.x, y: m.y, age: 0, maxAge: 25 });
        if (trail.length > MAX_TRAIL) trail.shift();
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > trail[i].maxAge) trail.splice(i, 1);
      }

      ctx.clearRect(0, 0, W, H);

      /* ─── 1. Large organic gradient blobs ─── */
      blobs.forEach(b => {
        /* floating motion */
        const floatX = Math.sin(time * b.speed + b.phase) * 40;
        const floatY = Math.cos(time * b.speed * 0.8 + b.phase * 1.4) * 30;

        /* mouse attraction — blobs gravitate toward cursor */
        const dx = m.x - b.x;
        const dy = m.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const attractForce = dist > 1 ? b.drag : 0;

        const tx = b.baseX + floatX + dx * attractForce;
        const ty = b.baseY + floatY + dy * attractForce;

        const sp = spring(b.x, tx, b.vx, 0.018, 0.94);
        b.x = sp.val; b.vx = sp.vel;
        const sp2 = spring(b.y, ty, b.vy, 0.018, 0.94);
        b.y = sp2.val; b.vy = sp2.vel;

        /* organic wobble via multiple overlapping circles */
        const wobbleR = b.radius * (0.9 + Math.sin(time * 0.7 + b.phase) * 0.08);
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, wobbleR);
        g.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0.35)`);
        g.addColorStop(0.4, `hsla(${b.hue}, ${b.sat - 5}%, ${b.light - 2}%, 0.18)`);
        g.addColorStop(0.7, `hsla(${b.hue}, ${b.sat - 10}%, ${b.light - 4}%, 0.06)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(b.x - wobbleR, b.y - wobbleR, wobbleR * 2, wobbleR * 2);
      });

      /* ─── 2. Cursor spotlight — multi-layered ─── */
      if (m.x > -5000) {
        const spotlightR = 420 + m.speed * 2;

        const sg1 = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, spotlightR);
        sg1.addColorStop(0, 'rgba(186, 230, 253, 0.12)');
        sg1.addColorStop(0.3, 'rgba(199, 210, 254, 0.06)');
        sg1.addColorStop(0.6, 'rgba(224, 242, 254, 0.03)');
        sg1.addColorStop(1, 'transparent');
        ctx.fillStyle = sg1;
        ctx.fillRect(0, 0, W, H);

        /* inner warm glow */
        const sg2 = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, spotlightR * 0.4);
        sg2.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        sg2.addColorStop(1, 'transparent');
        ctx.fillStyle = sg2;
        ctx.fillRect(0, 0, W, H);
      }

      /* ─── 3. Cursor trail ─── */
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const p = trail[i];
          const pp = trail[i - 1];
          const progress = p.age / p.maxAge;
          const alpha = (1 - progress) * 0.25;
          const width = (1 - progress) * 3;
          ctx.beginPath();
          ctx.moveTo(pp.x, pp.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      /* ─── 4. Subtle dot grid ─── */
      const gridSpacing = 48;
      const gridAlpha = 0.22;
      for (let gx = gridSpacing / 2; gx < W; gx += gridSpacing) {
        for (let gy = gridSpacing / 2; gy < H; gy += gridSpacing) {
          const ddx = m.x - gx;
          const ddy = m.y - gy;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          const proximity = dd < 200 ? (1 - dd / 200) : 0;
          const dotAlpha = gridAlpha + proximity * 0.35;
          const dotR = 1 + proximity * 1.5;
          ctx.beginPath();
          ctx.arc(gx, gy, dotR, 0, Math.PI * 2);
          ctx.fillStyle = proximity > 0
            ? `rgba(14, 165, 233, ${dotAlpha})`
            : `rgba(203, 213, 225, ${dotAlpha})`;
          ctx.fill();
        }
      }

      /* ─── 5. Particles with cursor repel and attract ─── */
      const mouseRepelR = 160;
      const mouseAttractR = 350;
      const nearList: { idx: number; dist: number }[] = [];

      particles.forEach((p, i) => {
        const dmx = m.x - p.x;
        const dmy = m.y - p.y;
        const dmd = Math.sqrt(dmx * dmx + dmy * dmy);

        if (m.x > -5000 && dmd < mouseRepelR) {
          const force = (1 - dmd / mouseRepelR) * 0.8;
          p.vx -= (dmx / dmd) * force;
          p.vy -= (dmy / dmd) * force;
        } else if (m.x > -5000 && dmd < mouseAttractR) {
          const force = (1 - dmd / mouseAttractR) * 0.008;
          p.vx += dmx * force;
          p.vy += dmy * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vx += (Math.random() - 0.5) * 0.008;
        p.vy += (Math.random() - 0.5) * 0.008;

        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        let extraAlpha = 0;
        if (dmd < 220 && m.x > -5000) {
          extraAlpha = (1 - dmd / 220) * 0.5;
          nearList.push({ idx: i, dist: dmd });
        }

        const a = p.baseAlpha + extraAlpha;
        const r = p.radius + extraAlpha * 1.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 74%, ${a})`;
        ctx.fill();

        if (extraAlpha > 0.08) {
          const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
          pg.addColorStop(0, `hsla(${p.hue}, 65%, 80%, ${extraAlpha * 0.25})`);
          pg.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
          ctx.fillStyle = pg;
          ctx.fill();
        }
      });

      /* ─── 6. Constellation lines ─── */
      const maxConn = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxConn) {
            const la = (1 - dist / maxConn) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(186, 211, 240, ${la})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* ─── 7. Mouse-to-particle lines ─── */
      if (m.x > -5000) {
        nearList.sort((a, b) => a.dist - b.dist);
        nearList.slice(0, 8).forEach(({ idx, dist: pDist }) => {
          const p = particles[idx];
          const la = 1 - pDist / 220;
          if (la > 0) {
            const lg = ctx.createLinearGradient(m.x, m.y, p.x, p.y);
            lg.addColorStop(0, `rgba(56, 189, 248, ${la * 0.3})`);
            lg.addColorStop(1, `rgba(186, 211, 240, ${la * 0.12})`);
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = lg;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      /* ─── 8. Cursor follower orb ─── */
      if (m.x > -5000) {
        const orbR = 6 + m.speed * 0.05;
        const og = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, orbR * 2);
        og.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        og.addColorStop(0.4, 'rgba(99, 102, 241, 0.2)');
        og.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(m.x, m.y, orbR * 2, 0, Math.PI * 2);
        ctx.fillStyle = og;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(m.x, m.y, orbR * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }

      /* ─── 9. Ambient color wash ─── */
      const w1 = ctx.createRadialGradient(W * 0.3, H * 0.25, 0, W * 0.3, H * 0.25, Math.max(W, H) * 0.5);
      w1.addColorStop(0, 'rgba(186, 230, 253, 0.05)');
      w1.addColorStop(1, 'transparent');
      ctx.fillStyle = w1;
      ctx.fillRect(0, 0, W, H);

      const w2 = ctx.createRadialGradient(W * 0.75, H * 0.75, 0, W * 0.75, H * 0.75, Math.max(W, H) * 0.45);
      w2.addColorStop(0, 'rgba(199, 210, 254, 0.04)');
      w2.addColorStop(1, 'transparent');
      ctx.fillStyle = w2;
      ctx.fillRect(0, 0, W, H);

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
