import React, { useState } from 'react';
import { Bell, ShieldAlert, Users, Radio, Server, Info, CheckCircle, Clock, XCircle } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'SOS', title: 'SOS Activated', message: 'Emergency alert sent to contacts.', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'Sent' },
  { id: 2, type: 'Contact', title: 'Jane Doe Accepted', message: 'Jane Doe is now an emergency contact.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'Confirmed' },
  { id: 3, type: 'System', title: 'System Update', message: 'App updated successfully.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'Confirmed' },
  { id: 4, type: 'Relay', title: 'Relay Node Joined', message: 'Device B joined the mesh network.', timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'Pending' }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('All');
  
  const tabs = ['All', 'SOS', 'Contact', 'Relay', 'Gateway', 'System'];

  const filtered = filter === 'All' ? mockNotifications : mockNotifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'SOS': return <ShieldAlert className="text-red-500" size={24} />;
      case 'Contact': return <Users className="text-blue-500" size={24} />;
      case 'Relay': return <Radio className="text-purple-500" size={24} />;
      case 'Gateway': return <Server className="text-teal-500" size={24} />;
      default: return <Info className="text-slate-400" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      case 'Sent': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Failed': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'Confirmed': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="text-blue-500" size={32} />
        <h1 className="text-3xl font-bold text-slate-100">Notifications</h1>
      </div>

      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Bell className="mx-auto mb-4 opacity-50" size={48} />
            <p className="text-lg">No notifications yet</p>
          </div>
        ) : (
          filtered.map(notification => (
            <div key={notification.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-start gap-4 hover:border-slate-600 transition-colors">
              <div className="p-2 bg-slate-900 rounded-lg">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-medium text-slate-200 truncate">{notification.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs border whitespace-nowrap ${getStatusColor(notification.status)}`}>
                    {notification.status}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">{notification.message}</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                  <Clock size={14} />
                  {notification.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
