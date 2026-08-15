import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns';

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'HH:mm:ss');
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM dd, yyyy');
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'MMM dd, yyyy HH:mm:ss');
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function getDurationMinutes(start: string, end?: string | null): number {
  const endDate = end ? new Date(end) : new Date();
  return differenceInMinutes(endDate, new Date(start));
}

export function formatDuration(start: string, end?: string | null): string {
  const mins = getDurationMinutes(start, end);
  if (mins < 1) return 'Less than a minute';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'}`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}

export function formatCoordinates(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'Unknown';
  return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
}
