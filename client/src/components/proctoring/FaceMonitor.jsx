import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Eye,
  EyeOff,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Wifi,
} from 'lucide-react';

/**
 * FaceMonitor - Proctoring webcam component for the assessment engine.
 *
 * Renders a small, draggable-aware webcam preview in the bottom-right corner
 * of the assessment page. Handles camera permission states gracefully and
 * displays a violation counter badge.
 *
 * Props:
 *   violations  {number}   - Total proctoring violation count (from parent)
 *   className   {string}   - Optional extra wrapper classes
 */
const FaceMonitor = ({ violations = 0, className = '' }) => {
  const webcamRef = useRef(null);

  const [permissionStatus, setPermissionStatus] = useState('pending'); // 'pending' | 'granted' | 'denied' | 'error'
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false); // REC blink animation

  // ─── Check & request camera permission ───────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' });
          if (mounted) {
            if (result.state === 'denied') {
              setPermissionStatus('denied');
              setIsLoading(false);
            }
            result.onchange = () => {
              if (mounted) {
                setPermissionStatus(result.state === 'granted' ? 'granted' : 'denied');
              }
            };
          }
        }
      } catch {
        // permissions API not available — let the webcam component handle it
      }
    };

    checkPermission();
    return () => {
      mounted = false;
    };
  }, []);

  // ─── REC blink effect when camera is active ───────────────────────────────
  useEffect(() => {
    if (permissionStatus !== 'granted') return;
    const id = setInterval(() => setIsBlinking((b) => !b), 1200);
    return () => clearInterval(id);
  }, [permissionStatus]);

  // ─── Webcam event handlers ────────────────────────────────────────────────
  const handleUserMedia = useCallback(() => {
    setPermissionStatus('granted');
    setIsLoading(false);
    setCameraError(null);
  }, []);

  const handleUserMediaError = useCallback((err) => {
    console.error('[FaceMonitor] Camera error:', err);
    const msg =
      err?.name === 'NotAllowedError'
        ? 'Camera permission denied'
        : err?.name === 'NotFoundError'
        ? 'No camera found'
        : 'Camera unavailable';
    setPermissionStatus('denied');
    setCameraError(msg);
    setIsLoading(false);
  }, []);

  // ─── Derived state ────────────────────────────────────────────────────────
  const cameraOk = permissionStatus === 'granted';
  const borderColor = cameraOk
    ? 'border-emerald-500/70'
    : permissionStatus === 'denied'
    ? 'border-red-500/70'
    : 'border-amber-500/70';

  const statusGlowColor = cameraOk
    ? 'shadow-[0_0_12px_rgba(16,185,129,0.35)]'
    : permissionStatus === 'denied'
    ? 'shadow-[0_0_12px_rgba(239,68,68,0.35)]'
    : 'shadow-[0_0_12px_rgba(245,158,11,0.35)]';

  // ─── Violation severity colour ────────────────────────────────────────────
  const violationColor =
    violations === 0
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : violations <= 2
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';

  // ─── Video constraints ────────────────────────────────────────────────────
  const videoConstraints = {
    width: 160,
    height: 120,
    facingMode: 'user',
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* ── Main Container ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`
          relative rounded-xl overflow-hidden border-2 ${borderColor} ${statusGlowColor}
          bg-slate-900/90 backdrop-blur-sm
          transition-all duration-300
        `}
        style={{ width: 160, height: 120 }}
      >
        {/* ── Webcam Feed ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isVisible && permissionStatus !== 'denied' && (
            <motion.div
              key="webcam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hidden State (camera toggled off) ────────────────────────── */}
        <AnimatePresence>
          {!isVisible && (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95"
            >
              <EyeOff size={20} className="text-slate-500 mb-1" />
              <span className="text-slate-600 text-[10px] font-medium">Camera hidden</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Camera Denied State ───────────────────────────────────────── */}
        <AnimatePresence>
          {permissionStatus === 'denied' && (
            <motion.div
              key="denied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-2"
            >
              <CameraOff size={20} className="text-red-400 mb-1" />
              <span className="text-red-400 text-[10px] font-semibold text-center leading-tight">
                {cameraError || 'Camera denied'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading Overlay ───────────────────────────────────────────── */}
        <AnimatePresence>
          {isLoading && permissionStatus === 'pending' && (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95"
            >
              <div className="spinner mb-1" style={{ width: 18, height: 18 }} />
              <span className="text-slate-500 text-[10px]">Requesting…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── REC Badge (top-left) ──────────────────────────────────────── */}
        {cameraOk && isVisible && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
            <motion.div
              animate={{ opacity: isBlinking ? 1 : 0.3 }}
              transition={{ duration: 0.4 }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-[9px] font-bold text-white/70 tracking-widest uppercase">
              Rec
            </span>
          </div>
        )}

        {/* ── Camera Status Badge (top-right) ───────────────────────────── */}
        <div className="absolute top-1.5 right-1.5 z-10">
          {cameraOk ? (
            <div className="flex items-center gap-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-emerald-300 font-semibold">OK</span>
            </div>
          ) : permissionStatus === 'denied' ? (
            <div className="flex items-center gap-0.5 bg-red-500/20 border border-red-500/30 rounded-full px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[9px] text-red-300 font-semibold">ERR</span>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[9px] text-amber-300 font-semibold">WAIT</span>
            </div>
          )}
        </div>

        {/* ── Face Detection Label (bottom-left) ───────────────────────── */}
        {cameraOk && isVisible && (
          <div className="absolute bottom-1.5 left-1.5 z-10">
            <span className="text-[9px] text-white/50 font-medium">Face Monitor</span>
          </div>
        )}

        {/* ── Scan-line overlay (aesthetic) ─────────────────────────────── */}
        {cameraOk && isVisible && (
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            }}
          />
        )}
      </motion.div>

      {/* ── Controls Bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        {/* Violation counter */}
        <motion.div
          key={violations}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${violationColor}`}
        >
          <ShieldAlert size={10} />
          <span>{violations} {violations === 1 ? 'violation' : 'violations'}</span>
        </motion.div>

        {/* Toggle visibility button */}
        <button
          onClick={() => setIsVisible((v) => !v)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
          title={isVisible ? 'Hide camera' : 'Show camera'}
        >
          {isVisible ? (
            <EyeOff size={10} className="text-slate-400" />
          ) : (
            <Eye size={10} className="text-slate-400" />
          )}
        </button>
      </div>

      {/* ── "Camera Active" floating badge (shown briefly) ─────────────────── */}
      <AnimatePresence>
        {cameraOk && (
          <motion.div
            key="active-badge"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 flex items-center justify-center gap-1"
          >
            <Wifi size={9} className="text-emerald-400" />
            <span className="text-[9px] text-emerald-400/70 font-medium">Camera Active</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaceMonitor;
