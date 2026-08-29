/**
 * Real-Time Animation & Simulation Timer Engine
 * Manages continuous time t (in seconds) for harmonic motion, oscillations, and dynamic Canvas rendering.
 */

export interface AnimationState {
  time: number;          // Continuous simulation time in seconds
  isPlaying: boolean;    // Is simulation currently running
  speedMultiplier: number; // e.g. 0.5x, 1.0x, 2.0x
}

export type AnimationCallback = (time: number) => void;

export class AnimationController {
  private time = 0;
  private isPlaying = false;
  private speedMultiplier = 1.0;
  private animFrameId: number | null = null;
  private lastTimestamp: number | null = null;
  private callbacks: Set<AnimationCallback> = new Set();

  public subscribe(cb: AnimationCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public start(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.loop();
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public reset(): void {
    this.pause();
    this.time = 0;
    this.notify();
  }

  public setSpeed(multiplier: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(5.0, multiplier));
  }

  public getState(): AnimationState {
    return {
      time: parseFloat(this.time.toFixed(3)),
      isPlaying: this.isPlaying,
      speedMultiplier: this.speedMultiplier,
    };
  }

  private loop = (): void => {
    if (!this.isPlaying) return;

    const now = performance.now();
    if (this.lastTimestamp !== null) {
      const deltaSeconds = (now - this.lastTimestamp) / 1000;
      this.time += deltaSeconds * this.speedMultiplier;
      this.notify();
    }
    this.lastTimestamp = now;

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private notify(): void {
    const currentTime = this.time;
    for (const cb of this.callbacks) {
      cb(currentTime);
    }
  }
}
