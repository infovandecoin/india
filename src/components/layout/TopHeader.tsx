import React from 'react';
import { Bell, Flame, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VdcLogo } from '../../assets/VdcLogo';

export const TopHeader: React.FC = () => {
  const { 
    user, 
    unreadNotificationCount, 
    navigateTo, 
    setActiveTab, 
    activeRoute 
  } = useApp();

  return (
    <header className="w-full px-5 py-2.5 flex items-center justify-between border-b border-white/[0.06] bg-[#0A0C13]/80 backdrop-blur-xl shrink-0 z-20">
      <button 
        onClick={() => { setActiveTab('home'); }}
        className="flex items-center gap-2 text-left group transition-transform active:scale-95 focus:outline-none"
      >
        <VdcLogo size={34} variant="mark" animated={user.miningActive} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-sm font-extrabold tracking-wider text-white font-sans">
              VANDE<span className="text-[#FF9933]">COIN</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30">
              VDC
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] font-mono font-bold text-[#009944] tracking-wider uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              BUILT FOR A BRIGHTER INDIA
            </span>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo('streaks')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181C28] border border-[#FF9933]/30 text-xs font-semibold text-white hover:border-[#FF9933]/60 transition-all active:scale-95"
          title="Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 text-[#FF9933] fill-[#FF9933] animate-pulse" />
          <span className="font-mono text-[11px] text-[#FF9933]">{user.streakDays}d</span>
        </button>

        <button
          onClick={() => navigateTo('notifications')}
          className="relative p-2 rounded-xl bg-[#141724] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all active:scale-95 focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF9933] text-black font-bold text-[9px] flex items-center justify-center font-mono ring-2 ring-[#08090C]">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigateTo('profile')}
          className={`relative p-0.5 rounded-full border-2 transition-all active:scale-95 focus:outline-none ${
            activeRoute === 'profile' ? 'border-[#FF9933] shadow-gold-glow' : 'border-white/20 hover:border-[#FF9933]/50'
          }`}
          aria-label="User Profile"
        >
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-7 h-7 rounded-full object-cover"
          />
          {user.isVerifiedVandeId && (
            <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-[#08090C]">
              <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400/20" />
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
