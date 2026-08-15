import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Bluetooth, Wifi, Server, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const RelayNetworkPage: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bluetooth className="w-6 h-6 text-blue-500" />
            Bluetooth Relay Network
          </h1>
          <p className="text-slate-400">Real-time visualization of mesh networking</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-sm font-medium">
          DEMO / SIMULATION
        </div>
        <Link 
          to="/demo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Start Demo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-8 border border-slate-700 relative min-h-[500px] flex flex-col items-center justify-between">
          
          {/* Phone A (SOS SOURCE) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-red-500/20 p-4 rounded-full mb-2">
              <Smartphone className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-100">PHONE A</div>
              <div className="text-xs text-slate-400">🚨 SOS SOURCE</div>
              <div className="flex items-center gap-1 justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-300">Online</span>
              </div>
            </div>
          </div>

          {/* Connection Line 1 */}
          <div className="flex-1 w-full flex justify-center relative my-4">
            <div className="w-0.5 h-full border-l-2 border-dashed border-blue-500/50 absolute top-0 bottom-0"></div>
            {isSimulating && (
              <motion.div 
                className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="absolute top-1/2 -translate-y-1/2 bg-slate-800 px-2 flex items-center gap-1 text-xs text-blue-400 border border-slate-700 rounded-full">
              <Bluetooth className="w-3 h-3" />
              BLE
            </div>
          </div>

          {/* Phone B (RELAY NODE) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-blue-500/20 p-4 rounded-full mb-2">
              <Smartphone className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-100">PHONE B</div>
              <div className="text-xs text-slate-400">🔄 RELAY NODE</div>
              <div className="flex items-center gap-1 justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-300">Online</span>
              </div>
            </div>
          </div>

          {/* Connection Line 2 */}
          <div className="flex-1 w-full flex justify-center relative my-4">
            <div className="w-0.5 h-full border-l-2 border-dashed border-teal-500/50 absolute top-0 bottom-0"></div>
            {isSimulating && (
              <motion.div 
                className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, delay: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="absolute top-1/2 -translate-y-1/2 bg-slate-800 px-2 flex items-center gap-1 text-xs text-teal-400 border border-slate-700 rounded-full">
              <Bluetooth className="w-3 h-3" />
              BLE
            </div>
          </div>

          {/* Phone C (INTERNET GATEWAY) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-teal-500/20 p-4 rounded-full mb-2">
              <Wifi className="w-8 h-8 text-teal-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-100">PHONE C</div>
              <div className="text-xs text-slate-400">🌐 INTERNET GATEWAY</div>
              <div className="flex items-center gap-1 justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-300">Online</span>
              </div>
            </div>
          </div>

          {/* Connection Line 3 */}
          <div className="flex-1 w-full flex justify-center relative my-4">
            <div className="w-0.5 h-full border-l-2 border-solid border-indigo-500/50 absolute top-0 bottom-0"></div>
            {isSimulating && (
              <motion.div 
                className="absolute w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.5, delay: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <div className="absolute top-1/2 -translate-y-1/2 bg-slate-800 px-2 flex items-center gap-1 text-xs text-indigo-400 border border-slate-700 rounded-full">
              <Activity className="w-3 h-3" />
              Internet
            </div>
          </div>

          {/* BACKEND */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-indigo-500/20 p-4 rounded-full mb-2">
              <Server className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-100">SAVE SHIELD BACKEND</div>
            </div>
          </div>

        </div>

        {/* SOS Packet Details */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-2">SOS Packet Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Session ID</span>
              <span className="text-slate-100 font-mono">pkg_9f8e7d...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Sender</span>
              <span className="text-slate-100">PHONE A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Timestamp</span>
              <span className="text-slate-100 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Location</span>
              <span className="text-slate-100">28.6139, 77.2090</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Risk Level</span>
              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold">CRITICAL</span>
            </div>
            
            <div className="pt-3 border-t border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Hop Count</span>
                <span className="text-slate-100">2 / 5 (Max)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Delivered
              </span>
            </div>

            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Visited Devices</span>
              <div className="flex gap-2">
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">dev_a1</span>
                <span className="text-slate-500">→</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">dev_b2</span>
                <span className="text-slate-500">→</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">dev_c3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelayNetworkPage;
