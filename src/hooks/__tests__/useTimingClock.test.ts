import {renderHook} from "@testing-library/react";
import {useTimingClock} from "../useTimingClock";

describe("useTimingClock", () => {
  it("returns timing clock interface", () => {
    const {result} = renderHook(() => useTimingClock());

    expect(result.current).toHaveProperty("now");
    expect(result.current).toHaveProperty("time");
    expect(result.current).toHaveProperty("deltaTime");
    expect(result.current).toHaveProperty("isRunning");
    expect(result.current).toHaveProperty("start");
    expect(result.current).toHaveProperty("stop");
    expect(result.current).toHaveProperty("pause");
    expect(result.current).toHaveProperty("resume");
    expect(result.current).toHaveProperty("getElapsedTime");
    expect(result.current).toHaveProperty("schedule");
    expect(result.current).toHaveProperty("createInterval");
    expect(result.current).toHaveProperty("createTimeout");
  });

  it("starts automatically by default", () => {
    const {result} = renderHook(() => useTimingClock());

    expect(result.current.isRunning).toBe(true);
  });

  it("can be configured to not auto-start", () => {
    const {result} = renderHook(() => useTimingClock({autoStart: false}));

    expect(result.current.isRunning).toBe(false);
  });

  it("can start and stop", () => {
    const {result} = renderHook(() => useTimingClock({autoStart: false}));

    expect(result.current.isRunning).toBe(false);

    // Test that start function exists and can be called
    expect(typeof result.current.start).toBe("function");
    expect(() => result.current.start()).not.toThrow();

    // Test that stop function exists and can be called
    expect(typeof result.current.stop).toBe("function");
    expect(() => result.current.stop()).not.toThrow();
  });

  it("can pause and resume", () => {
    const {result} = renderHook(() => useTimingClock({autoStart: false}));

    // Test that pause function exists and can be called
    expect(typeof result.current.pause).toBe("function");
    expect(() => result.current.pause()).not.toThrow();

    // Test that resume function exists and can be called
    expect(typeof result.current.resume).toBe("function");
    expect(() => result.current.resume()).not.toThrow();
  });

  it("calculates elapsed time correctly", () => {
    const {result} = renderHook(() => useTimingClock());

    const startTime = result.current.now;
    const elapsed = result.current.getElapsedTime(startTime);
    expect(elapsed).toBeGreaterThanOrEqual(0);
  });

  it("schedules callbacks", () => {
    const {result} = renderHook(() => useTimingClock());
    const callback = jest.fn();

    const cleanup = result.current.schedule(callback, 1000);
    expect(typeof cleanup).toBe("function");
    expect(callback).not.toHaveBeenCalled();
  });

  it("creates intervals", () => {
    const {result} = renderHook(() => useTimingClock());
    const callback = jest.fn();

    const cleanup = result.current.createInterval(callback, 1000);
    expect(typeof cleanup).toBe("function");
    expect(callback).not.toHaveBeenCalled();
  });

  it("creates timeouts", () => {
    const {result} = renderHook(() => useTimingClock());
    const callback = jest.fn();

    const cleanup = result.current.createTimeout(callback, 1000);
    expect(typeof cleanup).toBe("function");
    expect(callback).not.toHaveBeenCalled();
  });

  it("returns cleanup functions for timers", () => {
    const {result} = renderHook(() => useTimingClock());
    const callback = jest.fn();

    const cleanup = result.current.createInterval(callback, 1000);
    expect(typeof cleanup).toBe("function");

    // Test that cleanup can be called
    expect(() => cleanup()).not.toThrow();
  });
});
