import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  Wifi,
  WifiOff,
  MapPin,
  MapPinOff,
  Bluetooth,
  BluetoothOff,
  Phone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useEmergencyStore } from '../stores/emergencyStore';
import { Card } from '../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { activeEmergency, systemStatus } = useEmergencyStore();
  const isActive = systemStatus.emergencyActive || !!activeEmergency;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsAvailable, setGpsAvailable] = useState<boolean>(false);
  const [bluetoothActive, setBluetoothActive] = useState<boolean>(true); // Mock for now
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check GPS
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsAvailable(true),
        () => setGpsAvailable(false)
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome, {user?.name || 'User'}</h1>
          <p className="text-slate-400">Here is your safety overview.</p>
        </div>
        <Link
          to="/sos"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-red-900/50 transition-all flex items-center gap-2 transform hover:scale-105"
        >
          <ShieldAlert size={24} />
          QUICK SOS
        </Link>
      </div>

      {/* Status Cards Row */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        <Card className="bg-slate-800 border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isOnline ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
              {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
            </div>
            <div>
              <p className="text-sm text-slate-400">System Status</p>
              <p className="font-semibold text-slate-100">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </Card>

        <Card className={`bg-slate-800 border-slate-700 ${isActive ? 'shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-500/50' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Emergency Status</p>
              <p className={`font-semibold ${isActive ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
                {isActive ? '🚨 Emergency Active' : 'No active emergency'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${gpsAvailable ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'}`}>
              {gpsAvailable ? <MapPin size={24} /> : <MapPinOff size={24} />}
            </div>
            <div>
              <p className="text-sm text-slate-400">GPS</p>
              <p className="font-semibold text-slate-100">{gpsAvailable ? 'Available' : 'Unavailable'}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${bluetoothActive ? 'bg-teal-500/20 text-teal-500' : 'bg-slate-600/20 text-slate-500'}`}>
              {bluetoothActive ? <Bluetooth size={24} /> : <BluetoothOff size={24} />}
            </div>
            <div>
              <p className="text-sm text-slate-400">Bluetooth Relay</p>
              <p className="font-semibold text-slate-100">{bluetoothActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Contacts */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Phone className="text-blue-500" size={20} />
                Contacts
              </h2>
              <Link to="/contacts" className="text-sm text-blue-400 hover:text-blue-300">
                Manage
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
              <div className="text-4xl font-bold text-slate-100 mb-2">3</div>
              <p className="text-slate-400 mb-4">Active Emergency Contacts</p>
              <div className="bg-slate-700/50 rounded-lg p-3 w-full text-left">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Primary Contact</p>
                <p className="text-slate-100 font-medium">Mom (⭐)</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Emergencies */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="text-teal-500" size={20} />
                Recent Emergencies
              </h2>
              <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-3 flex-1">
              {[
                { id: 1, date: 'Oct 24, 2026 • 21:45', status: 'Resolved', duration: '15m' },
                { id: 2, date: 'Sep 12, 2026 • 18:30', status: 'False Alarm', duration: '2m' },
              ].map((item) => (
                <div key={item.id} className="bg-slate-700/30 p-3 rounded-lg flex items-center justify-between border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Clock className="text-slate-400" size={18} />
                    <div>
                      <p className="text-slate-200 font-medium">{item.date}</p>
                      <p className="text-xs text-slate-400">Duration: {item.duration}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
              
              <div className="text-center text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700/50">
                System online. Last check: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
