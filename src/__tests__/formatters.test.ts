import { describe, it, expect } from 'vitest';
import { formatTime, formatDate, formatDateTime, formatRelativeTime, formatDuration, formatCoordinates, getDurationMinutes } from '../utils/formatters';

describe('Formatters', () => {
  const testDate = '2024-01-15T14:30:45.000Z';

  it('formatTime returns HH:mm:ss', () => {
    const result = formatTime(testDate);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('formatDate returns readable date', () => {
    const result = formatDate(testDate);
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });

  it('formatDateTime returns full datetime', () => {
    const result = formatDateTime(testDate);
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });

  it('formatRelativeTime returns relative string', () => {
    const result = formatRelativeTime(testDate);
    expect(result).toContain('ago');
  });

  it('getDurationMinutes calculates correctly', () => {
    const start = '2024-01-15T14:00:00.000Z';
    const end = '2024-01-15T14:30:00.000Z';
    expect(getDurationMinutes(start, end)).toBe(30);
  });

  it('formatDuration handles short durations', () => {
    const start = new Date().toISOString();
    const end = new Date().toISOString();
    expect(formatDuration(start, end)).toBe('Less than a minute');
  });

  it('formatDuration handles hour durations', () => {
    const start = '2024-01-15T14:00:00.000Z';
    const end = '2024-01-15T15:30:00.000Z';
    expect(formatDuration(start, end)).toBe('1h 30m');
  });

  it('formatCoordinates formats correctly', () => {
    expect(formatCoordinates(28.6139, 77.209)).toBe('28.6139°, 77.2090°');
  });

  it('formatCoordinates handles null', () => {
    expect(formatCoordinates(null, null)).toBe('Unknown');
    expect(formatCoordinates(28.6, null)).toBe('Unknown');
  });
});
