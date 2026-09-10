import React from 'react';
import { Home, Zap, Users, Trophy, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface TabItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'earn', label: 'Earn', icon: Zap, badge: '+VDC' },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="w-full bg-[#0A0C14]/92 backdrop-blur-2xl border-t border-white/[0.08] px-3 pt-2 pb-5 select-none shrink-0 z-30">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group focus:outline-none ${
                isActive ? 'text-[#FF9933]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 rounded-full bg-gradient-to-r from-[#FFB86C] via-[#FF9933] to-[#F59E0B] shadow-gold-glow animate-pulse" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'group-hover:scale-105 stroke-[1.8]'
                  }`}
                />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-3 px-1 py-0.2 rounded-full bg-[#FF9933] text-[8px] font-bold text-black font-mono leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-medium mt-1 tracking-tight transition-all ${
                  isActive ? 'font-semibold text-white' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
