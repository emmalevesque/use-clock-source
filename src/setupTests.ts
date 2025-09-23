import "@testing-library/jest-dom";

// Mock requestAnimationFrame
(globalThis as any).requestAnimationFrame = (
  callback: FrameRequestCallback
) => {
  return setTimeout(callback, 16);
};

(globalThis as any).cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock performance.now
Object.defineProperty(window, "performance", {
  value: {
    now: () => Date.now(),
  },
  writable: true,
  configurable: true,
});
