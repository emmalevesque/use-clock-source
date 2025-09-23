# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- `npm run build` - Build the library using tsup (outputs to dist/)
- `npm run dev` - Start development build with watch mode
- `npm run clean` - Remove the dist directory
- `npm run type-check` - Run TypeScript type checking without emitting files

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report (requires 80% coverage threshold)

### Package Management
- `npm run prepublishOnly` - Automatically runs build before publishing
- `npm run preview` - Build and show what would be included in npm package

## Architecture

This is a React timing system library that provides centralized clock management for animations and timed events. The core architecture consists of:

### Core Components

**TimingClock Interface** (`src/hooks/useTimingClock.ts` & `src/contexts/TimingContext.tsx`):
- Central timing interface with methods: `start()`, `stop()`, `pause()`, `resume()`
- Timing utilities: `schedule()`, `createInterval()`, `createTimeout()`
- Properties: `now` (milliseconds), `time` (seconds), `deltaTime`, `isRunning`
- Uses either `requestAnimationFrame` (default) or `setInterval` for timing loops

**Two Usage Patterns**:
1. **Context-based** (`TimingProvider` + `useTimingClock`): Global timing shared across components
2. **Standalone** (`useTimingClockStandalone`): Independent timing instances per component

### Key Implementation Details

- **Timing Loop**: Single centralized loop using RAF or setInterval based on `useRAF` option
- **Callback Management**: Three types of callbacks managed via Maps with unique IDs:
  - `scheduledCallbacks` - one-time scheduled events
  - `intervalCallbacks` - repeating intervals
  - `timeoutCallbacks` - delayed one-time events
- **State Synchronization**: All components using the same TimingProvider share identical timing state
- **Memory Management**: Cleanup functions returned from timing methods for proper disposal

### Library Structure

- `src/index.ts` - Main exports and public API
- `src/hooks/useTimingClock.ts` - Standalone timing hook implementation
- `src/contexts/TimingContext.tsx` - React Context provider and hook
- `src/components/TimingExamples.tsx` - Example components for documentation
- `src/components/ClockSource.tsx` - Additional timing utilities

### Testing

Uses Jest with jsdom environment. Tests are located in `__tests__` directories alongside source files. Coverage threshold is set to 80% for all metrics. TimingExamples.tsx is excluded from coverage.

### Build Configuration

- **tsup**: Builds both CommonJS and ESM formats with TypeScript declarations
- **External dependencies**: React, React-DOM, and Next.js are marked as externals
- **Target compatibility**: React 18+, Node 16+, Next.js 13+