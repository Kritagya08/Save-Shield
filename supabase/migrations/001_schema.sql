-- Save Shield Database Schema
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles (extends Supabase auth.users) ───

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Emergency Contacts ───

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_user ON public.emergency_contacts(user_id);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contacts" ON public.emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

-- ─── Emergencies ───

CREATE TABLE IF NOT EXISTS public.emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'cancelled', 'failed')) DEFAULT 'active',
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  communication_mode TEXT DEFAULT 'online',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_emergencies_user ON public.emergencies(user_id);
CREATE INDEX idx_emergencies_status ON public.emergencies(status);
CREATE INDEX idx_emergencies_session ON public.emergencies(session_id);

ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own emergencies" ON public.emergencies
  FOR ALL USING (auth.uid() = user_id);

-- ─── Emergency Timeline ───

CREATE TABLE IF NOT EXISTS public.emergency_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergencies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  device_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_emergency ON public.emergency_timeline(emergency_id);
CREATE INDEX idx_timeline_timestamp ON public.emergency_timeline(timestamp);

ALTER TABLE public.emergency_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline events" ON public.emergency_timeline
  FOR ALL USING (
    emergency_id IN (SELECT id FROM public.emergencies WHERE user_id = auth.uid())
  );

-- ─── Relay Devices ───

CREATE TABLE IF NOT EXISTS public.relay_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  device_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('online', 'offline', 'relaying')) DEFAULT 'online',
  internet_available BOOLEAN DEFAULT true,
  bluetooth_available BOOLEAN DEFAULT true,
  role TEXT CHECK (role IN ('emergency', 'relay', 'gateway')) DEFAULT 'relay',
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_relay_devices_device ON public.relay_devices(device_id);

ALTER TABLE public.relay_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can manage relay devices" ON public.relay_devices
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ─── Relay Events ───

CREATE TABLE IF NOT EXISTS public.relay_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergencies(id) ON DELETE CASCADE,
  sender_device TEXT NOT NULL,
  receiver_device TEXT NOT NULL,
  hop_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_relay_events_emergency ON public.relay_events(emergency_id);

ALTER TABLE public.relay_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own relay events" ON public.relay_events
  FOR ALL USING (
    emergency_id IN (SELECT id FROM public.emergencies WHERE user_id = auth.uid())
  );

-- ─── Notifications ───

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emergency_id UUID REFERENCES public.emergencies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.emergency_contacts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'confirmed')) DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_emergency ON public.notifications(emergency_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- ─── Enable Realtime ───

ALTER PUBLICATION supabase_realtime ADD TABLE public.emergencies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_timeline;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.relay_events;
