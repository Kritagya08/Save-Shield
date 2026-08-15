import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { upsertProfile } from '../lib/database';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    try {
      if (!isSupabaseConfigured) {
        // Local mode: check localStorage
        const stored = localStorage.getItem('save-shield-auth-user');
        if (stored) {
          const user = JSON.parse(stored) as UserProfile;
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          set({ user: profile, isAuthenticated: true });
        }
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Local demo mode login
        const users = JSON.parse(localStorage.getItem('save-shield-profiles') || '[]') as UserProfile[];
        const user = users.find(u => u.email === email);
        if (!user) throw new Error('Invalid credentials. In local mode, register first.');
        // Check stored password hash
        const passwords = JSON.parse(localStorage.getItem('save-shield-passwords') || '{}');
        if (passwords[email] !== password) throw new Error('Invalid password.');
        localStorage.setItem('save-shield-auth-user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        set({ user: profile, isAuthenticated: true, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Local mode registration
        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();
        const user: UserProfile = { id, name, email, created_at: new Date().toISOString() };
        const users = JSON.parse(localStorage.getItem('save-shield-profiles') || '[]') as UserProfile[];
        if (users.find(u => u.email === email)) throw new Error('Email already registered.');
        users.push(user);
        localStorage.setItem('save-shield-profiles', JSON.stringify(users));
        const passwords = JSON.parse(localStorage.getItem('save-shield-passwords') || '{}');
        passwords[email] = password;
        localStorage.setItem('save-shield-passwords', JSON.stringify(passwords));
        localStorage.setItem('save-shield-auth-user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        const profile = await upsertProfile({ id: data.user.id, name, email });
        set({ user: profile, isAuthenticated: true, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('save-shield-auth-user');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    if (!isSupabaseConfigured) {
      localStorage.setItem('save-shield-auth-user', JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem('save-shield-profiles') || '[]') as UserProfile[];
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = updated;
      localStorage.setItem('save-shield-profiles', JSON.stringify(users));
    } else {
      await upsertProfile(updated);
    }
    set({ user: updated });
  },
}));
