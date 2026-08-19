/**
 * Device sensor & location distance calculation helpers for Save Shield
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BatteryStatus {
  level: number; // 0 to 100 percentage
  isCharging: boolean;
  supported: boolean;
}

/**
 * Calculates the great-circle distance between two GPS coordinates using the Haversine formula
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.latitude * Math.PI) / 180) *
      Math.cos((point2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Formats distance for display (e.g. "450 m" or "3.2 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Formats battery percentage string
 */
export function formatBatteryLevel(level: number, isCharging = false): string {
  const percentage = Math.max(0, Math.min(100, Math.round(level)));
  return `${percentage}%${isCharging ? ' ⚡ (Charging)' : ''}`;
}

/**
 * Reads battery status using Navigator Battery API if available
 */
export async function getBatteryStatus(): Promise<BatteryStatus> {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: Math.round(battery.level * 100),
        isCharging: battery.charging,
        supported: true,
      };
    } catch {
      return { level: 100, isCharging: false, supported: false };
    }
  }
  return { level: 100, isCharging: false, supported: false };
}
