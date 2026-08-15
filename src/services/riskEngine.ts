import type { RiskAssessment, RiskFactor, RiskLevel, Emergency } from '../types';
import { RISK_WEIGHTS, RISK_THRESHOLDS } from '../lib/constants';

export function assessRisk(params: {
  sosActivated: boolean;
  movementDetected: boolean;
  emergencyDuration: number; // in minutes
  repeatedSOS: boolean;
  noInternet: boolean;
  relayActive: boolean;
  emergency?: Emergency | null;
}): RiskAssessment {
  const factors: RiskFactor[] = [];
  let score = 0;

  // SOS Activated
  const sosActive = params.sosActivated || !!params.emergency;
  factors.push({
    id: 'sos',
    name: 'SOS Activated',
    description: 'Emergency SOS has been activated',
    weight: RISK_WEIGHTS.SOS_ACTIVATED,
    active: sosActive,
  });
  if (sosActive) score += RISK_WEIGHTS.SOS_ACTIVATED;

  // Movement Detected
  factors.push({
    id: 'movement',
    name: 'Movement Detected',
    description: 'Significant movement or location change detected',
    weight: RISK_WEIGHTS.MOVEMENT_DETECTED,
    active: params.movementDetected,
  });
  if (params.movementDetected) score += RISK_WEIGHTS.MOVEMENT_DETECTED;

  // Long Duration
  const longDuration = params.emergencyDuration > 5;
  factors.push({
    id: 'duration',
    name: 'Extended Duration',
    description: 'Emergency has been active for over 5 minutes',
    weight: RISK_WEIGHTS.DURATION_LONG,
    active: longDuration,
  });
  if (longDuration) score += RISK_WEIGHTS.DURATION_LONG;

  // Repeated SOS
  factors.push({
    id: 'repeated',
    name: 'Repeated SOS',
    description: 'Multiple SOS activations within 24 hours',
    weight: RISK_WEIGHTS.REPEATED_SOS,
    active: params.repeatedSOS,
  });
  if (params.repeatedSOS) score += RISK_WEIGHTS.REPEATED_SOS;

  // No Internet
  factors.push({
    id: 'no_internet',
    name: 'No Internet',
    description: 'Device has no internet connectivity',
    weight: RISK_WEIGHTS.NO_INTERNET,
    active: params.noInternet,
  });
  if (params.noInternet) score += RISK_WEIGHTS.NO_INTERNET;

  // Relay Active
  factors.push({
    id: 'relay',
    name: 'Relay Network Active',
    description: 'Emergency is being relayed through Bluetooth mesh',
    weight: RISK_WEIGHTS.RELAY_ACTIVE,
    active: params.relayActive,
  });
  if (params.relayActive) score += RISK_WEIGHTS.RELAY_ACTIVE;

  let level: RiskLevel = 'low';
  if (score > RISK_THRESHOLDS.MEDIUM_MAX) level = 'high';
  else if (score > RISK_THRESHOLDS.LOW_MAX) level = 'medium';

  return {
    level,
    score,
    factors,
    timestamp: new Date().toISOString(),
    disclaimer: 'This is a prototype rule-based assessment and not a guaranteed prediction of danger. Always contact local emergency services in a real emergency.',
  };
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-amber-500';
    case 'low': return 'text-emerald-500';
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'high': return 'bg-red-500/20 border-red-500/40';
    case 'medium': return 'bg-amber-500/20 border-amber-500/40';
    case 'low': return 'bg-emerald-500/20 border-emerald-500/40';
  }
}
