import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, Radio, Server, Activity, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export const TimelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      const baseTime = Date.now() - 1000 * 60 * 30; // 30 mins ago
      setEvents([
        { id: '1', time: new Date(baseTime).toISOString(), type: 'system', desc: 'App started in background mode', device_id: 'local_dev' },
        { id: '2', time: new Date(baseTime + 1000 * 60 * 5).toISOString(), type: 'sos', desc: 'SOS Triggered manually by user', device_id: 'local_dev' },
        { id: '3', time: new Date(baseTime + 1000 * 60 * 5 + 2000).toISOString(), type: 'system', desc: 'No internet detected, switching to Relay Mode', device_id: 'local_dev' },
        { id: '4', time: new Date(baseTime + 1000 * 60 * 5 + 5000).toISOString(), type: 'relay', desc: 'Broadcasting emergency packet over BLE', device_id: 'local_dev' },
        { id: '5', time: new Date(baseTime + 1000 * 60 * 6).toISOString(), type: 'relay', desc: 'Packet received and relayed', device_id: 'dev_a1b2c3d4' },
        { id: '6', time: new Date(baseTime + 1000 * 60 * 7).toISOString(), type: 'gateway', desc: 'Packet reached internet gateway', device_id: 'dev_i9j0k1l2' },
        { id: '7', time: new Date(baseTime + 1000 * 60 * 7 + 1000).toISOString(), type: 'system', desc: 'Emergency logged on Save Shield Backend', device_id: 'server' },
        { id: '8', time: new Date(baseTime + 1000 * 60 * 7 + 2000).toISOString(), type: 'system', desc: 'Emergency contacts notified via SMS', device_id: 'server' },
      ].reverse());
      setLoading(false);
    }, 500);
  }, [id]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sos': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'relay': return <Radio className="w-5 h-5 text-blue-500" />;
      case 'gateway': return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'system': return <Server className="w-5 h-5 text-slate-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'sos': return 'bg-red-500/10 border-red-500/30';
      case 'relay': return 'bg-blue-500/10 border-blue-500/30';
      case 'gateway': return 'bg-emerald-500/10 border-emerald-500/30';
      case 'system': return 'bg-slate-700/30 border-slate-700';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading timeline...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link to={`/emergency/${id}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Emergency Details
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" />
            Emergency Timeline
          </h1>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-700 ml-4 md:ml-32 py-4">
        {events.map((event, index) => (
          <div key={event.id} className="mb-8 relative flex items-start group">
            {/* Timestamp (Left on desktop) */}
            <div className="hidden md:block absolute -left-36 w-28 text-right pr-4 pt-1">
              <div className="text-sm font-bold text-slate-200">{format(new Date(event.time), 'HH:mm:ss')}</div>
              <div className="text-xs text-slate-500">{format(new Date(event.time), 'MMM dd')}</div>
            </div>

            {/* Connecting Node */}
            <div className="absolute -left-[11px] bg-slate-900 border-2 border-slate-700 rounded-full p-1 group-hover:border-indigo-500 transition-colors">
              {getEventIcon(event.type)}
            </div>

            {/* Event Content */}
            <div className="ml-8 md:ml-12 w-full pr-4">
              {/* Mobile Timestamp */}
              <div className="md:hidden flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-xs font-bold text-slate-300">{format(new Date(event.time), 'HH:mm:ss')}</span>
              </div>
              
              <div className={`p-4 rounded-xl border ${getEventColor(event.type)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-200 capitalize flex items-center gap-2">
                    {event.type} Event
                  </div>
                  {event.device_id && (
                    <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                      {event.device_id}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm">{event.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelinePage;
