import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Radio, ShieldAlert, 
  Activity, Smartphone, CheckCircle, XCircle 
} from 'lucide-react';

export const EmergencyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock fetching logic
  const [emergency, setEmergency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      setEmergency({
        id,
        session_id: 'pkg_9f8e7d',
        status: 'active',
        risk_level: 'critical',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        location: { lat: 28.6139, lon: 77.2090 },
        communication_mode: 'relay',
        relay_hops: 2,
        gateway_device: 'dev_i9j0k1l2',
        contact_notification_status: 'delivered',
        timeline: [
          { time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'sos', desc: 'SOS Activated' },
          { time: new Date(Date.now() - 1000 * 60 * 14).toISOString(), type: 'relay', desc: 'Packet relayed by dev_a1b2c3d4' },
          { time: new Date(Date.now() - 1000 * 60 * 13).toISOString(), type: 'gateway', desc: 'Received at Gateway dev_i9j0k1l2' },
          { time: new Date(Date.now() - 1000 * 60 * 12).toISOString(), type: 'system', desc: 'Contacts notified via SMS' },
        ],
        risk_factors: ['High speed movement', 'Off usual route', 'Audio threshold exceeded']
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading emergency details...</div>;
  }

  if (!emergency) {
    return <div className="p-6 text-center text-red-400">Emergency not found</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/history" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Emergency Details
            <span className="text-lg font-normal text-slate-400 font-mono">#{emergency.session_id}</span>
          </h1>
        </div>
        {emergency.status === 'active' && (
          <div className="flex gap-3">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Cancel
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Resolve
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Context Card + Map + Timeline) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Context Card Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              Context Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Status</span>
                <div className="font-bold text-red-400 uppercase">{emergency.status}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Risk Level</span>
                <div className="font-bold text-red-500 uppercase">{emergency.risk_level}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Activation Time</span>
                <div className="text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {new Date(emergency.created_at).toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Communication Mode</span>
                <div className="text-slate-200 flex items-center gap-2 capitalize">
                  <Radio className="w-4 h-4 text-slate-500" />
                  {emergency.communication_mode}
                </div>
              </div>
              {emergency.communication_mode === 'relay' && (
                <>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Relay Hops</span>
                    <div className="text-slate-200">{emergency.relay_hops}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Gateway Device</span>
                    <div className="text-slate-200 font-mono text-sm">{emergency.gateway_device}</div>
                  </div>
                </>
              )}
              <div className="space-y-1 md:col-span-2">
                <span className="text-xs text-slate-400">Contact Notification Status</span>
                <div className="text-emerald-400 capitalize flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {emergency.contact_notification_status}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
              <Link to={`/emergency/${id}/context`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View Full Context Card &rarr;
              </Link>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              Location Info
            </h2>
            <div className="bg-slate-900 rounded-lg h-64 flex items-center justify-center border border-slate-700 relative overflow-hidden">
              {/* Static Map representation for now */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/13/5766/3414.png')] bg-cover bg-center"></div>
              <div className="relative z-10 flex flex-col items-center bg-slate-800/90 p-4 rounded-xl border border-slate-600 shadow-xl">
                <MapPin className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
                <div className="font-mono text-slate-200 text-sm text-center">
                  LAT: {emergency.location.lat.toFixed(6)}<br />
                  LON: {emergency.location.lon.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Summary Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Recent Timeline
              </h2>
              <Link to={`/emergency/${id}/timeline`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View All &rarr;
              </Link>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {emergency.timeline.slice(-3).map((item: any, i: number) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-800 bg-indigo-500 text-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-slate-900 p-3 rounded-lg border border-slate-700 shadow">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-slate-200 text-sm capitalize">{item.type}</div>
                      <time className="text-xs text-slate-500">{new Date(item.time).toLocaleTimeString()}</time>
                    </div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Risk Assessment + Relay Events) */}
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Risk Assessment
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-xs text-red-400 mb-1">Current Assessed Risk</div>
                <div className="text-lg font-bold text-red-500 uppercase">{emergency.risk_level}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Detected Factors:</h3>
                <ul className="space-y-2">
                  {emergency.risk_factors.map((factor: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Relay Info (if applicable) */}
          {emergency.communication_mode === 'relay' && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
              <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Radio className="w-5 h-5 text-blue-500" />
                Relay Chain
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <div className="text-slate-200">Source Device</div>
                      <div className="text-slate-500 text-xs">Origin</div>
                    </div>
                  </div>
                  <div className="w-0.5 h-4 bg-slate-700 ml-2.5"></div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <div className="text-sm">
                      <div className="text-slate-200">Relay Node</div>
                      <div className="text-slate-500 text-xs font-mono">dev_a1b2c3d4</div>
                    </div>
                  </div>
                  <div className="w-0.5 h-4 bg-slate-700 ml-2.5"></div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <div className="text-sm">
                      <div className="text-slate-200">Gateway</div>
                      <div className="text-slate-500 text-xs font-mono">{emergency.gateway_device}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetailPage;
