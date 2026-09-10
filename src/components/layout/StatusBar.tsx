import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StatusBar: React.FC = () => {
  const { user } = useApp();
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-11 px-6 flex items-center justify-between text-xs font-semibold text-white select-none z-30 pt-1 shrink-0">
      <span className="tracking-tight font-sans text-[13px]">{timeStr}</span>

      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-6 px-3.5 rounded-full bg-black border border-white/10 flex items-center gap-2 shadow-inner transition-all duration-300">
        {user.miningActive ? (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
            <span className="text-[10px] font-mono text-[#FF9933] font-medium tracking-wide">VDC SYNC</span>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-300">
        <span className="text-[10px] font-mono tracking-tighter">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">98%</span>
          <Battery className="w-4 h-4 text-[#FF9933] fill-[#FF9933]" />
        </div>
      </div>
    </div>
  );
};
