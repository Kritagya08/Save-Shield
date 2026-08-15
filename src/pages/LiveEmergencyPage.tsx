import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Wifi,
  WifiOff,
  MapPin,
  Bluetooth,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { useEmergencyStore } from '../stores/emergencyStore';
import { useAuthStore } from '../stores/authStore';
// Mocking network store import since it might be requested or implemented elsewhere
// import { useNetworkStore } from '../stores/networkStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { TimelineEvent } from '../types';

// Mocking useNetworkStore for the sake of the requirements
const useNetworkStore = () => ({
  isOnline: navigator.onLine,
  relayStatus: 'active',
  nearbyDevices: 3,
});

export const LiveEmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeEmergency, cancelEmergency, resolveEmergency, timeline = [] } = useEmergencyStore();
  const { user } = useAuthStore();
  const { isOnline, relayStatus, nearbyDevices } = useNetworkStore();

  const isActive = !!activeEmergency;

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock timeline events if the store doesn't provide them yet
  const events: TimelineEvent[] = timeline.length > 0 ? timeline : [
    { id: '1', emergency_id: 'demo', event_type: 'sos_activated', description: 'SOS Activated', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: '2', emergency_id: 'demo', event_type: 'gps_captured', description: 'Location acquired', timestamp: new Date(Date.now() - 4 * 60000).toISOString() },
    { id: '3', emergency_id: 'demo', event_type: 'contact_notified', description: 'Notified 3 emergency contacts', timestamp: new Date(Date.now() - 3 * 60000).toISOString() },
    { id: '4', emergency_id: 'demo', event_type: 'relay_activated', description: 'Bluetooth relay mesh active (3 nodes)', timestamp: new Date(Date.now() - 1 * 60000).toISOString() },
  ];

  useEffect(() => {
    if (!isActive) return;

    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLastUpdate(new Date());
        },
        (error) => console.error("Error watching position", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isActive]);

  const handleResolve = async () => {
    if (activeEmergency) {
      await resolveEmergency(activeEmergency.id);
    }
    navigate('/dashboard');
  };

  const handleCancel = async () => {
    if (activeEmergency) {
      await cancelEmergency(activeEmergency.id);
    }
    navigate('/dashboard');
  };

  if (!isActive) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <ShieldAlert size={48} className="text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100">No Active Emergency</h2>
        <p className="text-slate-400 max-w-md">
          Your status is secure. If you need immediate assistance, please visit the SOS Center.
        </p>
        <Link to="/sos">
          <Button className="bg-blue-600 hover:bg-blue-700">Go to SOS Center</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Emergency Banner */}
      <motion.div 
        animate={{ opacity: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-full bg-red-600/20 border-2 border-red-500 rounded-xl p-4 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
      >
        <AlertTriangle size={32} className="text-red-500" />
        <h1 className="text-2xl md:text-3xl font-black text-red-500 tracking-wider">
          EMERGENCY ACTIVE
        </h1>
        <AlertTriangle size={32} className="text-red-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> Status Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm">Risk Level</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold uppercase">
                  Critical
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                  Network
                </span>
                <span className={`text-sm font-medium ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Bluetooth size={16} /> Relay
                </span>
                <span className="text-sm font-medium text-teal-500">
                  {relayStatus === 'active' ? 'Active' : 'Scanning...'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Users size={16} /> Nearby Devices
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {nearbyDevices}
                </span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="bg-slate-800 border-slate-700">
            <div className="space-y-3">
              <Button 
                onClick={handleResolve}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 text-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                Mark as Resolved
              </Button>
              <Button 
                onClick={handleCancel}
                variant="secondary"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white py-4 font-bold flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Cancel False Alarm
              </Button>
            </div>
          </Card>
        </div>

        {/* Middle Column: Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-800 border-slate-700 h-96 flex flex-col p-0 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" /> Live Tracking
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            
            {/* Map Placeholder */}
            <div className="flex-1 bg-slate-900 flex items-center justify-center border-4 border-slate-800">
              <div className="text-center">
                <MapPin size={48} className="text-blue-500/50 mx-auto mb-2 animate-bounce" />
                <p className="text-slate-500 font-mono">
                  {location 
                    ? `Map Placeholder\n[Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}]` 
                    : 'Acquiring GPS Signal...'}
                </p>
              </div>
            </div>
          </Card>

          {/* Bottom Grid: Timeline & Relay Path */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <Card className="bg-slate-800 border-slate-700">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" /> Event Timeline
              </h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {events.map((event, i) => {
                  const isCritical = event.event_type === 'sos_activated' || event.event_type === 'risk_updated';
                  const isSuccess = event.event_type === 'sos_resolved' || event.event_type === 'contact_notified';
                  const timeString = new Date(event.timestamp).toLocaleTimeString();

                  return (
                    <div key={event.id || i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          isCritical ? 'bg-red-500' : 
                          isSuccess ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        {i !== events.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs text-slate-500 mb-1">{timeString}</p>
                        <p className="text-sm text-slate-200">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Relay Path */}
            <Card className="bg-slate-800 border-slate-700">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Bluetooth size={20} className="text-teal-500" /> Relay Network Path
              </h3>
              <div className="space-y-2 py-2">
                {/* Visualizing connected nodes */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2 w-full text-center">
                    <p className="text-sm text-blue-400 font-medium">Your Device</p>
                  </div>
                  
                  <div className="w-0.5 h-6 bg-slate-600 animate-pulse my-1"></div>
                  
                  <div className="bg-slate-700 border border-slate-600 rounded-lg p-2 w-3/4 text-center">
                    <p className="text-xs text-slate-300">Relay Node #1 (15m)</p>
                  </div>
                  
                  <div className="w-0.5 h-6 bg-slate-600 animate-pulse my-1"></div>
                  
                  <div className="bg-slate-700 border border-slate-600 rounded-lg p-2 w-3/4 text-center">
                    <p className="text-xs text-slate-300">Relay Node #2 (45m)</p>
                  </div>
                  
                  <div className="w-0.5 h-6 bg-slate-600 animate-pulse my-1"></div>
                  
                  <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-2 w-full text-center">
                    <p className="text-sm text-emerald-400 font-medium flex items-center justify-center gap-2">
                      <Wifi size={14} /> Internet Gateway
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEmergencyPage;
