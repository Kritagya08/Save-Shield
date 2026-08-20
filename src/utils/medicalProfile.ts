/**
 * Emergency Medical Context & Profile Utility for Save Shield
 */

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export interface MedicalProfile {
  bloodType: BloodType;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyNotes?: string;
  organDonation: boolean;
}

export const DEFAULT_MEDICAL_PROFILE: MedicalProfile = {
  bloodType: 'Unknown',
  allergies: [],
  medicalConditions: [],
  medications: [],
  organDonation: false,
};

/**
 * Formats medical profile into concise text summary for emergency responders
 */
export function formatMedicalSummary(profile: MedicalProfile): string {
  const parts: string[] = [];

  parts.push(`Blood Type: ${profile.bloodType}`);

  if (profile.allergies.length > 0) {
    parts.push(`Allergies: ${profile.allergies.join(', ')}`);
  } else {
    parts.push('Allergies: None reported');
  }

  if (profile.medicalConditions.length > 0) {
    parts.push(`Conditions: ${profile.medicalConditions.join(', ')}`);
  }

  if (profile.medications.length > 0) {
    parts.push(`Medications: ${profile.medications.join(', ')}`);
  }

  if (profile.organDonation) {
    parts.push('Organ Donor: Yes');
  }

  if (profile.emergencyNotes && profile.emergencyNotes.trim()) {
    parts.push(`Notes: ${profile.emergencyNotes.trim()}`);
  }

  return parts.join(' | ');
}

/**
 * Validates medical profile fields
 */
export function validateMedicalProfile(profile: Partial<MedicalProfile>): { isValid: boolean; error?: string } {
  if (profile.emergencyNotes && profile.emergencyNotes.length > 300) {
    return { isValid: false, error: 'Emergency notes cannot exceed 300 characters' };
  }
  return { isValid: true };
}
