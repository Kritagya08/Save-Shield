// ─── User & Auth ───

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

// ─── Emergency Contacts ───

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  isPrimary?: boolean;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
}

// ─── Emergencies ───

export type EmergencyStatus = 'active' | 'resolved' | 'cancelled' | 'failed';
export type RiskLevel = 'low' | 'medium' | 'high';
export type CommunicationMode = 'online' | 'offline' | 'relay';

export interface Emergency {
  id: string;
  user_id: string;
  session_id: string;
  status: EmergencyStatus;
  risk_level: RiskLevel;
  latitude: number | null;
  longitude: number | null;
  communication_mode: CommunicationMode;
  created_at: string;
  resolved_at: string | null;
}

// ─── Emergency Timeline ───

export type TimelineEventType =
  | 'sos_activated'
  | 'sos_cancelled'
  | 'sos_resolved'
  | 'gps_captured'
  | 'internet_check'
  | 'relay_activated'
  | 'relay_discovered'
  | 'relay_forwarded'
  | 'gateway_received'
  | 'backend_acknowledged'
  | 'contact_notified'
  | 'risk_updated'
  | 'location_updated'
  | 'status_changed'
  | 'system_event';

export interface TimelineEvent {
  id: string;
  emergency_id: string;
  event_type: TimelineEventType;
  description: string;
  device_id?: string;
  timestamp: string;
}

// ─── Relay Network ───

export type DeviceRole = 'emergency' | 'relay' | 'gateway';
export type DeviceStatus = 'online' | 'offline' | 'relaying';

export interface RelayDevice {
  id: string;
  device_id: string;
  device_name: string;
  status: DeviceStatus;
  internet_available: boolean;
  bluetooth_available: boolean;
  role: DeviceRole;
  last_seen: string;
}

export interface RelayEvent {
  id: string;
  emergency_id: string;
  sender_device: string;
  receiver_device: string;
  hop_count: number;
  status: string;
  timestamp: string;
}

// ─── SOS Packet ───

export interface SOSPacket {
  session_id: string;
  sender_device: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  risk_level: RiskLevel;
  hop_count: number;
  max_hops: number;
  expiry_time: string;
  status: 'created' | 'relaying' | 'delivered' | 'expired' | 'cancelled';
  visited_devices: string[];
}

// ─── Notifications ───

export type NotificationType = 'sos' | 'contact' | 'relay' | 'gateway' | 'system';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'confirmed';

export interface Notification {
  id: string;
  user_id: string;
  emergency_id: string;
  contact_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  timestamp: string;
}

// ─── Risk Assessment ───

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  weight: number;
  active: boolean;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactor[];
  timestamp: string;
  disclaimer: string;
}

// ─── Simulation ───

export interface SimulatedDevice {
  id: string;
  name: string;
  role: DeviceRole;
  internetEnabled: boolean;
  bluetoothEnabled: boolean;
  isActive: boolean;
  position: { x: number; y: number };
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  devices: SimulatedDevice[];
  packet: SOSPacket | null;
  events: TimelineEvent[];
  relayPath: string[];
}

// ─── App State ───

export interface SystemStatus {
  online: boolean;
  gpsAvailable: boolean;
  bluetoothRelay: boolean;
  emergencyActive: boolean;
  activeEmergencyId: string | null;
}
