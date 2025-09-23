"use client";

import React, {useState, useEffect, useRef, useCallback} from "react";
import {useTimingClock} from "../contexts/TimingContext";

// Example 1: Synchronized Fade Component
export function SynchronizedFade({
  show,
  duration = 300,
  children,
}: {
  show: boolean;
  duration?: number;
  children: React.ReactNode;
}) {
  const clock = useTimingClock();
  const [isVisible, setIsVisible] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      startTimeRef.current = clock.now;
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      startTimeRef.current = clock.now;
      setIsVisible(false);
    }
  }, [show, clock]);

  // Calculate progress based on centralized time
  const progress = startTimeRef.current
    ? Math.min((clock.now - startTimeRef.current) / duration, 1)
    : 0;

  const opacity = isVisible ? progress : 1 - progress;

  if (!shouldRender) return null;

  return (
    <div
      style={{
        opacity,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
}

// Example 2: Clock Component using Centralized Timing
export function SynchronizedClock({
  referenceDate,
}: {
  referenceDate: Date | string;
}) {
  const clock = useTimingClock();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time based on centralized clock
    const updateTime = () => {
      setTime(new Date());
    };

    // Use the centralized clock's interval system
    const cleanup = clock.createInterval(updateTime, 1000);
    return cleanup;
  }, [clock]);

  const referenceDateObj =
    referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

  const timeDiff = time.getTime() - referenceDateObj.getTime();
  const totalSeconds = Math.floor(timeDiff / 1000);

  const years = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60));
  const months = Math.floor(
    (totalSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60)
  );
  const weeks = Math.floor(
    (totalSeconds % (30.44 * 24 * 60 * 60)) / (7 * 24 * 60 * 60)
  );
  const days = Math.floor((totalSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div>
      {years}:{months}:{weeks}:{days}:{hours}:{minutes}:{seconds}
    </div>
  );
}

// Example 3: Animation Component with Centralized Timing
export function AnimatedCounter({
  target,
  duration = 2000,
}: {
  target: number;
  duration?: number;
}) {
  const clock = useTimingClock();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    startTimeRef.current = clock.now;
    startValueRef.current = current;
  }, [clock, current]);

  useEffect(() => {
    if (isAnimating && startTimeRef.current) {
      const elapsed = clock.now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const newValue =
        startValueRef.current +
        (target - startValueRef.current) * easedProgress;

      setCurrent(Math.round(newValue));

      if (progress >= 1) {
        setIsAnimating(false);
        setCurrent(target);
      }
    }
  }, [clock.now, isAnimating, target, duration]);

  return (
    <div>
      <div>Count: {current}</div>
      <button onClick={startAnimation}>Animate to {target}</button>
    </div>
  );
}

// Example 4: Synchronized Slideshow Timer
export function SlideshowTimer({
  duration,
  onComplete,
}: {
  duration: number;
  onComplete: () => void;
}) {
  const clock = useTimingClock();
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = clock.now;

    const updateProgress = () => {
      if (startTimeRef.current) {
        const elapsed = clock.now - startTimeRef.current;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);

        if (newProgress >= 1) {
          onComplete();
        }
      }
    };

    // Use centralized clock for smooth updates
    const cleanup = clock.createInterval(updateProgress, 16); // ~60fps
    return cleanup;
  }, [clock, duration, onComplete]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
        style={{width: `${progress * 100}%`}}
      />
    </div>
  );
}
