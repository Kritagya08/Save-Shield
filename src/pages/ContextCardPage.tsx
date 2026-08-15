import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldAlert, MapPin, Radio, Smartphone, 
  Activity, Users, Clock, AlertTriangle, CheckCircle 
} from 'lucide-react';

export const ContextCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      setData({
        id,
        session_id: 'pkg_9f8e7d',
        status: 'active',
        risk_level: 'critical',
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        location: { lat: 28.6139, lon: 77.2090, accuracy: 15, address: 'Near Connaught Place, New Delhi' },
        communication_mode: 'relay',
        relay_hops: 2,
        gateway_device: 'dev_i9j0k1l2',
        contact_notification_status: 'delivered',
        notified_contacts: ['+919876543210', '+919998887776'],
        battery_level: 15,
        risk_factors: ['High speed movement', 'Off usual route', 'Audio threshold exceeded', 'Battery critically low'],
        first_event: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        last_event: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading Context Card...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to={`/emergency/${id}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Emergency Details
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
            Full Context Card
          </h1>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          Export as PDF
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className={`p-6 border-b border-slate-700 flex justify-between items-start ${
          data.risk_level === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10'
        }`}>
          <div>
            <div className="text-sm font-mono text-slate-400 mb-1">Session ID: {data.session_id}</div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">Emergency Report</h2>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                data.status === 'active' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {data.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                data.risk_level === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {data.risk_level} RISK
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 mb-1">Initiated</div>
            <div className="text-lg font-bold text-slate-200">
              {new Date(data.created_at).toLocaleTimeString()}
            </div>
            <div className="text-sm text-slate-500">
              {new Date(data.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Location Section */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location Information
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Coordinates</div>
                  <div className="font-mono text-slate-200">
                    {data.location.lat.toFixed(6)}, {data.location.lon.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Estimated Address</div>
                  <div className="text-slate-200">{data.location.address}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Accuracy</div>
                  <div className="text-slate-200">± {data.location.accuracy} meters</div>
                </div>
              </div>
            </section>

            {/* Risk Assessment */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Risk Assessment
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                {data.risk_factors.map((factor: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                    {factor}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Communication & Device */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Device & Network
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Network Mode</div>
                    <div className="flex items-center gap-2 text-slate-200 capitalize">
                      <Radio className="w-4 h-4 text-blue-400" />
                      {data.communication_mode}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Battery Level</div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Activity className={`w-4 h-4 ${data.battery_level <= 15 ? 'text-red-500' : 'text-emerald-500'}`} />
                      {data.battery_level}%
                    </div>
                  </div>
                </div>
                
                {data.communication_mode === 'relay' && (
                  <div className="pt-3 border-t border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-2">Relay Path Information</div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Total Hops</span>
                      <span className="font-bold text-slate-200">{data.relay_hops}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-slate-300">Gateway Node</span>
                      <span className="font-mono text-slate-400">{data.gateway_device}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Contacts */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Emergency Contacts
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-400 font-medium capitalize">Status: {data.contact_notification_status}</span>
                </div>
                <div className="space-y-2">
                  {data.notified_contacts.map((contact: string, i: number) => (
                    <div key={i} className="text-sm text-slate-300 font-mono bg-slate-800 p-2 rounded">
                      {contact}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Timeline Summary */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timeline Summary
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">First Event (SOS)</span>
                  <span className="text-sm text-slate-200">{new Date(data.first_event).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Latest Event</span>
                  <span className="text-sm text-slate-200">{new Date(data.last_event).toLocaleTimeString()}</span>
                </div>
                <div className="mt-2 text-right">
                  <Link to={`/emergency/${id}/timeline`} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
                    View Full Timeline &rarr;
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextCardPage;
