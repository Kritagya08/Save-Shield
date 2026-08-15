import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Bluetooth, Wifi, Server, Database, Lock, AlertTriangle, Info, MapPin } from 'lucide-react';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Shield className="w-16 h-16 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-100">About Save Shield</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A resilient emergency safety network designed to keep you connected when traditional communication channels fail.
          </p>
        </div>

        {/* Mission Statement */}
        <motion.section 
          initial="hidden" animate="visible" variants={containerVariants}
          className="bg-surface-900 border border-surface-800 rounded-2xl p-8"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-3 text-teal-400" />
            Our Mission
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-300 leading-relaxed">
            In critical situations, every second counts. Traditional safety applications rely heavily on continuous internet connectivity, failing exactly when emergencies occur—during natural disasters, in remote areas, or in network dead zones. 
            Save Shield bridges this gap by utilizing intelligent risk assessment and decentralized peer-to-peer Bluetooth networking to ensure your call for help is heard, no matter the circumstances.
          </motion.p>
        </motion.section>

        {/* Architecture Diagram Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 px-2">How It Works</h2>
          
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              {/* User Node */}
              <div className="flex flex-col items-center space-y-3 w-32">
                <div className="w-16 h-16 bg-blue-900/50 border border-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-300 text-center">User in Danger</span>
                <span className="text-xs text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded-full">Offline</span>
              </div>

              {/* Bluetooth Link */}
              <div className="flex-1 flex flex-col items-center justify-center min-w-[100px]">
                <Bluetooth className="w-6 h-6 text-indigo-400 mb-2" />
                <div className="w-full h-1 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-teal-500/50 rounded-full relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full w-1/4 bg-white/50 rounded-full blur-sm"
                    animate={{ left: ['0%', '75%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
                <span className="text-xs text-slate-500 mt-2 text-center">BLE Mesh Relay</span>
              </div>

              {/* Gateway Node */}
              <div className="flex flex-col items-center space-y-3 w-32">
                <div className="w-16 h-16 bg-teal-900/50 border border-teal-500 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Smartphone className="w-8 h-8 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-slate-300 text-center">Gateway Device</span>
                <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full">Online</span>
              </div>

              {/* Internet Link */}
              <div className="flex-1 flex flex-col items-center justify-center min-w-[100px] hidden md:flex">
                <Wifi className="w-6 h-6 text-green-400 mb-2" />
                <div className="w-full h-1 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-full relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full w-1/4 bg-white/50 rounded-full blur-sm"
                    animate={{ left: ['0%', '75%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Server */}
              <div className="flex flex-col items-center space-y-3 w-32 hidden md:flex">
                <div className="w-16 h-16 bg-surface-800 border border-surface-600 rounded-2xl flex items-center justify-center">
                  <Server className="w-8 h-8 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-300 text-center">Save Shield Cloud</span>
              </div>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-6 pt-8 border-t border-surface-800">
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-200 flex items-center"><Bluetooth className="w-4 h-4 mr-2 text-indigo-400" /> Relay System</h3>
                <p className="text-sm text-slate-400">When offline, your device broadcasts encrypted distress payloads. Nearby devices running Save Shield catch these broadcasts and relay them further until they hit a device with internet access.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-200 flex items-center"><MapPin className="w-4 h-4 mr-2 text-teal-400" /> Location Tracking</h3>
                <p className="text-sm text-slate-400">Your GPS coordinates are securely embedded in the payload, ensuring emergency contacts know your exact position when the SOS finally reaches the cloud.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 px-2">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Frontend', value: 'React + TypeScript' },
              { label: 'Styling', value: 'Tailwind CSS' },
              { label: 'State Mgmt', value: 'Zustand' },
              { label: 'Backend', value: 'Supabase' },
              { label: 'Maps', value: 'React Leaflet' },
              { label: 'Animations', value: 'Framer Motion' },
              { label: 'Offline DB', value: 'IndexedDB' },
              { label: 'Networking', value: 'Web Bluetooth API' },
            ].map((tech, i) => (
              <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl p-4 flex flex-col justify-center items-center text-center hover:bg-surface-800 transition-colors">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{tech.label}</span>
                <span className="text-sm font-semibold text-slate-200">{tech.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Limitations */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-400" />
              Security Measures
            </h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div>
                <span>End-to-end encryption for all distress payloads.</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div>
                <span>Relay nodes cannot read the contents of the messages they pass along.</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div>
                <span>Location data is only shared with explicitly trusted emergency contacts.</span>
              </li>
            </ul>
          </section>

          <section className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-amber-500 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Current Limitations
            </h2>
            <ul className="space-y-3 text-sm text-amber-200/70">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div>
                <span><strong>Web Bluetooth Limits:</strong> Standard mobile browsers severely restrict background Bluetooth operations. For full background relay support, a native mobile app is required.</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div>
                <span><strong>Relay Density:</strong> The mesh network requires a sufficient density of users in an area to form a reliable path to an internet-connected gateway.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-surface-800 text-center">
          <p className="text-slate-500 text-sm">Save Shield v1.0.0 &bull; Designed for resilience</p>
        </div>
      </div>
  );
}
