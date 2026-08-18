import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, Download, Trash2, Shield, Bell, Zap, Info, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { audioAlert } from '../utils/audioAlert';

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('save-shield-settings');
    return saved ? JSON.parse(saved) : {
      countdownDuration: 5,
      maxRelayHops: 10,
      demoMode: false,
      simulationSpeed: 1,
      notifySOS: true,
      notifyRelay: true,
      notifySystem: false
    };
  });

  useEffect(() => {
    localStorage.setItem('save-shield-settings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('save-shield-settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      toast.success('Local data cleared');
      window.location.reload();
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ history: [] }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "emergency_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('History exported');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* SOS Settings */}
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Shield className="text-red-500" size={24} />
              SOS Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Countdown Duration (seconds)</label>
                <input 
                  type="number" 
                  value={settings.countdownDuration}
                  onChange={(e) => handleChange('countdownDuration', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Max Relay Hops</label>
                <input 
                  type="number" 
                  value={settings.maxRelayHops}
                  onChange={(e) => handleChange('maxRelayHops', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Bell className="text-blue-500" size={24} />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Enable SOS Notifications</span>
                <input type="checkbox" checked={settings.notifySOS} onChange={(e) => handleChange('notifySOS', e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded bg-slate-900 border-slate-700" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Enable Relay Notifications</span>
                <input type="checkbox" checked={settings.notifyRelay} onChange={(e) => handleChange('notifyRelay', e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded bg-slate-900 border-slate-700" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Enable System Notifications</span>
                <input type="checkbox" checked={settings.notifySystem} onChange={(e) => handleChange('notifySystem', e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded bg-slate-900 border-slate-700" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Demo Settings */}
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              Demo Settings
            </h2>
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-medium">Demo Mode</span>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.demoMode ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  <input type="checkbox" checked={settings.demoMode} onChange={(e) => handleChange('demoMode', e.target.checked)} className="opacity-0 w-full h-full absolute cursor-pointer z-10" />
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.demoMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </div>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Simulation Speed ({settings.simulationSpeed}x)</label>
                <input 
                  type="range" min="0.5" max="3" step="0.5"
                  value={settings.simulationSpeed}
                  onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Data & About */}
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Info className="text-emerald-500" size={24} />
              Data & About
            </h2>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  audioAlert.playEmergencySiren(2);
                  toast.success('Playing test emergency siren');
                }} 
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors border border-amber-500/30 font-medium"
              >
                <Volume2 size={18} /> Test Audio Emergency Siren
              </button>
              <button onClick={exportData} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600">
                <Download size={18} /> Export Emergency History
              </button>
              <button onClick={clearData} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/30">
                <Trash2 size={18} /> Clear Local Data
              </button>
            </div>

            <div className="pt-4 border-t border-slate-700 text-sm text-slate-400 space-y-1">
              <p>App Version: <span className="text-slate-300 font-mono">1.0.0</span></p>
              <p>Database: <span className="text-slate-300 font-mono">Supabase / Local Storage</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
