import { supabase, isSupabaseConfigured } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import type {
  UserProfile, EmergencyContact, ContactFormData,
  Emergency, EmergencyStatus, RiskLevel, CommunicationMode,
  TimelineEvent, TimelineEventType,
  RelayDevice, RelayEvent,
  Notification, NotificationType, NotificationStatus,
} from '../types';

// ─── Local Storage Fallback ───

function getLocalData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(`save-shield-${key}`);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setLocalData<T>(key: string, data: T[]): void {
  localStorage.setItem(`save-shield-${key}`, JSON.stringify(data));
}

// ─── Profile ───

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) {
    const profiles = getLocalData<UserProfile>('profiles');
    return profiles.find(p => p.id === userId) || null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) {
    const profiles = getLocalData<UserProfile>('profiles');
    const idx = profiles.findIndex(p => p.id === profile.id);
    const merged = { ...profiles[idx], ...profile, created_at: profiles[idx]?.created_at || new Date().toISOString() } as UserProfile;
    if (idx >= 0) profiles[idx] = merged; else profiles.push(merged);
    setLocalData('profiles', profiles);
    return merged;
  }
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) throw error;
  return data;
}

// ─── Emergency Contacts ───

export async function getContacts(userId: string): Promise<EmergencyContact[]> {
  if (!isSupabaseConfigured) {
    return getLocalData<EmergencyContact>('contacts').filter(c => c.user_id === userId);
  }
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addContact(userId: string, contact: ContactFormData): Promise<EmergencyContact> {
  const newContact: EmergencyContact = {
    id: uuidv4(),
    user_id: userId,
    ...contact,
    created_at: new Date().toISOString(),
  };
  if (!isSupabaseConfigured) {
    const contacts = getLocalData<EmergencyContact>('contacts');
    if (contact.is_primary) contacts.forEach(c => { if (c.user_id === userId) c.is_primary = false; });
    contacts.push(newContact);
    setLocalData('contacts', contacts);
    return newContact;
  }
  if (contact.is_primary) {
    await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', userId);
  }
  const { data, error } = await supabase.from('emergency_contacts').insert(newContact).select().single();
  if (error) throw error;
  return data;
}

export async function updateContact(contactId: string, updates: Partial<ContactFormData>, userId: string): Promise<EmergencyContact> {
  if (!isSupabaseConfigured) {
    const contacts = getLocalData<EmergencyContact>('contacts');
    if (updates.is_primary) contacts.forEach(c => { if (c.user_id === userId) c.is_primary = false; });
    const idx = contacts.findIndex(c => c.id === contactId);
    if (idx >= 0) contacts[idx] = { ...contacts[idx], ...updates };
    setLocalData('contacts', contacts);
    return contacts[idx];
  }
  if (updates.is_primary) {
    await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', userId);
  }
  const { data, error } = await supabase.from('emergency_contacts').update(updates).eq('id', contactId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteContact(contactId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const contacts = getLocalData<EmergencyContact>('contacts').filter(c => c.id !== contactId);
    setLocalData('contacts', contacts);
    return;
  }
  const { error } = await supabase.from('emergency_contacts').delete().eq('id', contactId);
  if (error) throw error;
}

// ─── Emergencies ───

export async function createEmergency(
  userId: string,
  sessionId: string,
  latitude: number | null,
  longitude: number | null,
  mode: CommunicationMode = 'online',
  riskLevel: RiskLevel = 'medium',
): Promise<Emergency> {
  const emergency: Emergency = {
    id: uuidv4(),
    user_id: userId,
    session_id: sessionId,
    status: 'active',
    risk_level: riskLevel,
    latitude,
    longitude,
    communication_mode: mode,
    created_at: new Date().toISOString(),
    resolved_at: null,
  };
  if (!isSupabaseConfigured) {
    const emergencies = getLocalData<Emergency>('emergencies');
    emergencies.unshift(emergency);
    setLocalData('emergencies', emergencies);
    return emergency;
  }
  const { data, error } = await supabase.from('emergencies').insert(emergency).select().single();
  if (error) throw error;
  return data;
}

export async function getEmergency(emergencyId: string): Promise<Emergency | null> {
  if (!isSupabaseConfigured) {
    return getLocalData<Emergency>('emergencies').find(e => e.id === emergencyId) || null;
  }
  const { data, error } = await supabase.from('emergencies').select('*').eq('id', emergencyId).single();
  if (error) return null;
  return data;
}

export async function getEmergencies(userId: string, status?: EmergencyStatus): Promise<Emergency[]> {
  if (!isSupabaseConfigured) {
    let items = getLocalData<Emergency>('emergencies').filter(e => e.user_id === userId);
    if (status) items = items.filter(e => e.status === status);
    return items;
  }
  let query = supabase.from('emergencies').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getActiveEmergency(userId: string): Promise<Emergency | null> {
  if (!isSupabaseConfigured) {
    return getLocalData<Emergency>('emergencies').find(e => e.user_id === userId && e.status === 'active') || null;
  }
  const { data } = await supabase.from('emergencies').select('*').eq('user_id', userId).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single();
  return data || null;
}

export async function updateEmergency(emergencyId: string, updates: Partial<Emergency>): Promise<Emergency> {
  if (!isSupabaseConfigured) {
    const emergencies = getLocalData<Emergency>('emergencies');
    const idx = emergencies.findIndex(e => e.id === emergencyId);
    if (idx >= 0) emergencies[idx] = { ...emergencies[idx], ...updates };
    setLocalData('emergencies', emergencies);
    return emergencies[idx];
  }
  const { data, error } = await supabase.from('emergencies').update(updates).eq('id', emergencyId).select().single();
  if (error) throw error;
  return data;
}

// ─── Timeline ───

export async function addTimelineEvent(
  emergencyId: string,
  eventType: TimelineEventType,
  description: string,
  deviceId?: string,
): Promise<TimelineEvent> {
  const event: TimelineEvent = {
    id: uuidv4(),
    emergency_id: emergencyId,
    event_type: eventType,
    description,
    device_id: deviceId,
    timestamp: new Date().toISOString(),
  };
  if (!isSupabaseConfigured) {
    const events = getLocalData<TimelineEvent>('timeline');
    events.push(event);
    setLocalData('timeline', events);
    return event;
  }
  const { data, error } = await supabase.from('emergency_timeline').insert(event).select().single();
  if (error) throw error;
  return data;
}

export async function getTimelineEvents(emergencyId: string): Promise<TimelineEvent[]> {
  if (!isSupabaseConfigured) {
    return getLocalData<TimelineEvent>('timeline').filter(e => e.emergency_id === emergencyId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  const { data, error } = await supabase.from('emergency_timeline').select('*').eq('emergency_id', emergencyId).order('timestamp', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ─── Relay Devices ───

export async function upsertRelayDevice(device: Omit<RelayDevice, 'id'>): Promise<RelayDevice> {
  const newDevice: RelayDevice = { id: uuidv4(), ...device };
  if (!isSupabaseConfigured) {
    const devices = getLocalData<RelayDevice>('relay_devices');
    const idx = devices.findIndex(d => d.device_id === device.device_id);
    if (idx >= 0) { devices[idx] = { ...devices[idx], ...device }; setLocalData('relay_devices', devices); return devices[idx]; }
    devices.push(newDevice);
    setLocalData('relay_devices', devices);
    return newDevice;
  }
  const { data, error } = await supabase.from('relay_devices').upsert({ ...newDevice }, { onConflict: 'device_id' }).select().single();
  if (error) throw error;
  return data;
}

export async function getRelayDevices(): Promise<RelayDevice[]> {
  if (!isSupabaseConfigured) {
    return getLocalData<RelayDevice>('relay_devices');
  }
  const { data, error } = await supabase.from('relay_devices').select('*').order('last_seen', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── Relay Events ───

export async function addRelayEvent(event: Omit<RelayEvent, 'id' | 'timestamp'>): Promise<RelayEvent> {
  const newEvent: RelayEvent = { id: uuidv4(), ...event, timestamp: new Date().toISOString() };
  if (!isSupabaseConfigured) {
    const events = getLocalData<RelayEvent>('relay_events');
    events.push(newEvent);
    setLocalData('relay_events', events);
    return newEvent;
  }
  const { data, error } = await supabase.from('relay_events').insert(newEvent).select().single();
  if (error) throw error;
  return data;
}

export async function getRelayEvents(emergencyId: string): Promise<RelayEvent[]> {
  if (!isSupabaseConfigured) {
    return getLocalData<RelayEvent>('relay_events').filter(e => e.emergency_id === emergencyId);
  }
  const { data, error } = await supabase.from('relay_events').select('*').eq('emergency_id', emergencyId).order('timestamp');
  if (error) throw error;
  return data || [];
}

// ─── Notifications ───

export async function createNotification(
  userId: string,
  emergencyId: string,
  type: NotificationType,
  title: string,
  message: string,
  contactId?: string,
): Promise<Notification> {
  const notif: Notification = {
    id: uuidv4(),
    user_id: userId,
    emergency_id: emergencyId,
    contact_id: contactId,
    type,
    title,
    message,
    status: 'pending' as NotificationStatus,
    timestamp: new Date().toISOString(),
  };
  if (!isSupabaseConfigured) {
    const notifs = getLocalData<Notification>('notifications');
    notifs.unshift(notif);
    setLocalData('notifications', notifs);
    return notif;
  }
  const { data, error } = await supabase.from('notifications').insert(notif).select().single();
  if (error) throw error;
  return data;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (!isSupabaseConfigured) {
    return getLocalData<Notification>('notifications').filter(n => n.user_id === userId);
  }
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateNotificationStatus(notifId: string, status: NotificationStatus): Promise<void> {
  if (!isSupabaseConfigured) {
    const notifs = getLocalData<Notification>('notifications');
    const idx = notifs.findIndex(n => n.id === notifId);
    if (idx >= 0) notifs[idx].status = status;
    setLocalData('notifications', notifs);
    return;
  }
  await supabase.from('notifications').update({ status }).eq('id', notifId);
}
