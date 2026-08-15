import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Wifi, WifiOff, MapPin, MapPinOff } from 'lucide-react';
import { useEmergencyStore } from '../stores/emergencyStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export const SOSCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { activateSOS } = useEmergencyStore();
  const { user } = useAuthStore();
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [hasContacts, setHasContacts] = useState(true); // Mock logic for contacts check

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      handleTriggerSOS();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleTriggerSOS = () => {
    setCountdown(null);
    activateSOS(user?.id || 'demo-user');
    toast.success('SOS Activated! Notifying contacts...');
    navigate('/emergency/live');
  };

  const startCountdown = () => {
    if (!hasContacts) {
      toast.error('Please add emergency contacts first!');
      return;
    }
    setCountdown(5);
  };

  const cancelSOS = () => {
    setCountdown(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative">
      <AnimatePresence>
        {countdown !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-md"
          >
            <motion.h2 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-12 text-center px-4"
            >
              ACTIVATING SOS IN
            </motion.h2>
            
            <motion.div 
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-9xl font-black text-red-500 mb-16 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
            >
              {countdown}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelSOS}
              className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 rounded-full text-xl font-bold tracking-widest transition-colors"
            >
              CANCEL
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-8 flex flex-col items-center">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">SOS Center</h1>
          <p className="text-slate-400">Press the button below in case of an emergency.</p>
        </div>

        {!hasContacts && (
          <div className="w-full max-w-md bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3 text-amber-400">
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm">
              <span className="font-semibold block mb-1">Warning: No Contacts Setup</span>
              Add emergency contacts to ensure someone is notified when you activate SOS.
            </p>
          </div>
        )}

        <motion.div className="relative my-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-red-600 rounded-full blur-2xl"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCountdown}
            className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-b from-red-500 to-red-700 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.6)] flex flex-col items-center justify-center border-4 border-red-400/50 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
            <ShieldAlert size={80} className="text-white mb-4 drop-shadow-md" />
            <span className="text-3xl font-black text-white tracking-wider drop-shadow-md">
              ACTIVATE
              <br />
              SOS
            </span>
          </motion.button>
        </motion.div>

        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50 text-center py-4">
            <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
            </div>
            <p className="text-sm font-medium text-slate-300">
              {isOnline ? 'Online SOS Ready' : 'Offline SOS (Relay Mode)'}
            </p>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center py-4">
            <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${gpsAvailable ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {gpsAvailable ? <MapPin size={20} /> : <MapPinOff size={20} />}
            </div>
            <p className="text-sm font-medium text-slate-300">
              {gpsAvailable ? 'GPS Tracking Active' : 'GPS Unavailable'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SOSCenterPage;
