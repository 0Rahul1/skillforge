import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer - A precise countdown timer hook for the assessment engine.
 *
 * @param {number} initialSeconds - Starting countdown value in seconds
 * @param {Function} onExpire     - Callback fired when timer reaches zero
 * @returns {{ seconds, formatTime, startTimer, stopTimer, resetTimer }}
 */
export const useTimer = (initialSeconds, onExpire) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire ref fresh so closure captures latest version
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const startTimer = useCallback(() => {
    // Prevent duplicate intervals
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          // Fire expire callback asynchronously to avoid state update during render
          setTimeout(() => onExpireRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(
    (s) => {
      stopTimer();
      setSeconds(s ?? initialSeconds);
    },
    [stopTimer, initialSeconds]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /**
   * Returns MM:SS formatted string of the current remaining time.
   */
  const formatTime = useCallback(() => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [seconds]);

  /**
   * Returns true when less than 5 minutes remain (warning threshold).
   */
  const isWarning = seconds > 0 && seconds <= 300;

  /**
   * Returns true when less than 1 minute remains (critical threshold).
   */
  const isCritical = seconds > 0 && seconds <= 60;

  return {
    seconds,
    formatTime,
    startTimer,
    stopTimer,
    resetTimer,
    isWarning,
    isCritical,
  };
};
