import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Radio, Server, Activity, ShieldAlert, Zap, WifiOff, Bluetooth, Plus, Trash2, StopCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// Assuming simulationStore exists, otherwise falling back to local state
// import { useSimulationStore } from '../stores/simulationStore';

export default function DemoPage() {
  // Using local state to represent the simulation if store is not available
  const { user } = useAuthStore() as any;
  const [isRunning, setIsRunning] = useState(false);
  const [devices, setDevices] = useState([
    { id: 'a', name: 'Phone A', role: 'Emergency', internet: false, bluetooth: true },
    { id: 'b', name: 'Phone B', role: 'Relay', internet: false, bluetooth: true },
    { id: 'c', name: 'Phone C', role: 'Gateway', internet: true, bluetooth: true },
  ]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [riskLevel, setRiskLevel] = useState('HIGH');
  const [packetData, setPacketData] = useState<any>(null);

  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const addEvent = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setEvents(prev => [...prev, { id: Date.now(), time: new Date(), text, type }]);
  };

  const startSimulation = async () => {
    setIsRunning(true);
    setEvents([]);
    setPacketData({ session_id: 'SOS-' + Math.random().toString(36).substring(2, 8).toUpperCase(), hop_count: 0, status: 'Initiating', visited: [] });
    
    addEvent('User activated SOS', 'error');
    setActiveNode('a');
    await new Promise(r => setTimeout(r, 1000));

    setPacketData((prev: any) => ({ ...prev, visited: ['Phone A'], status: 'Searching for peers' }));
    addEvent('Phone A has no internet. Searching for Bluetooth peers...', 'warning');
    await new Promise(r => setTimeout(r, 1500));

    if (devices[1].bluetooth) {
      setActiveNode('b');
      setPacketData((prev: any) => ({ ...prev, hop_count: 1, visited: ['Phone A', 'Phone B'], status: 'Relaying' }));
      addEvent('Connected to Phone B via BLE. Relaying packet...', 'info');
      await new Promise(r => setTimeout(r, 1500));

      if (devices[2].bluetooth) {
        setActiveNode('c');
        setPacketData((prev: any) => ({ ...prev, hop_count: 2, visited: ['Phone A', 'Phone B', 'Phone C'], status: 'Gateway Reached' }));
        addEvent('Connected to Phone C. Phone C has internet.', 'success');
        await new Promise(r => setTimeout(r, 1500));

        setActiveNode('server');
        setPacketData((prev: any) => ({ ...prev, status: 'Delivered to Backend' }));
        addEvent('Packet delivered to Save Shield Backend successfully!', 'success');
      } else {
        addEvent('Simulation failed: Phone C bluetooth is off.', 'error');
      }
    } else {
      addEvent('Simulation failed: Phone B bluetooth is off.', 'error');
    }

    setIsRunning(false);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setActiveNode(null);
    addEvent('Simulation stopped by user', 'warning');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveNode(null);
    setEvents([]);
    setPacketData(null);
  };

  const toggleDeviceProp = (id: string, prop: 'internet' | 'bluetooth') => {
    setDevices(devices.map(d => d.id === id ? { ...d, [prop]: !d[prop] } : d));
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'Emergency': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'Gateway': return 'bg-teal-500/20 text-teal-500 border-teal-500/50';
      default: return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-amber-500 text-amber-950 font-bold p-3 rounded-lg text-center uppercase tracking-widest flex items-center justify-center gap-2">
        <Zap size={20} />
        Demo / Simulation Mode
        <Zap size={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device, i) => (
          <div key={device.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Smartphone className="text-slate-400" />
                <h3 className="font-semibold text-slate-200">{device.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${getRoleBadge(device.role)}`}>{device.role}</span>
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="flex justify-between items-center cursor-pointer">
                <span className="text-sm text-slate-300 flex items-center gap-2"><WifiOff size={16} /> Internet</span>
                <input type="checkbox" checked={device.internet} onChange={() => toggleDeviceProp(device.id, 'internet')} className="form-checkbox text-blue-500 bg-slate-900 border-slate-700 rounded" />
              </label>
              <label className="flex justify-between items-center cursor-pointer">
                <span className="text-sm text-slate-300 flex items-center gap-2"><Bluetooth size={16} /> Bluetooth</span>
                <input type="checkbox" checked={device.bluetooth} onChange={() => toggleDeviceProp(device.id, 'bluetooth')} className="form-checkbox text-blue-500 bg-slate-900 border-slate-700 rounded" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-xl">
        <div className="flex gap-3">
          {!isRunning ? (
            <button onClick={startSimulation} className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors animate-pulse">
              <ShieldAlert size={20} />
              SIMULATE SOS
            </button>
          ) : (
            <button onClick={stopSimulation} className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors">
              <StopCircle size={20} />
              Stop Simulation
            </button>
          )}
          <button onClick={resetSimulation} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg transition-colors">
            <RefreshCw size={18} />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">Risk Level:</span>
          <select 
            value={riskLevel} 
            onChange={e => setRiskLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-slate-500 text-sm font-medium uppercase tracking-wider">Network Visualization</div>
          
          <div className="flex flex-col items-center gap-12 relative z-10 w-full max-w-md">
            {['a', 'b', 'c', 'server'].map((id, index) => {
              const isActive = activeNode === id;
              const isServer = id === 'server';
              const Icon = isServer ? Server : Smartphone;
              
              return (
                <React.Fragment key={id}>
                  <div className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-500 ${isActive ? (isServer ? 'border-teal-500 bg-teal-500/20 scale-110 shadow-[0_0_30px_rgba(20,184,166,0.3)]' : 'border-blue-500 bg-blue-500/20 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]') : 'border-slate-700 bg-slate-800'}`}>
                    <Icon size={32} className={isActive ? (isServer ? 'text-teal-400' : 'text-blue-400') : 'text-slate-500'} />
                    <span className="mt-2 text-sm font-medium text-slate-300">
                      {isServer ? 'Save Shield Backend' : devices[index].name}
                    </span>
                  </div>

                  {index < 3 && (
                    <div className="h-12 w-1 border-l-2 border-dashed border-slate-700 relative">
                      {isRunning && activeNode === ['a', 'b', 'c'][index] && (
                        <motion.div 
                          className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                          animate={{ top: ['0%', '100%'] }}
                          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col h-[400px]">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Activity size={18} className="text-blue-500" /> Live Timeline
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {events.length === 0 ? (
              <div className="text-slate-500 text-sm text-center mt-10">Simulation not started</div>
            ) : (
              events.map((ev, i) => (
                <div key={ev.id} className="text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">{ev.time.toLocaleTimeString()}</div>
                  <div className={`font-medium ${ev.type === 'error' ? 'text-red-400' : ev.type === 'success' ? 'text-teal-400' : ev.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {ev.text}
                  </div>
                </div>
              ))
            )}
            <div ref={eventsEndRef} />
          </div>
        </div>
      </div>

      {packetData && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-6 items-center">
          <div className="text-slate-400 text-sm">SOS Packet Status:</div>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
              <span className="text-slate-500 mr-2">ID:</span>
              <span className="text-blue-400 font-mono">{packetData.session_id}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
              <span className="text-slate-500 mr-2">Hops:</span>
              <span className="text-amber-400 font-mono">{packetData.hop_count}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
              <span className="text-slate-500 mr-2">Status:</span>
              <span className="text-emerald-400 font-medium">{packetData.status}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
              <span className="text-slate-500 mr-2">Route:</span>
              <span className="text-slate-300">{packetData.visited.join(' → ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
