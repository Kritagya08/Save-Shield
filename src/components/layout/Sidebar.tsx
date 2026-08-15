import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Radio, 
  Activity, 
  Users, 
  Clock, 
  AlertTriangle, 
  Bell, 
  Settings, 
  User,
  Info,
  Shield
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navGroups = [
    {
      title: 'Main',
      links: [
        { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/sos', icon: <ShieldAlert className="w-5 h-5 text-red-500" />, label: 'SOS Center' },
        { to: '/live', icon: <Activity className="w-5 h-5" />, label: 'Live Emergency' },
      ]
    },
    {
      title: 'Network',
      links: [
        { to: '/network', icon: <Radio className="w-5 h-5" />, label: 'Relay Network' },
        { to: '/devices', icon: <Shield className="w-5 h-5" />, label: 'Devices' },
      ]
    },
    {
      title: 'Safety',
      links: [
        { to: '/contacts', icon: <Users className="w-5 h-5" />, label: 'Contacts' },
        { to: '/history', icon: <Clock className="w-5 h-5" />, label: 'History' },
        { to: '/risk', icon: <AlertTriangle className="w-5 h-5" />, label: 'Risk Assessment' },
      ]
    },
    {
      title: 'System',
      links: [
        { to: '/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
        { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
        { to: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
      ]
    },
    {
      title: 'Other',
      links: [
        { to: '/demo', icon: <Info className="w-5 h-5" />, label: 'Demo' },
        { to: '/about', icon: <Info className="w-5 h-5" />, label: 'About' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center px-6 py-6 sticky top-0 bg-slate-900 z-10 border-b border-white/5">
        <Shield className="w-8 h-8 text-blue-500 mr-3" />
        <span className="text-xl font-bold tracking-tight text-white">SAVE SHIELD</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {group.title}
            </h4>
            <ul className="space-y-1">
              {group.links.map((link, j) => (
                <li key={j}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent'
                      }
                    `}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span className="font-medium text-sm">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};
