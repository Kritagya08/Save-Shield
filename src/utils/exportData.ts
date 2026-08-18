import type { Emergency, EmergencyContact } from '../types';

/**
 * Converts emergency records into CSV format string
 */
export function convertEmergenciesToCSV(emergencies: Emergency[]): string {
  if (!emergencies || emergencies.length === 0) {
    return 'ID,Session ID,Status,Risk Level,Latitude,Longitude,Mode,Created At,Resolved At\n';
  }

  const headers = ['ID', 'Session ID', 'Status', 'Risk Level', 'Latitude', 'Longitude', 'Mode', 'Created At', 'Resolved At'];
  const rows = emergencies.map(e => [
    `"${e.id}"`,
    `"${e.session_id}"`,
    `"${e.status}"`,
    `"${e.risk_level}"`,
    e.latitude ?? '',
    e.longitude ?? '',
    `"${e.communication_mode}"`,
    `"${e.created_at}"`,
    `"${e.resolved_at ?? ''}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Formats emergency contacts into JSON string download blob
 */
export function convertContactsToJSON(contacts: EmergencyContact[]): string {
  return JSON.stringify(contacts, null, 2);
}

/**
 * Triggers a browser file download for text content
 */
export function downloadFile(filename: string, content: string, contentType = 'text/csv'): void {
  const blob = new Blob([content], { type: `${contentType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
