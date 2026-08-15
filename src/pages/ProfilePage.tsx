import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Lock, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore() as any; // Type casting as any to avoid errors if authStore structure is different
  const [name, setName] = useState(user?.name || 'Demo User');
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setShowPasswordForm(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/');
  };

  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const email = user?.email || 'demo@saveshield.app';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-100">Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg transition-colors border border-slate-700"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-100">{name}</h2>
            <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
              <Mail size={14} /> {email}
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Statistics</h3>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Emergencies</span>
              <span className="font-mono text-slate-200">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Active Contacts</span>
              <span className="font-mono text-slate-200">4</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Member Since</span>
              <span className="text-slate-200 flex items-center gap-1">
                <Calendar size={14} /> 2024
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <User className="text-blue-500" size={24} />
              Edit Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed directly.</p>
              </div>
              <div className="pt-4">
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Lock className="text-amber-500" size={24} />
              Security
            </h2>
            
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium">
                    Save Password
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordForm(false)}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
