import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Users, Clock, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const links = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
    { to: '/sos', icon: <ShieldAlert className="w-5 h-5" />, label: 'SOS' },
    { to: '/contacts', icon: <Users className="w-5 h-5" />, label: 'Contacts' },
    { to: '/history', icon: <Clock className="w-5 h-5" />, label: 'History' },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/5 pb-safe z-50">
      <nav className="flex justify-around items-center h-16 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 h-full space-y-1
              ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <div className={`
              p-1 rounded-full transition-colors
              ${link.to === '/sos' ? 'text-red-500 bg-red-500/10' : ''}
            `}>
              {link.icon}
            </div>
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
