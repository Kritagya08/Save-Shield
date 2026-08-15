import { describe, it, expect, beforeEach } from 'vitest';
import { validatePacket, clearSeenPackets, getSeenCount } from '../services/packetValidator';
import type { SOSPacket } from '../types';

function createTestPacket(overrides: Partial<SOSPacket> = {}): SOSPacket {
  return {
    session_id: 'test-session-001',
    sender_device: 'device-a',
    timestamp: new Date().toISOString(),
    latitude: 28.6139,
    longitude: 77.2090,
    risk_level: 'high',
    hop_count: 0,
    max_hops: 10,
    expiry_time: new Date(Date.now() + 300000).toISOString(), // 5 min from now
    status: 'relaying',
    visited_devices: ['device-a'],
    ...overrides,
  };
}

describe('Packet Validator', () => {
  beforeEach(() => {
    clearSeenPackets();
  });

  it('accepts a valid packet', () => {
    const packet = createTestPacket();
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(true);
  });

  it('rejects expired packets', () => {
    const packet = createTestPacket({
      expiry_time: new Date(Date.now() - 1000).toISOString(), // expired 1s ago
    });
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('expired');
  });

  it('rejects packets exceeding max hops', () => {
    const packet = createTestPacket({ hop_count: 10, max_hops: 10 });
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('hop count');
  });

  it('detects relay loops', () => {
    const packet = createTestPacket({
      visited_devices: ['device-a', 'device-b', 'device-c'],
    });
    // device-b is already in visited_devices
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Loop detected');
  });

  it('detects duplicate packets', () => {
    const packet = createTestPacket();
    // First time should be valid
    const result1 = validatePacket(packet, 'device-b');
    expect(result1.valid).toBe(true);

    // Second time same session on same device should be duplicate
    const result2 = validatePacket(packet, 'device-b');
    expect(result2.valid).toBe(false);
    expect(result2.reason).toContain('Duplicate');
  });

  it('allows same packet on different devices', () => {
    const packet = createTestPacket();
    const result1 = validatePacket(packet, 'device-b');
    expect(result1.valid).toBe(true);

    const packet2 = createTestPacket({ visited_devices: ['device-a', 'device-b'] });
    const result2 = validatePacket(packet2, 'device-c');
    expect(result2.valid).toBe(true);
  });

  it('rejects cancelled packets', () => {
    const packet = createTestPacket({ status: 'cancelled' });
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('cancelled');
  });

  it('rejects packets with missing fields', () => {
    const packet = createTestPacket({ session_id: '' });
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('missing required');
  });

  it('clearSeenPackets resets deduplication', () => {
    const packet = createTestPacket();
    validatePacket(packet, 'device-b');
    expect(getSeenCount('device-b')).toBe(1);

    clearSeenPackets();
    expect(getSeenCount('device-b')).toBe(0);
  });

  it('allows packets below max hops', () => {
    const packet = createTestPacket({ hop_count: 5, max_hops: 10 });
    const result = validatePacket(packet, 'device-b');
    expect(result.valid).toBe(true);
  });

  it('prevents infinite relay loops A->B->C->A', () => {
    const packet = createTestPacket({
      visited_devices: ['device-a', 'device-b', 'device-c'],
      hop_count: 3,
    });
    // Trying to send back to device-a (loop!)
    const result = validatePacket(packet, 'device-a');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Loop detected');
  });
});
