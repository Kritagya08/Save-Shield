import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Wifi, WifiOff, Bluetooth, Clock, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock types
interface RelayDevice {
  id: string;
  device_id: string;
  device_name: string;
  status: 'online' | 'offline' | 'relaying';
  has_internet: boolean;
  has_bluetooth: boolean;
  role: 'emergency' | 'relay' | 'gateway';
  last_seen: string;
}

// Mock function
const getRelayDevices = async (): Promise<RelayDevice[]> => {
  return [
    {
      id: '1',
      device_id: 'dev_a1b2c3d4',
      device_name: 'Sarah\'s iPhone',
      status: 'relaying',
      has_internet: false,
      has_bluetooth: true,
      role: 'emergency',
      last_seen: new Date(Date.now() - 1000 * 60).toISOString(),
    },
    {
      id: '2',
      device_id: 'dev_e5f6g7h8',
      device_name: 'John\'s Pixel',
      status: 'online',
      has_internet: false,
      has_bluetooth: true,
      role: 'relay',
      last_seen: new Date(Date.now() - 1000 * 30).toISOString(),
    },
    {
      id: '3',
      device_id: 'dev_i9j0k1l2',
      device_name: 'Cafe WiFi Gateway',
      status: 'online',
      has_internet: true,
      has_bluetooth: true,
      role: 'gateway',
      last_seen: new Date(Date.now() - 1000 * 10).toISOString(),
    }
  ];
};

export const DeviceNetworkPage: React.FC = () => {
  const [devices, setDevices] = useState<RelayDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getRelayDevices();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const getRoleBadge = (role: RelayDevice['role']) => {
    switch (role) {
      case 'emergency':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">Emergency</span>;
      case 'relay':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">Relay</span>;
      case 'gateway':
        return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-medium">Gateway</span>;
    }
  };

  const getStatusBadge = (status: RelayDevice['status']) => {
    switch (status) {
      case 'online':
        return <span className="flex items-center gap-1 text-emerald-400 text-xs"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Online</span>;
      case 'offline':
        return <span className="flex items-center gap-1 text-slate-400 text-xs"><div className="w-2 h-2 bg-slate-500 rounded-full"></div> Offline</span>;
      case 'relaying':
        return <span className="flex items-center gap-1 text-amber-400 text-xs"><Activity className="w-3 h-3" /> Relaying</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-500" />
            Device Network
          </h1>
          <p className="text-slate-400">Manage and monitor active mesh devices</p>
        </div>
        <Link to="/demo" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add Simulated Device
        </Link>
      </div>

      {/* Role Legend */}
      <div className="flex gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm text-slate-300">Emergency Source</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-sm text-slate-300">Relay Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-sm text-slate-300">Internet Gateway</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="text-center bg-slate-800 rounded-xl p-12 border border-slate-700">
          <Smartphone className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No Devices Active</h3>
          <p className="text-slate-400 mb-4">There are currently no devices active in the mesh network.</p>
          <Link to="/demo" className="text-blue-400 hover:text-blue-300">Go to Demo to add one</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map(device => (
            <div key={device.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg">
                    <Smartphone className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-100">{device.device_name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{device.device_id.substring(0, 10)}...</p>
                  </div>
                </div>
                {getRoleBadge(device.role)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-900/50 p-3 rounded-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Connection</span>
                  <div className="flex items-center gap-2">
                    {device.has_bluetooth ? <Bluetooth className="w-4 h-4 text-blue-400" /> : <Bluetooth className="w-4 h-4 text-slate-600" />}
                    {device.has_internet ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-slate-600" />}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Status</span>
                  {getStatusBadge(device.status)}
                </div>
              </div>

              <div className="flex items-center text-xs text-slate-500 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                Last seen {formatDistanceToNow(new Date(device.last_seen))} ago
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceNetworkPage;
