import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Crosshair, ShieldAlert, Cpu, Loader2, Maximize2, AlertCircle } from 'lucide-react';

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export default function VisualTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({ fps: 0, latency: 0 });

  // Load Model
  useEffect(() => {
    async function init() {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2' // Faster for real-time
        });
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize AI Vision engine.');
        setLoading(false);
      }
    }
    init();
  }, []);

  // Setup Camera
  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 1280, height: 720 },
          audio: false,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Camera access denied. Please enable camera permissions.');
      }
    }
    setupCamera();
  }, []);

  // Detection Loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const detect = async () => {
      if (model && videoRef.current && videoRef.current.readyState === 4) {
        const start = performance.now();
        const predictions = await model.detect(videoRef.current);
        
        // Filter for things that might be drones (birds, airplanes, or small distant objects)
        // In a real-world scenario, you'd train on a specific drone dataset
        const results = predictions.filter(p => 
          ['airplane', 'bird', 'frisbee', 'sports ball'].includes(p.class) || p.score > 0.6
        );

        setDetections(results as Detection[]);
        
        const now = performance.now();
        setStats({
          latency: Math.round(now - start),
          fps: Math.round(1000 / (now - lastTime))
        });
        lastTime = now;
      }
      animationId = requestAnimationFrame(detect);
    };

    if (model) detect();
    return () => cancelAnimationFrame(animationId);
  }, [model]);

  // Canvas Drawing
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { videoWidth, videoHeight } = videoRef.current;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    detections.forEach(det => {
      const [x, y, width, height] = det.bbox;
      
      // Technical Bounding Box
      ctx.strokeStyle = '#22c55e'; // emerald-500
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x, y, width, height);

      // Corners
      ctx.setLineDash([]);
      ctx.lineWidth = 4;
      const cornerSize = 15;
      
      // Top Left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerSize); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize, y);
      ctx.stroke();

      // Top Right
      ctx.beginPath();
      ctx.moveTo(x + width - cornerSize, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerSize);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px "JetBrains Mono"';
      ctx.fillText(`${det.class.toUpperCase()} [${Math.round(det.score * 100)}%]`, x, y - 10);
      ctx.fillText(`X:${Math.round(x)} Y:${Math.round(y)}`, x, y + height + 20);
    });
  }, [detections]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover opacity-80 grayscale-[0.2]"
      />

      {/* Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Technical HUD Layer */}
      <div className="absolute inset-0 pointer-events-none p-6 font-mono">
        {/* Viewport Corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/20" />

        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Crosshair className="w-12 h-12 text-white/10" strokeWidth={0.5} />
        </div>

        {/* Top Intelligence Bar */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-500 px-3 py-1 border border-emerald-500/50 rounded backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">AI Core: Dynamic Tracking Active</span>
            </div>
            <div className="text-[10px] text-zinc-500 bg-black/40 px-2 py-0.5 rounded">
              SIGNAL: ENCRYPTED // LATENCY: {stats.latency}ms // FPS: {stats.fps}
            </div>
          </div>

          <div className="text-right">
             <div className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Visual Intercept HUD</div>
             <div className="text-[8px] text-zinc-600">VERSION 4.2.0 // BUILD_STABLE</div>
          </div>
        </div>

        {/* Dynamic Threat Feed */}
        <div className="absolute bottom-8 right-8 w-64 space-y-3">
          <AnimatePresence>
            {detections.length > 0 ? (
              detections.map((det, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-zinc-900/80 border border-emerald-500/30 p-3 rounded backdrop-blur-md"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">Object Locked</span>
                    <ShieldAlert className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-sm font-bold text-zinc-100 uppercase tracking-tight">{det.class}</div>
                  <div className="flex justify-between mt-2 text-[9px] text-zinc-500">
                    <span>CONFIDENCE</span>
                    <span className="text-emerald-500">{(det.score * 100).toFixed(1)}%</span>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded text-center italic text-zinc-600 text-[10px]">
                  SCANNING SECTOR FOR AERIAL ANOMALIES...
                </div>
            )}
          </AnimatePresence>
        </div>

        {/* Compass/Orientation HUD */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center gap-1">
          <div className="text-[8px] text-zinc-600 mb-2 font-bold">ALT</div>
          <div className="h-48 w-0.5 bg-zinc-800 relative">
            <motion.div 
              animate={{ bottom: `${(stats.latency / 200) * 100}%` }}
              className="absolute left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-500 shadow-[0_0_8px_#10b981]"
            />
          </div>
          <div className="text-[8px] text-zinc-400 mt-2 font-bold">RANGE</div>
        </div>
      </div>

      {/* Initial Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50 p-8"
          >
            <div className="w-16 h-16 relative mb-6">
               <Loader2 className="w-16 h-16 text-emerald-500 animate-spin absolute inset-0" />
               <Cpu className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
            </div>
            <h2 className="text-xl font-bold tracking-tighter uppercase italic text-zinc-400">Initializing Vision Engine</h2>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-2 animate-pulse">Syncing neural weights...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center z-[60] p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">System Malfunction</h2>
          <p className="text-red-200 mt-4 max-w-sm font-mono text-sm leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 border border-red-500 text-red-500 px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            Reboot Interface
          </button>
        </div>
      )}
    </div>
  );
}
