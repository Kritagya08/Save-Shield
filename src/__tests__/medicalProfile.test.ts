import { describe, it, expect } from 'vitest';
import {
  formatMedicalSummary,
  validateMedicalProfile,
  DEFAULT_MEDICAL_PROFILE,
  type MedicalProfile,
} from '../utils/medicalProfile';

describe('Emergency Medical Profile Utility', () => {
  it('formats default medical profile correctly', () => {
    const summary = formatMedicalSummary(DEFAULT_MEDICAL_PROFILE);
    expect(summary).toContain('Blood Type: Unknown');
    expect(summary).toContain('Allergies: None reported');
  });

  it('formats complete medical profile into emergency summary', () => {
    const profile: MedicalProfile = {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      medicalConditions: ['Asthma'],
      medications: ['Inhaler'],
      emergencyNotes: 'Requires inhaler during severe panic or exertion',
      organDonation: true,
    };

    const summary = formatMedicalSummary(profile);
    expect(summary).toContain('Blood Type: O+');
    expect(summary).toContain('Allergies: Penicillin, Peanuts');
    expect(summary).toContain('Conditions: Asthma');
    expect(summary).toContain('Medications: Inhaler');
    expect(summary).toContain('Organ Donor: Yes');
    expect(summary).toContain('Notes: Requires inhaler during severe panic or exertion');
  });

  it('validates emergency notes length limit', () => {
    const valid = validateMedicalProfile({ emergencyNotes: 'Short note' });
    expect(valid.isValid).toBe(true);

    const longNotes = 'A'.repeat(301);
    const invalid = validateMedicalProfile({ emergencyNotes: longNotes });
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toContain('cannot exceed 300 characters');
  });
});
