# use-clock-source

A centralized timing system for React applications that provides synchronized animations and timed events across your entire app.

## Features

- 🎯 **Centralized Clock**: Single source of truth for all timing operations
- ⚡ **High Performance**: Uses `requestAnimationFrame` for smooth 60fps animations
- 🔄 **Synchronized Events**: All components use the same timing reference
- ⏸️ **Global Control**: Pause, resume, or stop all animations at once
- 🎨 **React Context**: Easy integration with React's context system
- 📦 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🪝 **Standalone Hook**: Use independently or with context provider

## Installation

```bash
npm install use-clock-source
# or
yarn add use-clock-source
# or
pnpm add use-clock-source
```

## Quick Start

### Using Context Provider (Recommended)

Wrap your app with the `TimingProvider`:

```tsx
import React from 'react';
import { TimingProvider } from 'use-clock-source';

function App() {
  return (
    <TimingProvider targetFPS={60} useRAF={true} autoStart={true}>
      <YourApp />
    </TimingProvider>
  );
}
```

Use the timing clock in any component:

```tsx
import React, { useState, useEffect } from 'react';
import { useTimingClock } from 'use-clock-source';

function AnimatedComponent() {
  const clock = useTimingClock();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = clock.now;
    
    const updateProgress = () => {
      const elapsed = clock.now - startTime;
      setProgress(Math.min(elapsed / 2000, 1)); // 2 second animation
    };

    const cleanup = clock.createInterval(updateProgress, 16); // ~60fps
    return cleanup;
  }, [clock]);

  return <div style={{ opacity: progress }}>Animated Content</div>;
}
```

### Using Standalone Hook

For components that need independent timing:

```tsx
import React from 'react';
import { useTimingClockStandalone } from 'use-clock-source';

function MyComponent() {
  const clock = useTimingClockStandalone({
    autoStart: true,
    targetFPS: 60,
    useRAF: true
  });

  // Same API as context-based hook
}
```

## API Reference

### TimingProvider Props

```tsx
import { ReactNode } from 'react';

interface TimingProviderProps {
  children: ReactNode;
  targetFPS?: number;        // Default: 60
  useRAF?: boolean;          // Default: true
  autoStart?: boolean;       // Default: true
}
```

### TimingClock Interface

```tsx
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

```tsx
import React, { useState, useEffect } from 'react';
import { useTimingClock } from 'use-clock-source';

function FadeInComponent() {
  const clock = useTimingClock();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const startTime = clock.now;
    
    const animate = () => {
      const elapsed = clock.now - startTime;
      const progress = Math.min(elapsed / 1000, 1); // 1 second fade
      setOpacity(progress);
    };

    return clock.createInterval(animate, 16); // 60fps
  }, [clock]);

  return <div style={{ opacity }}>Fading in...</div>;
}
```

### Synchronized Slideshow

```tsx
import React, { useState, useEffect } from 'react';
import { useTimingClock } from 'use-clock-source';

function Slideshow() {
  const clock = useTimingClock();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const advanceSlide = () => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    };

    // All slideshows advance simultaneously
    return clock.createInterval(advanceSlide, 3000);
  }, [clock]);

  return <div>Slide {currentSlide}</div>;
}
```

### Global Animation Control

```tsx
import React from 'react';
import { useTimingClock } from 'use-clock-source';

function AnimationControls() {
  const clock = useTimingClock();

  return (
    <div>
      <button onClick={clock.pause}>Pause All</button>
      <button onClick={clock.resume}>Resume All</button>
      <button onClick={clock.stop}>Stop All</button>
    </div>
  );
}
```

### Smooth Counter Animation

```tsx
import React, { useState, useEffect } from 'react';
import { useTimingClock } from 'use-clock-source';

function AnimatedCounter({ target }: { target: number }) {
  const clock = useTimingClock();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = clock.now;
    const startValue = current;
    
    const animate = () => {
      const elapsed = clock.now - startTime;
      const progress = Math.min(elapsed / 2000, 1); // 2 second animation
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + (target - startValue) * eased;
      
      setCurrent(Math.round(newValue));
    };

    return clock.createInterval(animate, 16);
  }, [clock, target]);

  return <div>{current}</div>;
}
```

## Performance Benefits

1. **Single Animation Loop**: One centralized loop instead of multiple timers
2. **RequestAnimationFrame**: Uses browser's optimized animation timing
3. **Efficient Updates**: Only updates when needed
4. **Memory Management**: Automatic cleanup of callbacks
5. **Synchronized Timing**: All animations use the same time reference

## Migration from setInterval/setTimeout

Replace your existing timing code:

```tsx
import { useEffect } from 'react';
import { useTimingClock } from 'use-clock-source';

// Before
useEffect(() => {
  const interval = setInterval(updateAnimation, 16);
  return () => clearInterval(interval);
}, []);

// After
function MyComponent() {
  const clock = useTimingClock();
  
  useEffect(() => {
    return clock.createInterval(updateAnimation, 16);
  }, [clock]);
}
```

## Requirements

- React 18.0.0 or higher
- TypeScript 5.0.0 or higher (for TypeScript projects)

## License

MIT

## Contributing

Contributions are welcome! This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes  
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build process or tooling changes

**Examples:**
```bash
git commit -m "feat: add pause/resume functionality"
git commit -m "fix: resolve memory leak in interval cleanup"
git commit -m "docs: update README with new examples"
```

### Automatic Versioning

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automatic versioning:

- **Patch releases** (1.0.0 → 1.0.1): Bug fixes (`fix:` commits)
- **Minor releases** (1.0.0 → 1.1.0): New features (`feat:` commits)
- **Major releases** (1.0.0 → 2.0.0): Breaking changes (`BREAKING CHANGE:` in commit body/footer)

Version numbers, changelogs, and npm releases are automatically generated based on your commit messages.

#### 📦 Publishing Notes

**Important**: The package is only published to npm when commits contain release-triggering types:

- ✅ `feat:` - Triggers minor release and npm publish
- ✅ `fix:` - Triggers patch release and npm publish
- ✅ `BREAKING CHANGE:` - Triggers major release and npm publish
- ❌ `docs:`, `chore:`, `style:`, `refactor:`, `test:` - No release triggered

If your GitHub Actions show successful runs but the package doesn't appear in npm, check that your recent commits include `feat:` or `fix:` types. Documentation and maintenance commits alone won't trigger a release.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes following the commit message convention
4. Add tests for new functionality
5. Run `pnpm test` to ensure everything passes
6. Create a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

$$