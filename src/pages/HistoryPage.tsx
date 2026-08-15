import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Clock, MapPin, Radio, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock Emergency type and fallback data if store doesn't exist
interface Emergency {
  id: string;
  session_id: string;
  status: 'active' | 'resolved' | 'cancelled' | 'failed';
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
  location?: { lat: number; lon: number };
  communication_mode: 'internet' | 'relay';
  duration_minutes?: number;
}

const mockEmergencies: Emergency[] = [
  {
    id: 'e1',
    session_id: 'pkg_9f8e7d',
    status: 'active',
    risk_level: 'critical',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: { lat: 28.6139, lon: 77.2090 },
    communication_mode: 'relay',
    duration_minutes: 5
  },
  {
    id: 'e2',
    session_id: 'pkg_1a2b3c',
    status: 'resolved',
    risk_level: 'high',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    location: { lat: 19.0760, lon: 72.8777 },
    communication_mode: 'internet',
    duration_minutes: 45
  },
  {
    id: 'e3',
    session_id: 'pkg_4d5e6f',
    status: 'cancelled',
    risk_level: 'medium',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: { lat: 12.9716, lon: 77.5946 },
    communication_mode: 'relay',
    duration_minutes: 2
  }
];

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  // We'll use local state for this example to ensure it works even without the exact store structure.
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'cancelled' | 'failed'>('all');

  useEffect(() => {
    // Attempting to simulate loading from store
    const fetchEmergencies = async () => {
      setLoading(true);
      try {
        // Simulating network delay
        setTimeout(() => {
          setEmergencies(mockEmergencies);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, []);

  const filteredEmergencies = emergencies.filter(e => filter === 'all' || e.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-bold border border-red-500/20">ACTIVE</span>;
      case 'resolved':
        return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-bold border border-emerald-500/20">RESOLVED</span>;
      case 'cancelled':
        return <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded-full text-xs font-bold border border-slate-500/20">CANCELLED</span>;
      case 'failed':
        return <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs font-bold border border-amber-500/20">FAILED</span>;
      default:
        return null;
    }
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-amber-500 text-white',
      medium: 'bg-blue-500 text-white',
      low: 'bg-emerald-500 text-white',
    };
    return (
      <span className={`${colors[level as keyof typeof colors] || 'bg-slate-500 text-white'} px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider`}>
        {level}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" />
            Emergency History
          </h1>
          <p className="text-slate-400">View and analyze past and active emergencies</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {['all', 'active', 'resolved', 'cancelled', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading emergencies...</div>
      ) : filteredEmergencies.length === 0 ? (
        <div className="text-center bg-slate-800 rounded-xl p-12 border border-slate-700">
          <Filter className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No Records Found</h3>
          <p className="text-slate-400">There are no emergencies matching the "{filter}" filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmergencies.map(emergency => (
            <div 
              key={emergency.id} 
              onClick={() => navigate(`/emergency/${emergency.id}`)}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(emergency.status)}
                    {getRiskBadge(emergency.risk_level)}
                  </div>
                  <span className="text-sm font-mono text-slate-300">{emergency.session_id}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{new Date(emergency.created_at).toLocaleString()} ({formatDistanceToNow(new Date(emergency.created_at))} ago)</span>
                </div>
                
                {emergency.location && (
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{emergency.location.lat.toFixed(4)}, {emergency.location.lon.toFixed(4)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Radio className="w-4 h-4 text-slate-500" />
                  <span className="capitalize">{emergency.communication_mode} Mode</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center group-hover:border-indigo-500/30 transition-colors">
                <span className="text-xs text-slate-500">
                  Duration: {emergency.duration_minutes ? `${emergency.duration_minutes} mins` : 'Ongoing'}
                </span>
                <span className="text-indigo-400 text-sm font-medium group-hover:text-indigo-300">
                  View Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
