import React, { useRef, useEffect, useState } from 'react';
import { Camera, Eye, EyeOff, Cpu, Wifi } from 'lucide-react';
import { useMonitoring } from '../../contexts/MonitoringContext';

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

export interface AICameraInfraction {
  mobile: boolean;
  turnedAround: boolean;
  unauthorizedObject?: boolean;
  objectName?: string;
  focusShift?: boolean;
}

interface AICameraWidgetProps {
  onInfractionChange?: (infractions: AICameraInfraction) => void;
}

export const AICameraWidget: React.FC<AICameraWidgetProps> = ({
  onInfractionChange
}) => {
  const { cameraActive, warningsCount, events } = useMonitoring();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Object Detection State (YOLOv8n / OpenCV)
  const [unauthObject, setUnauthObject] = useState<{ detected: boolean; object: string; confidence: number }>({
    detected: false,
    object: '',
    confidence: 0
  });

  // Focus Shift State (MediaPipe Face Landmark)
  const [focusShift, setFocusShift] = useState<boolean>(false);
  const faceMeshRef = useRef<any>(null);
  const consecutiveShiftRef = useRef<number>(0);

  const [model, setModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const streamRef = useRef<MediaStream | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // In-flight processing locks to prevent overlapping async frames
  const isProcessingRef = useRef<boolean>(false);
  const isDetectingRef = useRef<boolean>(false);
  const prevInfractionRef = useRef<{ mobile: boolean; turnedAround: boolean; unauthorizedObject?: boolean; objectName?: string; focusShift?: boolean }>({
    mobile: false,
    turnedAround: false,
    unauthorizedObject: false,
    objectName: '',
    focusShift: false
  });
  const visualStateRef = useRef<{ isAlert: boolean }>({ isAlert: false });

  // Keep visual state cached in ref for requestAnimationFrame without re-triggering the RAF loop
  useEffect(() => {
    visualStateRef.current = {
      isAlert: unauthObject.detected || focusShift || warningsCount > 0
    };
  }, [unauthObject.detected, focusShift, warningsCount]);

  // 1. Load TensorFlow.js / COCO-SSD and MediaPipe FaceMesh from CDN
  useEffect(() => {
    let active = true;
    const loadLibraries = async () => {
      try {
        // Load TF.js for client fallback object detection
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js');
        
        if (active) {
          try {
            const loadedModel = await (window as any).cocoSsd.load();
            setModel(loadedModel);
            console.log('TF.js and COCO-SSD loaded for client-side fallback.');
          } catch (e) {
            console.warn('COCO-SSD load warning:', e);
          }
        }

        // Load MediaPipe Face Mesh for Focus Shift & Head Pose analysis
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
        if (active && (window as any).FaceMesh) {
          const fm = new (window as any).FaceMesh({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          });
          fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          fm.onResults((results: any) => {
            if (!active) return;
            handleMediaPipeResults(results);
          });

          faceMeshRef.current = fm;
          console.log('MediaPipe Face Landmark engine initialized.');
        }

        if (active) setModelLoading(false);
      } catch (err) {
        console.warn('Failed to load AI libraries from CDN:', err);
        if (active) setModelLoading(false);
      }
    };

    loadLibraries();
    return () => {
      active = false;
    };
  }, []);

  // 2. Establish YOLOv8 WebSocket Connection
  useEffect(() => {
    if (!cameraActive) return;

    let reconnectTimer: any = null;
    let isCleanedUp = false;

    const connectWS = () => {
      if (isCleanedUp) return;
      const ws = new WebSocket('ws://localhost:8082/ws/proctor');
      wsRef.current = ws;

      ws.onopen = () => {
        if (isCleanedUp) {
          ws.close();
          return;
        }
        console.log('🔌 Connected to YOLOv8-Nano & OpenCV WebSocket backend.');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.detected) {
            console.warn('⚠️ YOLOv8-N detected unauthorized object:', data.object, 'confidence:', data.confidence);
            setUnauthObject(prev => {
              if (prev.detected && prev.object === (data.object || 'cell phone')) return prev;
              return {
                detected: true,
                object: data.object || 'cell phone',
                confidence: data.confidence || 0.85
              };
            });
          } else {
            setUnauthObject(prev => {
              if (!prev.detected && prev.object === '') return prev;
              return {
                detected: false,
                object: '',
                confidence: 0
              };
            });
          }
        } catch (err) {
          console.error('Error parsing YOLO WS message:', err);
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (!isCleanedUp) {
          reconnectTimer = setTimeout(connectWS, 3000);
        }
      };
    };

    connectWS();

    return () => {
      isCleanedUp = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsConnected(false);
    };
  }, [cameraActive]);

  // 3. Stream frames to YOLOv8 WebSocket & MediaPipe Face Landmark (Guarded & Throttled)
  useEffect(() => {
    if (!cameraActive) return;

    // Single reusable offscreen canvas for frame capture to prevent memory churn
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const processFrame = async () => {
      // In-flight guard: Skip tick if previous frame processing is still executing
      if (isProcessingRef.current) return;
      if (!videoRef.current || videoRef.current.readyState < 2 || videoRef.current.videoWidth <= 0) return;

      isProcessingRef.current = true;
      try {
        // A. Send compressed frame (480x360 @ 0.55 quality) to YOLOv8 WebSocket
        if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const base64Data = canvas.toDataURL('image/jpeg', 0.55);
          wsRef.current.send(JSON.stringify({ image: base64Data }));
        }

        // B. Send frame to MediaPipe Face Mesh for Focus Shift detection
        if (faceMeshRef.current) {
          try {
            await faceMeshRef.current.send({ image: videoRef.current });
          } catch (e) {
            // Ignore transient frame analysis errors
          }
        }
      } catch (err) {
        // Ignore capture frame errors
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Throttled to 600ms (~1.67 fps) to guarantee fluid main thread without CPU starvation
    const interval = setInterval(processFrame, 600);
    return () => {
      clearInterval(interval);
      isProcessingRef.current = false;
    };
  }, [wsConnected, cameraActive]);

  // 4. MediaPipe Face Landmark & Focus Shift Calculation
  const handleMediaPipeResults = (results: any) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      // Face missing / candidate turned completely around
      consecutiveShiftRef.current = Math.min(consecutiveShiftRef.current + 1, 6);
      if (consecutiveShiftRef.current >= 4) {
        setFocusShift(true);
      }
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const nose = landmarks[1] || landmarks[4];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const chin = landmarks[152];
    const forehead = landmarks[10];

    if (nose && leftCheek && rightCheek) {
      const distLeft = Math.abs(nose.x - leftCheek.x);
      const distRight = Math.abs(rightCheek.x - nose.x);
      const totalWidth = distLeft + distRight;
      const yawRatio = totalWidth > 0 ? distLeft / totalWidth : 0.5;

      // Pitch calculation (looking up or down)
      const distUp = Math.abs(forehead.y - nose.y);
      const distDown = Math.abs(chin.y - nose.y);
      const pitchRatio = (distUp + distDown) > 0 ? distUp / (distUp + distDown) : 0.5;

      // Focus Shift detected if candidate looks significantly left/right or down (reading cheat sheet/phone)
      const isShifted = yawRatio < 0.28 || yawRatio > 0.72 || pitchRatio < 0.25 || pitchRatio > 0.75;

      if (isShifted) {
        consecutiveShiftRef.current = Math.min(consecutiveShiftRef.current + 1, 6);
        if (consecutiveShiftRef.current >= 3) {
          setFocusShift(true);
        }
      } else {
        consecutiveShiftRef.current = 0;
        setFocusShift(false);
      }
    }
  };

  // 5. In-Browser Dual-Layer Object Detection (TF.js / COCO-SSD Offline Fallback ONLY)
  // When YOLOv8 WebSocket is connected, backend handles all forbidden object detection.
  // COCO-SSD is preserved as an offline fallback when wsConnected is false.
  useEffect(() => {
    if (!model || !cameraActive || wsConnected) return;

    const detectObjects = async () => {
      if (isDetectingRef.current) return;
      if (!videoRef.current || videoRef.current.readyState < 2 || videoRef.current.videoWidth <= 0) return;

      isDetectingRef.current = true;
      try {
        const predictions = await model.detect(videoRef.current, 10, 0.12);
        
        const forbiddenObj = predictions.find((p: any) => {
          const cls = (p.class || '').toLowerCase();
          return (
            cls.includes('phone') ||
            cls.includes('cell') ||
            cls.includes('mobile') ||
            cls.includes('remote') ||
            cls.includes('calculator') ||
            cls.includes('book') ||
            cls.includes('laptop') ||
            cls.includes('tablet') ||
            cls.includes('mouse') ||
            cls.includes('electronic')
          ) && p.score > 0.12;
        });
        
        if (forbiddenObj) {
          console.warn('⚠️ Malpractice Triggered: Forbidden object identified in-browser fallback:', forbiddenObj.class, 'score:', forbiddenObj.score);
          setUnauthObject(prev => {
            if (prev.detected && prev.object === forbiddenObj.class) return prev;
            return {
              detected: true,
              object: forbiddenObj.class,
              confidence: forbiddenObj.score
            };
          });
        } else {
          setUnauthObject(prev => {
            if (!prev.detected && prev.object === '') return prev;
            return {
              detected: false,
              object: '',
              confidence: 0
            };
          });
        }
      } catch (e) {
        // Ignore transient errors
      } finally {
        isDetectingRef.current = false;
      }
    };

    const interval = setInterval(detectObjects, 800);
    return () => {
      clearInterval(interval);
      isDetectingRef.current = false;
    };
  }, [model, cameraActive, wsConnected]);

  // 6. Notify Parent and Log Malpractice (Stabilized with value-equality check)
  useEffect(() => {
    if (!onInfractionChange) return;

    const nextState = {
      mobile: unauthObject.detected,
      unauthorizedObject: unauthObject.detected,
      objectName: unauthObject.object || 'cell phone',
      turnedAround: focusShift,
      focusShift
    };

    const prev = prevInfractionRef.current;
    const hasChanged = 
      prev.mobile !== nextState.mobile ||
      prev.unauthorizedObject !== nextState.unauthorizedObject ||
      prev.objectName !== nextState.objectName ||
      prev.turnedAround !== nextState.turnedAround ||
      prev.focusShift !== nextState.focusShift;

    if (hasChanged) {
      prevInfractionRef.current = nextState;
      onInfractionChange(nextState);
    }
  }, [unauthObject.detected, unauthObject.object, focusShift, onInfractionChange]);

  // 7. Request webcam stream
  useEffect(() => {
    let isCancelled = false;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15, max: 20 } }, 
          audio: false 
        });
        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Failed to access webcam:', err);
      }
    };

    if (cameraActive) {
      startCamera();
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive]);

  // Re-bind stream on expanded/collapsed change
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showVideo]);

  // 8. Dynamic Canvas AI Face Mesh & Visual Telemetry Overlay
  useEffect(() => {
    if (!cameraActive) return;
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

      const isAlert = visualStateRef.current.isAlert;

      // Draw bounding box
      ctx.strokeStyle = isAlert ? 'rgba(239, 68, 68, 0.95)' : 'rgba(0, 242, 254, 0.7)';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 42, centerY - 48, 84, 96);

      // MediaPipe Face Landmarks simulator mesh
      ctx.fillStyle = isAlert ? '#EF4444' : '#00F2FE';
      const landmarkPoints = [
        { x: centerX - 20, y: centerY - 15 }, // Left eye
        { x: centerX + 20, y: centerY - 15 }, // Right eye
        { x: centerX, y: centerY + 2 },       // Nose tip
        { x: centerX - 32, y: centerY + 5 },  // Left cheek
        { x: centerX + 32, y: centerY + 5 },  // Right cheek
        { x: centerX - 14, y: centerY + 24 }, // Mouth left
        { x: centerX + 14, y: centerY + 24 }, // Mouth right
        { x: centerX, y: centerY + 36 },      // Chin
        { x: centerX, y: centerY - 38 }       // Forehead
      ];

      landmarkPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connecting mesh lines
      ctx.strokeStyle = isAlert ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(landmarkPoints[0].x, landmarkPoints[0].y);
      ctx.lineTo(landmarkPoints[2].x, landmarkPoints[2].y);
      ctx.lineTo(landmarkPoints[1].x, landmarkPoints[1].y);
      ctx.lineTo(landmarkPoints[4].x, landmarkPoints[4].y);
      ctx.lineTo(landmarkPoints[7].x, landmarkPoints[7].y);
      ctx.lineTo(landmarkPoints[3].x, landmarkPoints[3].y);
      ctx.closePath();
      ctx.stroke();

      // Eye Tracking Rays
      angle += 0.05;
      const scanY = centerY - 25 + Math.sin(angle) * 35;
      ctx.strokeStyle = isAlert ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 38, scanY);
      ctx.lineTo(centerX + 38, scanY);
      ctx.stroke();

      animationId = requestAnimationFrame(renderMesh);
    };

    renderMesh();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [cameraActive]);

  if (!showVideo) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowVideo(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/95 hover:bg-slate-900 border border-cyan-400/40 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Show Proctor Feed (Monitoring Active)"
        >
          <EyeOff className="w-5.5 h-5.5 text-rose-500 animate-pulse group-hover:scale-110 transition-transform" />
        </button>
        {cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: 'fixed', left: '-9999px', width: '200px', height: '150px', opacity: 0.01, pointerEvents: 'none' }}
          />
        )}
      </>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-3 border border-slate-800 shadow-2xl relative overflow-hidden transition-all w-[16vw] min-w-[240px] max-w-[300px]">
      
      {/* Top Header & Status Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 select-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${unauthObject.detected || focusShift ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${unauthObject.detected || focusShift ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-xs font-semibold text-slate-200 tracking-tight">
            AI Vision Proctor
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
          <Wifi className="w-3 h-3" />
          <span>YOLOv8-N</span>
        </div>
      </div>

      {/* Video Viewport / Canvas AI Overlay */}
      <div className="relative w-full h-36 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center group">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-sans">
            <Camera className="w-8 h-8 mb-1.5 opacity-40 animate-pulse" />
            <span>Camera Inactive</span>
          </div>
        )}

        {/* Canvas Mesh Overlay */}
        <canvas
          ref={canvasRef}
          width={280}
          height={144}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Live HUD Overlays */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[9px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-500/30">
          <Cpu className="w-3 h-3 animate-spin text-cyan-400" />
          <span>
            {modelLoading 
              ? 'INITIALIZING...' 
              : (cameraActive 
                  ? (wsConnected ? 'YOLOv8-N_WS: ACTIVE' : 'CLIENT_AI: ACTIVE') 
                  : 'NO_SIGNAL')}
          </span>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono">
          <button
            type="button"
            onClick={() => setShowVideo(false)}
            className="px-2 py-0.5 rounded bg-black/75 hover:bg-black/90 backdrop-blur text-emerald-400 border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors"
            title="Click to hide video feed"
          >
            <Eye className="w-2.5 h-2.5" /> MediaPipe Eye-Lock
          </button>
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur text-slate-300 border border-slate-700">
            {focusShift ? '⚠️ SHIFTED' : '✓ FOCUSED'}
          </span>
        </div>

        {/* Malpractice Visual HUD Feedback Overlays */}
        {unauthObject.detected && (
          <div className="absolute inset-0 bg-gradient-to-b from-rose-950/95 to-red-950/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2 z-20 animate-pulse border-2 border-rose-500">
            <span className="text-xl animate-bounce">🚨</span>
            <span className="text-[11px] font-mono font-black uppercase tracking-tight text-white mt-1">
              UNAUTHORIZED OBJECT DETECTED!!!
            </span>
            <span className="text-[10px] font-mono text-rose-200 mt-0.5 bg-black/50 px-2 py-0.5 rounded">
              Detected: {unauthObject.object.toUpperCase()} (YOLOv8-N)
            </span>
          </div>
        )}

        {!unauthObject.detected && focusShift && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 to-orange-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2 z-20 animate-pulse border-2 border-amber-500">
            <span className="text-xl">⚠️</span>
            <span className="text-[11px] font-mono font-black uppercase tracking-tight text-amber-200 mt-1">
              FOCUS SHIFT DETECTED
            </span>
            <span className="text-[10px] font-mono text-amber-300 mt-0.5 bg-black/50 px-2 py-0.5 rounded">
              MediaPipe Face Landmark Alert
            </span>
          </div>
        )}
      </div>

      {/* Live Malpractice Log Feed */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Session Telemetry</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {events.length} flagged
          </span>
        </div>
        
        {events.length === 0 ? (
          <p className="text-[10px] text-slate-500 font-sans italic text-center py-1">
            Zero security flags. Telemetry clear.
          </p>
        ) : (
          <div className="max-h-20 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className="p-1 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col text-[9px] leading-tight">
                <div className="flex justify-between items-center text-slate-200 font-mono font-semibold">
                  <span className={evt.event.includes('UNAUTHORIZED') ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                    {evt.event}
                  </span>
                  <span className="text-slate-500">{evt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

