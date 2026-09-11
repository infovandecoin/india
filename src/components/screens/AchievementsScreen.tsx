import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Compass, 
  BookOpen, 
  Users, 
  Flame, 
  Trophy, 
  ShieldCheck
} from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { 
    user, 
    achievements, 
    claimAchievement, 
    navigateBack 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Ecosystem' | 'Learning' | 'Community' | 'Dedication'>('All');

  const filtered = activeCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedPercent = Math.round((user.achievementsUnlocked / Math.max(1, user.totalAchievements)) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full flex-1 px-4 py-3 space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={navigateBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-white tracking-wide font-sans">
          Achievements
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/30 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#FFB86C]">
            Ecosystem Milestones
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
            {user.achievementsUnlocked} <span className="text-sm text-slate-400 font-sans font-normal">/ {user.totalAchievements} Unlocked</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Earn VDC and ecosystem XP for every verified achievement.
          </p>
        </div>

        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#FF9933]"
              strokeDasharray={`${unlockedPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-bold font-mono text-white">{unlockedPercent}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['All', 'Ecosystem', 'Learning', 'Community', 'Dedication'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all border ${
              activeCategory === cat
                ? 'bg-[#FF9933] text-black font-bold border-[#FF9933] shadow-gold-glow'
                : 'bg-[#111420] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(item => {
          const progressPercent = Math.min(100, Math.round((item.progress / Math.max(1, item.target)) * 100));

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                item.unlocked
                  ? 'bg-[#131726] border-white/15 hover:border-[#FF9933]/50'
                  : 'bg-[#0E111A] border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      item.unlocked
                        ? 'bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/30 shadow-gold-glow'
                        : 'bg-white/5 text-slate-500 border-white/10'
                    }`}
                  >
                    {item.unlocked ? getIcon(item.icon) : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <span className="px-2 py-0.2 rounded text-[9px] font-mono bg-white/10 text-slate-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#FF9933] font-mono">
                    +{item.rewardVdc.toFixed(2)} VDC
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">+150 XP</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    Progress: <span className="text-white font-bold">{item.progress} / {item.target}</span>
                  </span>
                  <span className={item.unlocked ? 'text-emerald-400' : 'text-slate-500'}>
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.unlocked
                        ? 'bg-gradient-to-r from-[#FF9933] to-[#10B981]'
                        : 'bg-white/20'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                {item.unlocked && !item.claimed ? (
                  <button
                    onClick={() => claimAchievement(item.id)}
                    className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#F59E0B] text-black font-bold text-xs flex items-center gap-1.5 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CLAIM +{item.rewardVdc.toFixed(2)} VDC</span>
                  </button>
                ) : item.claimed ? (
                  <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CLAIMED</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>LOCKED</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
