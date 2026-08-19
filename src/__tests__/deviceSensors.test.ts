import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, formatDistance, formatBatteryLevel } from '../utils/deviceSensors';

describe('Device Sensors & Distance Utility', () => {
  describe('calculateHaversineDistance', () => {
    it('calculates 0 km for identical coordinates', () => {
      const point = { latitude: 28.6139, longitude: 77.209 };
      expect(calculateHaversineDistance(point, point)).toBe(0);
    });

    it('calculates accurate distance between New Delhi and Mumbai (~1150 km)', () => {
      const delhi = { latitude: 28.6139, longitude: 77.209 };
      const mumbai = { latitude: 19.076, longitude: 72.8777 };
      const distance = calculateHaversineDistance(delhi, mumbai);

      expect(distance).toBeGreaterThan(1100);
      expect(distance).toBeLessThan(1200);
    });
  });

  describe('formatDistance', () => {
    it('formats distances under 1 km in meters', () => {
      expect(formatDistance(0.45)).toBe('450 m');
      expect(formatDistance(0.05)).toBe('50 m');
    });

    it('formats distances 1 km or above in kilometers', () => {
      expect(formatDistance(3.25)).toBe('3.3 km');
      expect(formatDistance(12.0)).toBe('12.0 km');
    });
  });

  describe('formatBatteryLevel', () => {
    it('formats battery percentages correctly', () => {
      expect(formatBatteryLevel(85)).toBe('85%');
      expect(formatBatteryLevel(42.6)).toBe('43%');
    });

    it('adds charging indicator when charging', () => {
      expect(formatBatteryLevel(90, true)).toContain('⚡ (Charging)');
    });

    it('clamps out-of-range values between 0 and 100', () => {
      expect(formatBatteryLevel(150)).toBe('100%');
      expect(formatBatteryLevel(-10)).toBe('0%');
    });
  });
});
