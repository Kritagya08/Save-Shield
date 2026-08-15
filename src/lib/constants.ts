// App constants
export const APP_NAME = 'Save Shield';
export const APP_TAGLINE = 'Emergency protection that keeps working when connectivity doesn\'t.';
export const APP_SUBTITLE = 'An online and offline emergency safety system using intelligent risk assessment, GPS, and Bluetooth relay networking.';

// SOS
export const SOS_COUNTDOWN_SECONDS = 5;
export const SOS_MAX_HOPS = 10;
export const SOS_PACKET_TTL_SECONDS = 300; // 5 minutes

// Risk Assessment Weights
export const RISK_WEIGHTS = {
  SOS_ACTIVATED: 3,
  MOVEMENT_DETECTED: 2,
  DURATION_LONG: 1,
  REPEATED_SOS: 2,
  NO_INTERNET: 1,
  RELAY_ACTIVE: 1,
} as const;

export const RISK_THRESHOLDS = {
  LOW_MAX: 2,
  MEDIUM_MAX: 5,
  // HIGH is anything above MEDIUM_MAX
} as const;

// Simulation
export const SIMULATION_STEP_DELAY_MS = 1500;
export const SIMULATION_DEVICES = {
  PHONE_A: { id: 'device-phone-a', name: 'Phone A' },
  PHONE_B: { id: 'device-phone-b', name: 'Phone B' },
  PHONE_C: { id: 'device-phone-c', name: 'Phone C' },
} as const;

// Demo coordinates (New Delhi, India area)
export const DEMO_COORDINATES = {
  latitude: 28.6139,
  longitude: 77.2090,
  accuracy: 15,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CONTACTS: '/contacts',
  SOS: '/sos',
  LIVE_EMERGENCY: '/emergency/live',
  RELAY_NETWORK: '/relay-network',
  DEVICE_NETWORK: '/devices',
  HISTORY: '/history',
  EMERGENCY_DETAIL: '/emergency/:id',
  TIMELINE: '/emergency/:id/timeline',
  CONTEXT_CARD: '/emergency/:id/context',
  RISK_ASSESSMENT: '/risk-assessment',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  DEMO: '/demo',
  ABOUT: '/about',
} as const;

// Relationships
export const RELATIONSHIP_OPTIONS = [
  'Mother', 'Father', 'Sister', 'Brother',
  'Spouse', 'Partner', 'Friend', 'Colleague',
  'Neighbor', 'Other',
] as const;
