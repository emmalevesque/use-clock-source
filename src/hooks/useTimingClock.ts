"use client";

import {useCallback, useEffect, useRef, useState} from "react";

export interface TimingClock {
  // Current time in milliseconds since epoch
  now: number;
  // Current time in seconds since epoch (for easier calculations)
  time: number;
  // Delta time since last frame (for smooth animations)
  deltaTime: number;
  // Whether the clock is currently running
  isRunning: boolean;
  // Start the clock
  start: () => void;
  // Stop the clock
  stop: () => void;
  // Pause the clock
  pause: () => void;
  // Resume the clock
  resume: () => void;
  // Get time elapsed since a specific timestamp
  getElapsedTime: (since: number) => number;
  // Schedule a callback for a specific time
  schedule: (callback: () => void, delay: number) => () => void;
  // Create a timer that repeats
  createInterval: (callback: () => void, interval: number) => () => void;
  // Create a timer that runs once
  createTimeout: (callback: () => void, delay: number) => () => void;
}

export interface UseTimingClockOptions {
  // Whether to start the clock immediately
  autoStart?: boolean;
  // Target frame rate (default: 60fps)
  targetFPS?: number;
  // Whether to use requestAnimationFrame (true) or setInterval (false)
  useRAF?: boolean;
}

export function useTimingClock(
  options: UseTimingClockOptions = {}
): TimingClock {
  const {autoStart = true, targetFPS = 60, useRAF = true} = options;

  const [now, setNow] = useState(() => Date.now());
  const [isRunning, setIsRunning] = useState(autoStart);

  const lastTimeRef = useRef(Date.now());
  const deltaTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const scheduledCallbacksRef = useRef<
    Map<string, {callback: () => void; time: number}>
  >(new Map());
  const intervalCallbacksRef = useRef<
    Map<string, {callback: () => void; interval: number; lastRun: number}>
  >(new Map());
  const timeoutCallbacksRef = useRef<
    Map<string, {callback: () => void; time: number}>
  >(new Map());

  const updateTime = useCallback(() => {
    const currentTime = Date.now();
    const lastTime = lastTimeRef.current;

    deltaTimeRef.current = currentTime - lastTime;
    lastTimeRef.current = currentTime;

    setNow(currentTime);

    // Check scheduled callbacks
    scheduledCallbacksRef.current.forEach((scheduled, id) => {
      if (currentTime >= scheduled.time) {
        scheduled.callback();
        scheduledCallbacksRef.current.delete(id);
      }
    });

    // Check interval callbacks
    intervalCallbacksRef.current.forEach((interval) => {
      if (currentTime - interval.lastRun >= interval.interval) {
        interval.callback();
        interval.lastRun = currentTime;
      }
    });

    // Check timeout callbacks
    timeoutCallbacksRef.current.forEach((timeout, id) => {
      if (currentTime >= timeout.time) {
        timeout.callback();
        timeoutCallbacksRef.current.delete(id);
      }
    });
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    lastTimeRef.current = Date.now();

    if (useRAF) {
      const tick = () => {
        updateTime();
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      const interval = 1000 / targetFPS;
      intervalRef.current = setInterval(updateTime, interval);
    }
  }, [isRunning, useRAF, targetFPS, updateTime]);

  const stop = useCallback(() => {
    setIsRunning(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Clear all callbacks
    scheduledCallbacksRef.current.clear();
    intervalCallbacksRef.current.clear();
    timeoutCallbacksRef.current.clear();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const resume = useCallback(() => {
    if (isRunning) return;
    start();
  }, [isRunning, start]);

  const getElapsedTime = useCallback(
    (since: number) => {
      return now - since;
    },
    [now]
  );

  const schedule = useCallback(
    (callback: () => void, delay: number) => {
      const id = Math.random().toString(36).substr(2, 9);
      const scheduledTime = Date.now() + delay;

      scheduledCallbacksRef.current.set(id, {
        callback,
        time: scheduledTime,
      });

      return () => {
        scheduledCallbacksRef.current.delete(id);
      };
    },
    []
  );

  const createInterval = useCallback(
    (callback: () => void, interval: number) => {
      const id = Math.random().toString(36).substr(2, 9);

      intervalCallbacksRef.current.set(id, {
        callback,
        interval,
        lastRun: Date.now(),
      });

      return () => {
        intervalCallbacksRef.current.delete(id);
      };
    },
    []
  );

  const createTimeout = useCallback(
    (callback: () => void, delay: number) => {
      const id = Math.random().toString(36).substr(2, 9);
      const timeoutTime = Date.now() + delay;

      timeoutCallbacksRef.current.set(id, {
        callback,
        time: timeoutTime,
      });

      return () => {
        timeoutCallbacksRef.current.delete(id);
      };
    },
    []
  );

  // Auto-start effect
  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    now,
    time: now / 1000,
    deltaTime: deltaTimeRef.current,
    isRunning,
    start,
    stop,
    pause,
    resume,
    getElapsedTime,
    schedule,
    createInterval,
    createTimeout,
  };
}
