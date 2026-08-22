import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateAccelerationMagnitude,
  isShakeForce,
  ShakeDetector,
} from '../utils/motionDetector';

describe('Motion & Shake Detection Utility', () => {
  describe('calculateAccelerationMagnitude', () => {
    it('calculates magnitude of 3D vector correctly', () => {
      // 3^2 + 4^2 + 0^2 = 25 -> sqrt(25) = 5
      expect(calculateAccelerationMagnitude({ x: 3, y: 4, z: 0 })).toBe(5);
    });
  });

  describe('isShakeForce', () => {
    it('returns true when acceleration exceeds threshold', () => {
      expect(isShakeForce({ x: 10, y: 10, z: 10 }, 15)).toBe(true); // ~17.3 > 15
    });

    it('returns false when acceleration is below threshold', () => {
      expect(isShakeForce({ x: 2, y: 2, z: 2 }, 15)).toBe(false); // ~3.46 < 15
    });
  });

  describe('ShakeDetector class', () => {
    let detector: ShakeDetector;

    beforeEach(() => {
      detector = new ShakeDetector({ threshold: 15, requiredShakes: 3, timeoutMs: 2000 });
    });

    it('triggers emergency when 3 rapid shakes occur', () => {
      const sample = { x: 10, y: 10, z: 10 };
      const now = 100000;

      expect(detector.registerSample(sample, now)).toBe(false);
      expect(detector.registerSample(sample, now + 300)).toBe(false);
      expect(detector.registerSample(sample, now + 600)).toBe(true); // 3rd shake triggers!
    });

    it('resets count if shakes occur too far apart in time', () => {
      const sample = { x: 10, y: 10, z: 10 };
      const now = 100000;

      detector.registerSample(sample, now);
      expect(detector.getShakeCount()).toBe(1);

      // 3 seconds later (> 2000ms timeout)
      detector.registerSample(sample, now + 3000);
      expect(detector.getShakeCount()).toBe(1); // Reset back to 1
    });
  });
});
