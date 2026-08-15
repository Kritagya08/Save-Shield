import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Emergency, RiskLevel, CommunicationMode, TimelineEvent, SystemStatus } from '../types';
import * as db from '../lib/database';
import { DEMO_COORDINATES } from '../lib/constants';

interface EmergencyState {
  activeEmergency: Emergency | null;
  emergencies: Emergency[];
  timeline: TimelineEvent[];
  systemStatus: SystemStatus;
  isLoading: boolean;
  error: string | null;

  setSystemStatus: (status: Partial<SystemStatus>) => void;
  loadEmergencies: (userId: string) => Promise<void>;
  loadActiveEmergency: (userId: string) => Promise<void>;
  activateSOS: (userId: string, latitude?: number | null, longitude?: number | null) => Promise<Emergency>;
  cancelEmergency: (emergencyId: string) => Promise<void>;
  resolveEmergency: (emergencyId: string) => Promise<void>;
  updateRiskLevel: (emergencyId: string, level: RiskLevel) => Promise<void>;
  loadTimeline: (emergencyId: string) => Promise<void>;
  addEvent: (emergencyId: string, type: TimelineEvent['event_type'], description: string, deviceId?: string) => Promise<void>;
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  activeEmergency: null,
  emergencies: [],
  timeline: [],
  systemStatus: {
    online: navigator.onLine,
    gpsAvailable: false,
    bluetoothRelay: false,
    emergencyActive: false,
    activeEmergencyId: null,
  },
  isLoading: false,
  error: null,

  setSystemStatus: (status) => {
    set((s) => ({ systemStatus: { ...s.systemStatus, ...status } }));
  },

  loadEmergencies: async (userId) => {
    set({ isLoading: true });
    try {
      const emergencies = await db.getEmergencies(userId);
      set({ emergencies, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  loadActiveEmergency: async (userId) => {
    try {
      const emergency = await db.getActiveEmergency(userId);
      set({
        activeEmergency: emergency,
        systemStatus: {
          ...get().systemStatus,
          emergencyActive: !!emergency,
          activeEmergencyId: emergency?.id || null,
        },
      });
      if (emergency) {
        await get().loadTimeline(emergency.id);
      }
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  activateSOS: async (userId, latitude, longitude) => {
    const sessionId = `SOS-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const isOnline = navigator.onLine;
    const mode: CommunicationMode = isOnline ? 'online' : 'offline';

    const lat = latitude ?? DEMO_COORDINATES.latitude;
    const lon = longitude ?? DEMO_COORDINATES.longitude;

    const emergency = await db.createEmergency(userId, sessionId, lat, lon, mode, 'high');

    // Create initial timeline events
    await db.addTimelineEvent(emergency.id, 'sos_activated', 'Emergency SOS activated');
    await db.addTimelineEvent(emergency.id, 'gps_captured', `GPS location captured: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    await db.addTimelineEvent(emergency.id, 'internet_check', isOnline ? 'Internet connection available' : 'Internet connection unavailable');

    if (!isOnline) {
      await db.addTimelineEvent(emergency.id, 'relay_activated', 'Bluetooth relay mode activated');
    }

    // Create notifications for contacts
    const contacts = await db.getContacts(userId);
    for (const contact of contacts) {
      await db.createNotification(
        userId, emergency.id, 'sos',
        'Emergency SOS Alert',
        `SOS activated. Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        contact.id,
      );
    }

    const timeline = await db.getTimelineEvents(emergency.id);

    set({
      activeEmergency: emergency,
      timeline,
      systemStatus: {
        ...get().systemStatus,
        emergencyActive: true,
        activeEmergencyId: emergency.id,
        online: isOnline,
      },
    });

    return emergency;
  },

  cancelEmergency: async (emergencyId) => {
    await db.updateEmergency(emergencyId, { status: 'cancelled', resolved_at: new Date().toISOString() });
    await db.addTimelineEvent(emergencyId, 'sos_cancelled', 'Emergency cancelled by user');
    set({
      activeEmergency: null,
      systemStatus: { ...get().systemStatus, emergencyActive: false, activeEmergencyId: null },
    });
  },

  resolveEmergency: async (emergencyId) => {
    await db.updateEmergency(emergencyId, { status: 'resolved', resolved_at: new Date().toISOString() });
    await db.addTimelineEvent(emergencyId, 'sos_resolved', 'Emergency resolved');
    set({
      activeEmergency: null,
      systemStatus: { ...get().systemStatus, emergencyActive: false, activeEmergencyId: null },
    });
  },

  updateRiskLevel: async (emergencyId, level) => {
    await db.updateEmergency(emergencyId, { risk_level: level });
    await db.addTimelineEvent(emergencyId, 'risk_updated', `Risk level updated to ${level.toUpperCase()}`);
    const { activeEmergency } = get();
    if (activeEmergency?.id === emergencyId) {
      set({ activeEmergency: { ...activeEmergency, risk_level: level } });
    }
  },

  loadTimeline: async (emergencyId) => {
    const timeline = await db.getTimelineEvents(emergencyId);
    set({ timeline });
  },

  addEvent: async (emergencyId, type, description, deviceId) => {
    const event = await db.addTimelineEvent(emergencyId, type, description, deviceId);
    set((s) => ({ timeline: [...s.timeline, event] }));
  },
}));
