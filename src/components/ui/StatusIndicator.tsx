import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'relaying';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const colors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-500',
    relaying: 'bg-amber-500',
  };

  const pulse = status !== 'offline' ? 'animate-pulse' : '';

  return (
    <div className={`relative flex items-center justify-center w-3 h-3 ${className}`}>
      {status !== 'offline' && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]} ${pulse}`} />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
    </div>
  );
};
