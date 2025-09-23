# Centralized Timing System

This timing system provides a MIDI-like centralized clock for synchronizing animations and timed events across your React application.

## Why Use This?

- **Synchronized Timing**: All components reference the same time source
- **Performance**: Single animation loop instead of multiple timers
- **Consistency**: All animations use the same timing reference
- **Control**: Pause/resume all animations globally
- **Precision**: More accurate timing than individual `setInterval` calls

## Two Approaches

### 1. React Hook (`useTimingClock`)

For individual components that need timing control:

```typescript
import { useTimingClock } from "@/app/hooks/useTimingClock";

function MyComponent() {
  const clock = useTimingClock({
    autoStart: true,
    targetFPS: 60,
    useRAF: true
  });

  // Use clock.now, clock.time, clock.deltaTime
  // Schedule callbacks with clock.schedule()
  // Create intervals with clock.createInterval()
}
```

### 2. Context Provider (`TimingProvider`)

For app-wide timing coordination:

```typescript
// In your app root
import { TimingProvider } from "@/app/contexts/TimingContext";

function App() {
  return (
    <TimingProvider targetFPS={60} useRAF={true} autoStart={true}>
      <YourApp />
    </TimingProvider>
  );
}

// In any component
import { useTimingClock } from "@/app/contexts/TimingContext";

function MyComponent() {
  const clock = useTimingClock();
  // Same API as the hook approach
}
```

## API Reference

### TimingClock Interface

```typescript
interface TimingClock {
  // Current time in milliseconds since epoch
  now: number;
  
  // Current time in seconds since epoch (for easier calculations)
  time: number;
  
  // Delta time since last frame (for smooth animations)
  deltaTime: number;
  
  // Whether the clock is currently running
  isRunning: boolean;
  
  // Control methods
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  
  // Utility methods
  getElapsedTime(since: number): number;
  schedule(callback: () => void, delay: number): () => void;
  createInterval(callback: () => void, interval: number): () => void;
  createTimeout(callback: () => void, delay: number): () => void;
}
```

## Usage Examples

### Basic Animation

```typescript
function AnimatedComponent() {
  const clock = useTimingClock();
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(clock.now);

  useEffect(() => {
    const updateProgress = () => {
      const elapsed = clock.now - startTimeRef.current;
      const newProgress = Math.min(elapsed / 2000, 1); // 2 second animation
      setProgress(newProgress);
    };

    const cleanup = clock.createInterval(updateProgress, 16); // ~60fps
    return cleanup;
  }, [clock]);

  return <div style={{ opacity: progress }}>Animated Content</div>;
}
```

### Synchronized Slideshow

```typescript
function Slideshow() {
  const clock = useTimingClock();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const advanceSlide = () => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    };

    // All slideshows will advance at the same time
    const cleanup = clock.createInterval(advanceSlide, 3000);
    return cleanup;
  }, [clock]);

  return <div>Slide {currentSlide}</div>;
}
```

### Global Animation Control

```typescript
function AnimationControls() {
  const clock = useTimingClock();

  return (
    <div>
      <button onClick={clock.pause}>Pause All Animations</button>
      <button onClick={clock.resume}>Resume All Animations</button>
      <button onClick={clock.stop}>Stop All Animations</button>
    </div>
  );
}
```

## Integration with Existing Components

### FullScreenSlideshow

The `FullScreenSlideshowWithTiming.tsx` example shows how to integrate the timing system with your existing slideshow:

- Uses `clock.createInterval()` instead of `setInterval()`
- All timing references use the centralized clock
- Can be paused/resumed globally
- Synchronized with other animated components

### Fade Component

The `SynchronizedFade` example shows how to make fade transitions use centralized timing:

- Smooth animations based on `clock.deltaTime`
- Consistent timing across all fade effects
- Can be paused/resumed globally

## Performance Benefits

1. **Single Animation Loop**: Instead of multiple `setInterval` calls, one centralized loop
2. **RequestAnimationFrame**: Uses browser's optimized animation timing
3. **Efficient Updates**: Only updates when needed
4. **Memory Management**: Automatic cleanup of callbacks

## Best Practices

1. **Use Context for App-wide Timing**: Wrap your app in `TimingProvider`
2. **Use Hook for Individual Components**: When you need isolated timing
3. **Clean Up Callbacks**: Always return cleanup functions from `useEffect`
4. **Use Delta Time**: For smooth animations, use `clock.deltaTime`
5. **Batch Updates**: Group related timing operations together

## Migration Guide

To migrate existing components:

1. Replace `setInterval` with `clock.createInterval()`
2. Replace `setTimeout` with `clock.createTimeout()`
3. Use `clock.now` instead of `Date.now()`
4. Use `clock.deltaTime` for smooth animations
5. Wrap your app in `TimingProvider` if using context approach

This system gives you the same benefits as MIDI's centralized clock - all your animations and timed events are perfectly synchronized!
