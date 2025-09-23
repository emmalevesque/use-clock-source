// Main exports for the timing system
export {
  TimingProvider,
  useTimingClock,
  useOptionalTimingClock,
} from "./contexts/TimingContext";
export type {TimingClock, TimingProviderProps} from "./contexts/TimingContext";

// Standalone hook export
export {useTimingClock as useTimingClockStandalone} from "./hooks/useTimingClock";
export type {UseTimingClockOptions} from "./hooks/useTimingClock";

// Example components (optional - for documentation)
export {
  SynchronizedFade,
  SynchronizedClock,
  AnimatedCounter,
  SlideshowTimer,
} from "./components/TimingExamples";
