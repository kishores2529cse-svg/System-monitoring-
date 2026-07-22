import React, { useRef, useEffect } from 'react';
import { Camera, Mic, Eye, ShieldAlert, Cpu, Wifi } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';
import { getConfidenceColor } from '../../utils/cn';

export const AICameraWidget: React.FC<{ isCompact?: boolean }> = ({ isCompact = false }) => {
  const { confidenceScore, cameraActive, micActive, isFullscreen, warningsCount } = useMonitoring();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Canvas AI Face Mesh animation simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const renderMesh = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw bounding box
      ctx.strokeStyle = confidenceScore >= 85 ? 'rgba(16, 185, 129, 0.6)' : confidenceScore >= 65 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.9)';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 40, centerY - 45, 80, 90);

      // Corner crosshairs
      const drawCorner = (x: number, y: number, dx: number, dy: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * 10);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * 10, y);
        ctx.stroke();
      };
      drawCorner(centerX - 40, centerY - 45, 1, 1);
      drawCorner(centerX + 40, centerY - 45, -1, 1);
      drawCorner(centerX - 40, centerY + 45, 1, -1);
      drawCorner(centerX + 40, centerY + 45, -1, -1);

      // Simulated Face Landmarks Mesh
      ctx.fillStyle = '#00F2FE';
      const eyeL = { x: centerX - 18, y: centerY - 12 };
      const eyeR = { x: centerX + 18, y: centerY - 12 };
      const nose = { x: centerX, y: centerY + 5 };
      const mouthL = { x: centerX - 15, y: centerY + 22 };
      const mouthR = { x: centerX + 15, y: centerY + 22 };

      [eyeL, eyeR, nose, mouthL, mouthR].forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Eye Tracking Rays
      angle += 0.05;
      const scanY = centerY - 25 + Math.sin(angle) * 35;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 35, scanY);
      ctx.lineTo(centerX + 35, scanY);
      ctx.stroke();

      animationId = requestAnimationFrame(renderMesh);
    };

    renderMesh();

    return () => cancelAnimationFrame(animationId);
  }, [confidenceScore]);

  const confColors = getConfidenceColor(confidenceScore);

  return (
    <div className={`glass-panel rounded-2xl p-3 border border-slate-800 shadow-2xl relative overflow-hidden transition-all ${isCompact ? 'w-full' : 'w-72'}`}>
      
      {/* Top Header & Status Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${warningsCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${warningsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-xs font-semibold text-slate-200 tracking-tight">AI Telemetry Widget</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
          <Wifi className="w-3 h-3" />
          <span>24ms</span>
        </div>
      </div>

      {/* Video Viewport / Canvas AI Overlay */}
      <div className="relative w-full h-36 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center group">
        {/* Simulated Candidate Photo */}
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
          alt="Candidate Stream"
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Canvas Mesh Overlay */}
        <canvas
          ref={canvasRef}
          width={280}
          height={144}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Live HUD Overlays */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-500/30">
          <Cpu className="w-3 h-3 animate-spin text-cyan-400" />
          <span>FACE_MESH_OK</span>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Eye Lock: Active
          </span>
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-slate-300 border border-slate-700">
            FPS: 60
          </span>
        </div>
      </div>

      {/* AI Confidence Gauge Bar */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> AI Confidence Score
          </span>
          <span className={`font-mono font-bold ${confColors.text}`}>{confidenceScore}%</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              confidenceScore >= 85 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : confidenceScore >= 65 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-600 to-red-500'
            }`}
            style={{ width: `${confidenceScore}%` }}
          />
        </div>
      </div>

      {/* Sensor Metrics Indicators */}
      <div className="grid grid-cols-4 gap-1.5 mt-2 text-[10px] font-mono">
        <div className={`p-1.5 rounded-lg border text-center ${cameraActive ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
          <Camera className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>CAM</span>
        </div>
        <div className={`p-1.5 rounded-lg border text-center ${micActive ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
          <Mic className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>MIC</span>
        </div>
        <div className={`p-1.5 rounded-lg border text-center ${isFullscreen ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
          <Eye className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>FULL</span>
        </div>
        <div className={`p-1.5 rounded-lg border text-center ${warningsCount === 0 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
          <ShieldAlert className="w-3.5 h-3.5 mx-auto mb-0.5" />
          <span>{warningsCount}/3</span>
        </div>
      </div>

    </div>
  );
};
