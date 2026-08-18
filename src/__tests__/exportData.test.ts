import { describe, it, expect } from 'vitest';
import { convertEmergenciesToCSV, convertContactsToJSON } from '../utils/exportData';
import type { Emergency, EmergencyContact } from '../types';

describe('Data Export Utilities', () => {
  describe('convertEmergenciesToCSV', () => {
    it('generates headers when empty', () => {
      const csv = convertEmergenciesToCSV([]);
      expect(csv).toContain('ID,Session ID,Status,Risk Level');
    });

    it('formats emergency records properly into CSV rows', () => {
      const mockEmergencies: Emergency[] = [
        {
          id: 'emg-1',
          user_id: 'usr-1',
          session_id: 'SOS-001',
          status: 'resolved',
          risk_level: 'high',
          latitude: 28.6139,
          longitude: 77.209,
          communication_mode: 'relay',
          created_at: '2026-08-18T10:00:00Z',
          resolved_at: '2026-08-18T10:15:00Z',
        },
      ];

      const csv = convertEmergenciesToCSV(mockEmergencies);
      expect(csv).toContain('"SOS-001"');
      expect(csv).toContain('"high"');
      expect(csv).toContain('28.6139');
    });
  });

  describe('convertContactsToJSON', () => {
    it('serializes contact list to valid formatted JSON string', () => {
      const mockContacts: EmergencyContact[] = [
        {
          id: 'c-1',
          user_id: 'usr-1',
          name: 'Jane Doe',
          phone: '+919876543210',
          relationship: 'Mother',
          is_primary: true,
          created_at: '2026-08-18T00:00:00Z',
        },
      ];

      const jsonStr = convertContactsToJSON(mockContacts);
      const parsed = JSON.parse(jsonStr);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('Jane Doe');
      expect(parsed[0].is_primary).toBe(true);
    });
  });
});
