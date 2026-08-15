import { describe, it, expect } from 'vitest';
import { assessRisk, getRiskColor, getRiskBgColor } from '../services/riskEngine';

describe('Risk Assessment Engine', () => {
  it('returns LOW risk when no factors are active', () => {
    const result = assessRisk({
      sosActivated: false,
      movementDetected: false,
      emergencyDuration: 0,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    expect(result.level).toBe('low');
    expect(result.score).toBe(0);
  });

  it('returns HIGH risk when SOS is activated with movement', () => {
    const result = assessRisk({
      sosActivated: true,
      movementDetected: true,
      emergencyDuration: 10,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    expect(result.level).toBe('high');
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  it('returns MEDIUM risk with SOS only', () => {
    const result = assessRisk({
      sosActivated: true,
      movementDetected: false,
      emergencyDuration: 0,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    expect(result.level).toBe('medium');
    expect(result.score).toBe(3);
  });

  it('includes all 6 risk factors', () => {
    const result = assessRisk({
      sosActivated: true,
      movementDetected: true,
      emergencyDuration: 10,
      repeatedSOS: true,
      noInternet: true,
      relayActive: true,
    });
    expect(result.factors).toHaveLength(6);
    expect(result.level).toBe('high');
    expect(result.factors.every(f => f.active)).toBe(true);
  });

  it('includes disclaimer', () => {
    const result = assessRisk({
      sosActivated: false,
      movementDetected: false,
      emergencyDuration: 0,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    expect(result.disclaimer).toContain('prototype');
  });

  it('correctly identifies long duration as > 5 minutes', () => {
    const shortResult = assessRisk({
      sosActivated: false,
      movementDetected: false,
      emergencyDuration: 3,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    const longResult = assessRisk({
      sosActivated: false,
      movementDetected: false,
      emergencyDuration: 10,
      repeatedSOS: false,
      noInternet: false,
      relayActive: false,
    });
    expect(shortResult.score).toBe(0);
    expect(longResult.score).toBe(1);
  });

  it('getRiskColor returns correct colors', () => {
    expect(getRiskColor('high')).toContain('red');
    expect(getRiskColor('medium')).toContain('amber');
    expect(getRiskColor('low')).toContain('emerald');
  });

  it('getRiskBgColor returns correct background classes', () => {
    expect(getRiskBgColor('high')).toContain('red');
    expect(getRiskBgColor('medium')).toContain('amber');
    expect(getRiskBgColor('low')).toContain('emerald');
  });
});
