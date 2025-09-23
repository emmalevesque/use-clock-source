import {TimingProvider, useTimingClock} from "use-clock-source";
import {useState, useEffect, useRef} from "react";

// Example 1: Animated Counter
function AnimatedCounter({target}: {target: number}) {
  const clock = useTimingClock();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  const startAnimation = () => {
    setIsAnimating(true);
    startTimeRef.current = clock.now;
    startValueRef.current = current;
  };

  useEffect(() => {
    if (isAnimating && startTimeRef.current) {
      const elapsed = clock.now - startTimeRef.current;
      const progress = Math.min(elapsed / 2000, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue =
        startValueRef.current + (target - startValueRef.current) * eased;

      setCurrent(Math.round(newValue));

      if (progress >= 1) {
        setIsAnimating(false);
        setCurrent(target);
      }
    }
  }, [clock.now, isAnimating, target]);

  return (
    <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
      <h3>Animated Counter</h3>
      <div style={{fontSize: "24px", margin: "10px 0"}}>{current}</div>
      <button onClick={startAnimation} disabled={isAnimating}>
        {isAnimating ? "Animating..." : `Animate to ${target}`}
      </button>
    </div>
  );
}

// Example 2: Fade In Component
function FadeInComponent() {
  const clock = useTimingClock();
  const [opacity, setOpacity] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  const startFade = () => {
    setShouldRender(true);
    setOpacity(0);
    const startTime = clock.now;

    const animate = () => {
      const elapsed = clock.now - startTime;
      const progress = Math.min(elapsed / 1000, 1);
      setOpacity(progress);
    };

    const cleanup = clock.createInterval(animate, 16);
    setTimeout(cleanup, 1000);
  };

  if (!shouldRender) {
    return (
      <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
        <h3>Fade In Component</h3>
        <button onClick={startFade}>Start Fade In</button>
      </div>
    );
  }

  return (
    <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
      <h3>Fade In Component</h3>
      <div style={{opacity, transition: "opacity 0.1s"}}>
        This content fades in smoothly!
      </div>
    </div>
  );
}

// Example 3: Clock Display
function ClockDisplay() {
  const clock = useTimingClock();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    return clock.createInterval(updateTime, 1000);
  }, [clock]);

  return (
    <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
      <h3>Clock Display</h3>
      <div style={{fontSize: "18px", fontFamily: "monospace"}}>
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

// Example 4: Animation Controls
function AnimationControls() {
  const clock = useTimingClock();

  return (
    <div style={{padding: "20px", border: "1px solid #ccc", margin: "10px"}}>
      <h3>Global Animation Controls</h3>
      <div style={{display: "flex", gap: "10px"}}>
        <button onClick={clock.pause}>Pause All</button>
        <button onClick={clock.resume}>Resume All</button>
        <button onClick={clock.stop}>Stop All</button>
      </div>
      <div style={{marginTop: "10px"}}>
        Status: {clock.isRunning ? "Running" : "Stopped"}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div style={{padding: "20px", maxWidth: "800px", margin: "0 auto"}}>
      <h1>Clock Source Demo</h1>
      <p>
        This demo showcases the clock-source package with synchronized timing
        across all components.
      </p>

      <AnimationControls />
      <ClockDisplay />
      <AnimatedCounter target={100} />
      <AnimatedCounter target={500} />
      <FadeInComponent />
    </div>
  );
}

// Wrapped with TimingProvider
export default function Home() {
  return (
    <TimingProvider targetFPS={60} useRAF={true} autoStart={true}>
      <App />
    </TimingProvider>
  );
}
