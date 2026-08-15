import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, User as UserIcon } from 'lucide-react';
import { StatusIndicator } from '../ui/StatusIndicator';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  
  // Format pathname to a readable title
  const getTitle = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-white/5 bg-slate-900/80 backdrop-blur flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-4 p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-white truncate">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="hidden sm:flex items-center bg-slate-800/50 rounded-full px-3 py-1.5 border border-white/5">
          <StatusIndicator status="online" className="mr-2" />
          <span className="text-xs font-medium text-slate-300">Network Active</span>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900" />
        </button>

        <div className="h-8 w-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-colors">
          <UserIcon className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    </header>
  );
};
