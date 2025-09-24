import React from "react";
import {render, screen} from "@testing-library/react";
import {TimingProvider, useTimingClock} from "../TimingContext";

// Test component that uses the timing clock
function TestComponent() {
  const clock = useTimingClock();
  return (
    <div>
      <div data-testid="is-running">{clock.isRunning.toString()}</div>
      <div data-testid="now">{clock.now}</div>
      <div data-testid="time">{clock.time}</div>
      <button onClick={clock.start}>Start</button>
      <button onClick={clock.stop}>Stop</button>
      <button onClick={clock.pause}>Pause</button>
      <button onClick={clock.resume}>Resume</button>
    </div>
  );
}

describe("TimingProvider", () => {
  it("provides timing clock context", () => {
    render(
      <TimingProvider>
        <TestComponent />
      </TimingProvider>
    );

    expect(screen.getByTestId("is-running")).toHaveTextContent("true");
    expect(screen.getByTestId("now")).toBeInTheDocument();
    expect(screen.getByTestId("time")).toBeInTheDocument();
  });

  it("starts automatically by default", () => {
    render(
      <TimingProvider>
        <TestComponent />
      </TimingProvider>
    );

    expect(screen.getByTestId("is-running")).toHaveTextContent("true");
  });

  it("can be configured to not auto-start", () => {
    render(
      <TimingProvider autoStart={false}>
        <TestComponent />
      </TimingProvider>
    );

    expect(screen.getByTestId("is-running")).toHaveTextContent("false");
  });

  it("provides control methods", () => {
    render(
      <TimingProvider autoStart={false}>
        <TestComponent />
      </TimingProvider>
    );

    const startButton = screen.getByText("Start");
    const stopButton = screen.getByText("Stop");
    const pauseButton = screen.getByText("Pause");
    const resumeButton = screen.getByText("Resume");

    expect(startButton).toBeInTheDocument();
    expect(stopButton).toBeInTheDocument();
    expect(pauseButton).toBeInTheDocument();
    expect(resumeButton).toBeInTheDocument();
  });

  it("updates time values", async () => {
    render(
      <TimingProvider>
        <TestComponent />
      </TimingProvider>
    );

    const nowElement = screen.getByTestId("now");
    const timeElement = screen.getByTestId("time");

    // Check that time values are present and valid
    expect(nowElement.textContent).toBeTruthy();
    expect(timeElement.textContent).toBeTruthy();
    expect(Number(nowElement.textContent)).toBeGreaterThan(0);
    expect(Number(timeElement.textContent)).toBeGreaterThan(0);
  });

});

describe("useTimingClock", () => {
  it("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTimingClock must be used within a TimingProvider");

    consoleSpy.mockRestore();
  });
});
