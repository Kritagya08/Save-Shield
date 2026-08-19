import { describe, it, expect } from 'vitest';
import { getContextualSafetyTips } from '../utils/safetyTips';

describe('Safety Tips Utility', () => {
  it('returns high-risk safety tips when risk level is HIGH', () => {
    const tips = getContextualSafetyTips('high', 'online');
    const hasHighRiskTip = tips.some(t => t.category === 'high_risk');
    expect(hasHighRiskTip).toBe(true);
  });

  it('returns offline-specific tips when communication mode is offline or relay', () => {
    const offlineTips = getContextualSafetyTips('low', 'offline');
    const relayTips = getContextualSafetyTips('low', 'relay');

    expect(offlineTips.some(t => t.category === 'offline')).toBe(true);
    expect(relayTips.some(t => t.category === 'offline')).toBe(true);
  });

  it('sorts safety tips by priority (1 is highest priority)', () => {
    const tips = getContextualSafetyTips('high', 'offline');
    for (let i = 0; i < tips.length - 1; i++) {
      expect(tips[i].priority).toBeLessThanOrEqual(tips[i + 1].priority);
    }
  });

  it('returns non-empty array of tips for any combination', () => {
    expect(getContextualSafetyTips('low', 'online').length).toBeGreaterThan(0);
    expect(getContextualSafetyTips('high', 'offline').length).toBeGreaterThan(0);
  });
});
