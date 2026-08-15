import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { SimulatedDevice, SimulationState, SOSPacket, TimelineEvent, DeviceRole } from '../types';
import { SIMULATION_DEVICES, SIMULATION_STEP_DELAY_MS, DEMO_COORDINATES, SOS_MAX_HOPS, SOS_PACKET_TTL_SECONDS } from '../lib/constants';
import * as db from '../lib/database';

interface SimulationStore extends SimulationState {
  initDevices: () => void;
  toggleDeviceInternet: (deviceId: string) => void;
  toggleDeviceBluetooth: (deviceId: string) => void;
  setDeviceRole: (deviceId: string, role: DeviceRole) => void;
  addDevice: () => void;
  removeDevice: (deviceId: string) => void;
  startSimulation: (userId: string) => Promise<void>;
  stopSimulation: () => void;
  resetSimulation: () => void;
  simulationEmergencyId: string | null;
}

const createDefaultDevices = (): SimulatedDevice[] => [
  {
    id: SIMULATION_DEVICES.PHONE_A.id,
    name: SIMULATION_DEVICES.PHONE_A.name,
    role: 'emergency',
    internetEnabled: false,
    bluetoothEnabled: true,
    isActive: true,
    position: { x: 50, y: 15 },
  },
  {
    id: SIMULATION_DEVICES.PHONE_B.id,
    name: SIMULATION_DEVICES.PHONE_B.name,
    role: 'relay',
    internetEnabled: false,
    bluetoothEnabled: true,
    isActive: true,
    position: { x: 50, y: 45 },
  },
  {
    id: SIMULATION_DEVICES.PHONE_C.id,
    name: SIMULATION_DEVICES.PHONE_C.name,
    role: 'gateway',
    internetEnabled: true,
    bluetoothEnabled: true,
    isActive: true,
    position: { x: 50, y: 75 },
  },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 8,
  devices: createDefaultDevices(),
  packet: null,
  events: [],
  relayPath: [],
  simulationEmergencyId: null,

  initDevices: () => {
    set({ devices: createDefaultDevices() });
  },

  toggleDeviceInternet: (deviceId) => {
    set((s) => ({
      devices: s.devices.map(d =>
        d.id === deviceId ? { ...d, internetEnabled: !d.internetEnabled } : d
      ),
    }));
  },

  toggleDeviceBluetooth: (deviceId) => {
    set((s) => ({
      devices: s.devices.map(d =>
        d.id === deviceId ? { ...d, bluetoothEnabled: !d.bluetoothEnabled } : d
      ),
    }));
  },

  setDeviceRole: (deviceId, role) => {
    set((s) => ({
      devices: s.devices.map(d =>
        d.id === deviceId ? { ...d, role } : d
      ),
    }));
  },

  addDevice: () => {
    const count = get().devices.length;
    const newDevice: SimulatedDevice = {
      id: `device-custom-${uuidv4().slice(0, 6)}`,
      name: `Phone ${String.fromCharCode(65 + count)}`,
      role: 'relay',
      internetEnabled: false,
      bluetoothEnabled: true,
      isActive: true,
      position: { x: 30 + Math.random() * 40, y: 20 + count * 20 },
    };
    set((s) => ({ devices: [...s.devices, newDevice] }));
  },

  removeDevice: (deviceId) => {
    set((s) => ({ devices: s.devices.filter(d => d.id !== deviceId) }));
  },

  startSimulation: async (userId: string) => {
    const { devices } = get();
    set({ isRunning: true, currentStep: 0, events: [], relayPath: [], packet: null });

    const sessionId = `SIM-${Date.now()}-${uuidv4().slice(0, 6)}`;
    const emergencyDevice = devices.find(d => d.role === 'emergency');
    const relayDevices = devices.filter(d => d.role === 'relay' && d.bluetoothEnabled);
    const gatewayDevice = devices.find(d => d.role === 'gateway' && d.internetEnabled);

    if (!emergencyDevice) {
      set({ isRunning: false });
      return;
    }

    // Create a real emergency record
    let emergency;
    try {
      emergency = await db.createEmergency(
        userId, sessionId,
        DEMO_COORDINATES.latitude, DEMO_COORDINATES.longitude,
        'relay', 'high'
      );
      set({ simulationEmergencyId: emergency.id });
    } catch {
      emergency = { id: `local-${uuidv4()}` };
      set({ simulationEmergencyId: emergency.id });
    }

    const addSimEvent = async (type: TimelineEvent['event_type'], desc: string, devId?: string) => {
      const event: TimelineEvent = {
        id: uuidv4(),
        emergency_id: emergency.id,
        event_type: type,
        description: desc,
        device_id: devId,
        timestamp: new Date().toISOString(),
      };
      set((s) => ({ events: [...s.events, event] }));
      try { await db.addTimelineEvent(emergency.id, type, desc, devId); } catch {}
    };

    // Step 1: SOS Activated
    set({ currentStep: 1 });
    const packet: SOSPacket = {
      session_id: sessionId,
      sender_device: emergencyDevice.id,
      timestamp: new Date().toISOString(),
      latitude: DEMO_COORDINATES.latitude,
      longitude: DEMO_COORDINATES.longitude,
      risk_level: 'high',
      hop_count: 0,
      max_hops: SOS_MAX_HOPS,
      expiry_time: new Date(Date.now() + SOS_PACKET_TTL_SECONDS * 1000).toISOString(),
      status: 'created',
      visited_devices: [emergencyDevice.id],
    };
    set({ packet, relayPath: [emergencyDevice.id] });
    await addSimEvent('sos_activated', 'SOS activated on ' + emergencyDevice.name, emergencyDevice.id);
    await sleep(SIMULATION_STEP_DELAY_MS);
    if (!get().isRunning) return;

    // Step 2: GPS Captured
    set({ currentStep: 2 });
    await addSimEvent('gps_captured', `GPS location captured: ${DEMO_COORDINATES.latitude}, ${DEMO_COORDINATES.longitude}`, emergencyDevice.id);
    await sleep(SIMULATION_STEP_DELAY_MS);
    if (!get().isRunning) return;

    // Step 3: Internet unavailable
    set({ currentStep: 3 });
    await addSimEvent('internet_check', 'Internet unavailable on ' + emergencyDevice.name, emergencyDevice.id);
    await sleep(SIMULATION_STEP_DELAY_MS);
    if (!get().isRunning) return;

    // Step 4: Relay mode activated
    set({ currentStep: 4 });
    set({ packet: { ...packet, status: 'relaying' } });
    await addSimEvent('relay_activated', 'Bluetooth relay mode activated', emergencyDevice.id);
    await sleep(SIMULATION_STEP_DELAY_MS);
    if (!get().isRunning) return;

    // Step 5: Relay devices discovered + forwarded
    for (let i = 0; i < relayDevices.length; i++) {
      const relay = relayDevices[i];
      set({ currentStep: 5 });
      set((s) => ({
        packet: s.packet ? { ...s.packet, hop_count: s.packet.hop_count + 1, visited_devices: [...s.packet.visited_devices, relay.id] } : null,
        relayPath: [...s.relayPath, relay.id],
      }));
      await addSimEvent('relay_discovered', `Relay device discovered: ${relay.name}`, relay.id);
      await sleep(SIMULATION_STEP_DELAY_MS);
      if (!get().isRunning) return;

      set({ currentStep: 6 });
      await addSimEvent('relay_forwarded', `SOS forwarded via ${relay.name} (hop ${get().packet?.hop_count})`, relay.id);
      try {
        await db.addRelayEvent({
          emergency_id: emergency.id,
          sender_device: i === 0 ? emergencyDevice.id : relayDevices[i - 1].id,
          receiver_device: relay.id,
          hop_count: get().packet?.hop_count || i + 1,
          status: 'delivered',
        });
      } catch {}
      await sleep(SIMULATION_STEP_DELAY_MS);
      if (!get().isRunning) return;
    }

    // Step 7: Gateway receives
    if (gatewayDevice) {
      set({ currentStep: 7 });
      set((s) => ({
        packet: s.packet ? { ...s.packet, hop_count: s.packet.hop_count + 1, visited_devices: [...s.packet.visited_devices, gatewayDevice.id] } : null,
        relayPath: [...s.relayPath, gatewayDevice.id],
      }));
      await addSimEvent('gateway_received', `Internet gateway ${gatewayDevice.name} received SOS`, gatewayDevice.id);
      try {
        await db.addRelayEvent({
          emergency_id: emergency.id,
          sender_device: relayDevices.length > 0 ? relayDevices[relayDevices.length - 1].id : emergencyDevice.id,
          receiver_device: gatewayDevice.id,
          hop_count: get().packet?.hop_count || 0,
          status: 'delivered',
        });
      } catch {}
      await sleep(SIMULATION_STEP_DELAY_MS);
      if (!get().isRunning) return;

      // Step 8: Backend acknowledged
      set({ currentStep: 8 });
      set((s) => ({
        packet: s.packet ? { ...s.packet, status: 'delivered' } : null,
        relayPath: [...s.relayPath, 'backend'],
      }));
      await addSimEvent('backend_acknowledged', 'Backend acknowledged SOS — emergency recorded', gatewayDevice.id);

      // Notify contacts
      try {
        const contacts = await db.getContacts(userId);
        for (const contact of contacts) {
          await db.createNotification(userId, emergency.id, 'sos', 'Emergency SOS Alert', `SOS relayed via Bluetooth mesh. Location: ${DEMO_COORDINATES.latitude}, ${DEMO_COORDINATES.longitude}`, contact.id);
          await addSimEvent('contact_notified', `Contact notified: ${contact.name}`, gatewayDevice.id);
        }
      } catch {}
    } else {
      set({ currentStep: 8 });
      await addSimEvent('system_event', 'No internet gateway available — SOS could not be delivered');
      set((s) => ({ packet: s.packet ? { ...s.packet, status: 'expired' } : null }));
    }

    set({ isRunning: false });
  },

  stopSimulation: () => {
    set({ isRunning: false });
  },

  resetSimulation: () => {
    set({
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      devices: createDefaultDevices(),
      packet: null,
      events: [],
      relayPath: [],
      simulationEmergencyId: null,
    });
  },
}));
