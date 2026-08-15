import type { SOSPacket } from '../types';
import { SOS_MAX_HOPS } from '../lib/constants';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// Track seen packets for deduplication
const seenPackets = new Map<string, Set<string>>();

export function validatePacket(packet: SOSPacket, receiverDeviceId: string): ValidationResult {
  // 1. Check if packet is expired
  if (new Date(packet.expiry_time) < new Date()) {
    return { valid: false, reason: 'Packet has expired (TTL exceeded)' };
  }

  // 2. Check hop count
  if (packet.hop_count >= (packet.max_hops || SOS_MAX_HOPS)) {
    return { valid: false, reason: `Maximum hop count reached (${packet.hop_count}/${packet.max_hops})` };
  }

  // 3. Check for relay loops — has this device already seen this packet?
  if (packet.visited_devices.includes(receiverDeviceId)) {
    return { valid: false, reason: `Loop detected: device ${receiverDeviceId} already in relay path` };
  }

  // 4. Check for duplicate packets on this device
  const deviceSeen = seenPackets.get(receiverDeviceId) || new Set();
  if (deviceSeen.has(packet.session_id)) {
    return { valid: false, reason: 'Duplicate packet: already processed by this device' };
  }

  // 5. Check status
  if (packet.status === 'cancelled' || packet.status === 'expired') {
    return { valid: false, reason: `Packet status is ${packet.status}` };
  }

  // 6. Basic data validation
  if (!packet.session_id || !packet.sender_device) {
    return { valid: false, reason: 'Invalid packet: missing required fields' };
  }

  // Mark as seen
  deviceSeen.add(packet.session_id);
  seenPackets.set(receiverDeviceId, deviceSeen);

  return { valid: true };
}

export function clearSeenPackets(): void {
  seenPackets.clear();
}

export function getSeenCount(deviceId: string): number {
  return seenPackets.get(deviceId)?.size || 0;
}
