import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  color: string;
  size: number;
  speed: number;
}

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
  pulseProgress: number;
  pulseActive: boolean;
  pulseTarget: number;
  pulseSpeed: number;
}

interface RadarWave {
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let frameId: number;
    let time = 0;

    // ─── CAMERA / PERSPECTIVE SETTINGS ───
    const focalLength = 350;

    // ─── 3D HOLOGRAPHIC PARTICLES ───
    const particleCount = 120;
    const particles: Point3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * W * 1.5;
      const py = (Math.random() - 0.5) * H * 1.5;
      const pz = Math.random() * 800 + 100;
      
      const colors = [
        'rgba(124, 255, 77, ',  // Neon Green
        'rgba(163, 255, 26, ',  // Electric Lime
        'rgba(255, 216, 77, '   // Golden Yellow
      ];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x: px,
        y: py,
        z: pz,
        originalX: px,
        originalY: py,
        originalZ: pz,
        color: baseColor,
        size: 0.8 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.4
      });
    }

    // ─── CIRCUIT NETWORK ───
    const nodes: CircuitNode[] = [];
    const buildCircuit = () => {
      nodes.length = 0;
      // Left side clusters (around the text)
      const leftAnchors = [
        { x: W * 0.05, y: H * 0.2 },
        { x: W * 0.15, y: H * 0.15 },
        { x: W * 0.25, y: H * 0.25 },
        { x: W * 0.08, y: H * 0.45 },
        { x: W * 0.22, y: H * 0.5 },
        { x: W * 0.35, y: H * 0.4 },
        { x: W * 0.12, y: H * 0.75 },
        { x: W * 0.28, y: H * 0.85 },
        { x: W * 0.05, y: H * 0.9 }
      ];

      // Right side clusters (behind the robot HUD)
      const rightAnchors = [
        { x: W * 0.65, y: H * 0.15 },
        { x: W * 0.8, y: H * 0.1 },
        { x: W * 0.92, y: H * 0.25 },
        { x: W * 0.6, y: H * 0.5 },
        { x: W * 0.75, y: H * 0.45 },
        { x: W * 0.9, y: H * 0.55 },
        { x: W * 0.68, y: H * 0.8 },
        { x: W * 0.82, y: H * 0.85 },
        { x: W * 0.95, y: H * 0.75 }
      ];

      const allAnchors = [...leftAnchors, ...rightAnchors];
      allAnchors.forEach(a => {
        nodes.push({
          x: a.x,
          y: a.y,
          connections: [],
          pulseProgress: 0,
          pulseActive: Math.random() > 0.5,
          pulseTarget: -1,
          pulseSpeed: 0.005 + Math.random() * 0.008
        });
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = W * 0.25;
          const sameSide = (nodes[i].x < W * 0.5 && nodes[j].x < W * 0.5) ||
                           (nodes[i].x > W * 0.5 && nodes[j].x > W * 0.5);
          if (sameSide && dist < limit) {
            nodes[i].connections.push(j);
            nodes[j].connections.push(i);
          }
        }
      }
    };
    buildCircuit();

    const radarWaves: RadarWave[] = [
      { radius: 0, maxRadius: W * 0.35, speed: 0.8, alpha: 0.4 },
      { radius: (W * 0.35) * 0.5, maxRadius: W * 0.35, speed: 0.8, alpha: 0.2 }
    ];

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildCircuit();
      radarWaves.forEach(w => w.maxRadius = W * 0.35);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / W) * 2 - 1;
      mouseRef.current.ty = (e.clientY / H) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.005;

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      ctx.fillStyle = '#090909';
      ctx.fillRect(0, 0, W, H);

      // ─── 1. AMBIENT GLOWS ───
      const greenGlow = ctx.createRadialGradient(
        W * 0.8 + mouseX * 40, H * 0.7 + mouseY * 40, 0,
        W * 0.8 + mouseX * 40, H * 0.7 + mouseY * 40, Math.min(W, H) * 0.6
      );
      greenGlow.addColorStop(0, 'rgba(124, 255, 77, 0.055)');
      greenGlow.addColorStop(0.5, 'rgba(124, 255, 77, 0.015)');
      greenGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = greenGlow;
      ctx.fillRect(0, 0, W, H);

      const yellowGlow = ctx.createRadialGradient(
        W * 0.2 + mouseX * 20, H * 0.3 + mouseY * 20, 0,
        W * 0.2 + mouseX * 20, H * 0.3 + mouseY * 20, Math.min(W, H) * 0.45
      );
      yellowGlow.addColorStop(0, 'rgba(255, 216, 77, 0.025)');
      yellowGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = yellowGlow;
      ctx.fillRect(0, 0, W, H);

      // ─── 2. PERSPECTIVE GRID ───
      ctx.strokeStyle = 'rgba(124, 255, 77, 0.02)';
      ctx.lineWidth = 1;
      
      const gridY = H * 0.8;
      const horizonZ = 600;
      const stepZ = 40;
      const gridSpeed = time * 25;

      for (let z = stepZ; z < horizonZ; z += stepZ) {
        const animatedZ = horizonZ - ((z + gridSpeed) % horizonZ);
        if (animatedZ <= 0) continue;

        const screenY = gridY + (focalLength * 120) / animatedZ;
        if (screenY > H) continue;

        const alpha = Math.max(0, 1 - animatedZ / horizonZ) * 0.4;
        ctx.strokeStyle = `rgba(124, 255, 77, ${alpha * 0.04})`;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(W, screenY);
        ctx.stroke();
      }

      const cols = 26;
      for (let i = -cols / 2; i <= cols / 2; i++) {
        const xOffset = i * 65 + mouseX * -30;
        
        ctx.beginPath();
        const startX = W * 0.5 + mouseX * -15;
        ctx.moveTo(startX, gridY);
        
        const bottomX = W * 0.5 + xOffset * (focalLength / 30);
        ctx.lineTo(bottomX, H);
        ctx.stroke();
      }

      // ─── 3. RADAR SCAN WAVES ───
      const radarCenterX = W * 0.76 + mouseX * -12;
      const radarCenterY = H * 0.44 + mouseY * -12;

      radarWaves.forEach(wave => {
        wave.radius += wave.speed;
        if (wave.radius > wave.maxRadius) {
          wave.radius = 0;
        }

        wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius) * 0.12;

        ctx.strokeStyle = `rgba(124, 255, 77, ${wave.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, wave.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 216, 77, ${wave.alpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, wave.radius * 1.1, 0.2 * Math.PI, 0.4 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, wave.radius * 1.1, 1.2 * Math.PI, 1.4 * Math.PI);
        ctx.stroke();
      });

      // ─── 4. CIRCUIT NETWORK & TRACES ───
      ctx.lineWidth = 0.8;
      nodes.forEach((node, i) => {
        node.connections.forEach(connIdx => {
          if (connIdx > i) {
            const target = nodes[connIdx];
            ctx.beginPath();
            ctx.moveTo(node.x + mouseX * -10, node.y + mouseY * -10);
            
            const midX = (node.x + target.x) / 2;
            ctx.lineTo(midX + mouseX * -10, node.y + mouseY * -10);
            ctx.lineTo(midX + mouseX * -10, target.y + mouseY * -10);
            ctx.lineTo(target.x + mouseX * -10, target.y + mouseY * -10);
            
            ctx.strokeStyle = 'rgba(124, 255, 77, 0.015)';
            ctx.stroke();
          }
        });

        if (node.pulseActive) {
          if (node.pulseTarget === -1 && node.connections.length > 0) {
            node.pulseTarget = node.connections[Math.floor(Math.random() * node.connections.length)];
            node.pulseProgress = 0;
          }

          if (node.pulseTarget !== -1) {
            node.pulseProgress += node.pulseSpeed;
            if (node.pulseProgress >= 1) {
              const oldTarget = node.pulseTarget;
              node.pulseActive = false;
              node.pulseTarget = -1;
              node.pulseProgress = 0;

              if (Math.random() > 0.3) {
                nodes[oldTarget].pulseActive = true;
                nodes[oldTarget].pulseTarget = -1;
              }
            } else {
              const target = nodes[node.pulseTarget];
              const midX = (node.x + target.x) / 2;
              let px = node.x;
              let py = node.y;

              if (node.pulseProgress < 0.5) {
                const sub = node.pulseProgress / 0.5;
                px = node.x + (midX - node.x) * sub;
                py = node.y;
              } else {
                const sub = (node.pulseProgress - 0.5) / 0.5;
                px = midX + (target.x - midX) * sub;
                py = node.y + (target.y - node.y) * sub;
              }

              ctx.beginPath();
              ctx.arc(px + mouseX * -10, py + mouseY * -10, 2, 0, Math.PI * 2);
              const colorSelector = i % 3 === 0 ? 'rgba(255, 216, 77, 0.7)' : 'rgba(124, 255, 77, 0.7)';
              ctx.fillStyle = colorSelector;
              ctx.fill();

              const pGlow = ctx.createRadialGradient(
                px + mouseX * -10, py + mouseY * -10, 0,
                px + mouseX * -10, py + mouseY * -10, 8
              );
              pGlow.addColorStop(0, i % 3 === 0 ? 'rgba(255, 216, 77, 0.15)' : 'rgba(124, 255, 77, 0.15)');
              pGlow.addColorStop(1, 'transparent');
              ctx.fillStyle = pGlow;
              ctx.beginPath();
              ctx.arc(px + mouseX * -10, py + mouseY * -10, 8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else {
          if (Math.random() < 0.001) {
            node.pulseActive = true;
            node.pulseTarget = -1;
          }
        }

        const alphaPulse = 0.05 + Math.sin(time * 2 + i) * 0.03;
        ctx.fillStyle = i % 4 === 0 ? `rgba(255, 216, 77, ${alphaPulse})` : `rgba(124, 255, 77, ${alphaPulse})`;
        ctx.beginPath();
        ctx.arc(node.x + mouseX * -10, node.y + mouseY * -10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = i % 4 === 0 ? `rgba(255, 216, 77, ${alphaPulse * 0.4})` : `rgba(124, 255, 77, ${alphaPulse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x + mouseX * -10, node.y + mouseY * -10, 6, 0, Math.PI * 2);
        ctx.stroke();
      });

      // ─── 5. VOLUMETRIC HOLOGRAPHIC DUST PARTICLES ───
      particles.forEach(p => {
        p.z -= p.speed * 0.6;
        if (p.z <= 0) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * W * 1.5;
          p.y = (Math.random() - 0.5) * H * 1.5;
        }

        const px = p.x + mouseX * -40;
        const py = p.y + mouseY * -40;

        const scale = focalLength / p.z;
        const screenX = W * 0.5 + px * scale;
        const screenY = H * 0.5 + py * scale;

        if (screenX >= 0 && screenX <= W && screenY >= 0 && screenY <= H) {
          const alpha = Math.min(1, scale * 1.4) * (0.05 + Math.sin(time * 0.5 + p.z) * 0.04);
          const size = p.size * Math.min(2.5, scale);

          ctx.fillStyle = `${p.color}${alpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();

          if (scale > 1.2) {
            ctx.fillStyle = `${p.color}${alpha * 0.35})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, size * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // ─── 6. LIGHT STREAKS ───
      const scanlineY = (time * 120) % H;
      ctx.fillStyle = 'rgba(124, 255, 77, 0.005)';
      ctx.fillRect(0, scanlineY, W, 1);

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#090909]">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ willChange: 'transform' }} />
    </div>
  );
};
