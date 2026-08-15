import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', header }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl hover:border-white/10 transition-colors overflow-hidden ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-white/5">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
