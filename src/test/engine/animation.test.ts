import { describe, it, expect, vi } from "vitest";
import { AnimationController } from "@/lib/engine/animation";

describe("AnimationController Unit Tests", () => {
  it("initializes with zero time and paused state", () => {
    const controller = new AnimationController();
    const state = controller.getState();

    expect(state.time).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.speedMultiplier).toBe(1.0);
  });

  it("subscribes and receives state notifications on reset", () => {
    const controller = new AnimationController();
    const listener = vi.fn();

    controller.subscribe(listener);
    controller.reset();

    expect(listener).toHaveBeenCalledWith(0);
    expect(controller.getState().time).toBe(0);
  });

  it("allows setting speed multiplier within bounds", () => {
    const controller = new AnimationController();
    controller.setSpeed(2.0);
    expect(controller.getState().speedMultiplier).toBe(2.0);

    controller.setSpeed(10.0); // should clamp to 5.0
    expect(controller.getState().speedMultiplier).toBe(5.0);
  });
});
