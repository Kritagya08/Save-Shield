/**
 * Motion gesture & shake detection utility for hands-free emergency trigger
 */

export interface AccelerationData {
  x: number;
  y: number;
  z: number;
}

export interface ShakeDetectorOptions {
  threshold: number; // Acceleration magnitude threshold (default ~15 m/s²)
  requiredShakes: number; // Number of rapid shakes needed to trigger (default 3)
  timeoutMs: number; // Time window in ms for counting shakes (default 2000ms)
}

export const DEFAULT_SHAKE_OPTIONS: ShakeDetectorOptions = {
  threshold: 15,
  requiredShakes: 3,
  timeoutMs: 2000,
};

/**
 * Calculates total G-force acceleration magnitude from 3D vector
 */
export function calculateAccelerationMagnitude(acc: AccelerationData): number {
  return Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
}

/**
 * Evaluates whether acceleration exceeds the shake threshold
 */
export function isShakeForce(acc: AccelerationData, threshold = DEFAULT_SHAKE_OPTIONS.threshold): boolean {
  const magnitude = calculateAccelerationMagnitude(acc);
  return magnitude >= threshold;
}

export class ShakeDetector {
  private shakeCount = 0;
  private lastShakeTime = 0;
  private options: ShakeDetectorOptions;

  constructor(options: Partial<ShakeDetectorOptions> = {}) {
    this.options = { ...DEFAULT_SHAKE_OPTIONS, ...options };
  }

  /**
   * Process acceleration sample
   * @returns true if emergency shake gesture criteria met
   */
  public registerSample(acc: AccelerationData, timestamp = Date.now()): boolean {
    if (isShakeForce(acc, this.options.threshold)) {
      // Reset count if too much time passed since last shake
      if (timestamp - this.lastShakeTime > this.options.timeoutMs) {
        this.shakeCount = 0;
      }

      this.shakeCount += 1;
      this.lastShakeTime = timestamp;

      if (this.shakeCount >= this.options.requiredShakes) {
        this.reset();
        return true; // Emergency trigger activated!
      }
    }
    return false;
  }

  public getShakeCount(): number {
    return this.shakeCount;
  }

  public reset(): void {
    this.shakeCount = 0;
    this.lastShakeTime = 0;
  }
}
