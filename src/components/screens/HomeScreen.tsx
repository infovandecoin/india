import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Flame, 
  HelpCircle, 
  Users, 
  Award, 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { VdcCoin, VdcLogo } from '../../assets/VdcLogo';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    navigateTo, 
    toggleMining 
  } = useApp();

  const hours = Math.floor(user.sessionRemainingSeconds / 3600);
  const minutes = Math.floor((user.sessionRemainingSeconds % 3600) / 60);
  const seconds = user.sessionRemainingSeconds % 60;
  const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full flex-1 px-4 py-4 space-y-4 pb-6">
      {/* 1. Hero Mining & Balance Card */}
      <div className="relative w-full rounded-3xl p-5 overflow-hidden glass-panel-gold shadow-card-elevated border border-[#FF9933]/30">
        {/* Subtle 3D coin watermark in background */}
        <div className="absolute -top-6 -right-6 w-40 h-40 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FF9933]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-semibold">ECO-PROOF PARTICIPATION</span>
          </div>
          <button 
            onClick={() => navigateTo('rewards')}
            className="flex items-center gap-1 text-xs text-[#FFB86C] hover:text-white transition-colors font-medium"
          >
            <span>Rewards</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center py-2 relative z-10">
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            Total Verified Balance
          </div>
          <div className="flex items-baseline justify-center gap-1.5 mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono text-gold-glow">
              {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-bold text-[#FF9933] font-sans">VDC</span>
          </div>

          <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/25 text-xs font-mono font-medium text-[#FFB86C]">
            <Zap className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>+{user.miningRatePerHour.toFixed(2)} VDC / hour</span>
          </div>
        </div>

        {/* Large Circular Mining / Progress Visualization with 3D Minted Coin */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          <div 
            onClick={() => navigateTo('mining')}
            className="relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer group select-none transition-transform hover:scale-105 active:scale-95"
          >
            {user.miningActive && (
              <>
                <div className="absolute inset-0 rounded-full border border-[#FF9933]/40 radar-wave pointer-events-none" />
                <div className="absolute inset-0 rounded-full border border-[#FF9933]/25 radar-wave-delayed pointer-events-none" />
              </>
            )}

            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={user.miningActive ? '85' : '440'}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB86C" />
                  <stop offset="50%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Official 3D Minted VandeCoin In Center */}
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center p-1 group-hover:scale-105 transition-all">
              <VdcCoin size={118} glow={user.miningActive} spin={false} />

              {/* Floating Status Pill */}
              <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-[#0D1018]/95 border border-[#FF9933]/40 shadow-xl backdrop-blur-md flex items-center gap-1.5 z-10">
                <span className={`w-2 h-2 rounded-full ${user.miningActive ? 'bg-emerald-400 shadow-cyan-glow animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-mono font-bold text-white tracking-wide">
                  {user.miningActive ? 'MINING 24H' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono mt-1 text-center">
            Next reward session in <span className="text-[#FFB86C] font-semibold">{timeFormatted}</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex gap-2.5 mt-2">
          <button
            onClick={toggleMining}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-98 ${
              user.miningActive
                ? 'bg-gradient-to-r from-[#FF9933] via-[#F59E0B] to-[#D97706] text-black shadow-gold-glow hover:brightness-110'
                : 'bg-[#222838] text-white border border-white/20 hover:bg-[#2C344A]'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{user.miningActive ? 'MINING ACTIVE' : 'START MINING SESSION'}</span>
          </button>

          <button
            onClick={() => navigateTo('mining')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Open Dedicated Mining Console"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Today's Progress Card */}
      <div className="w-full rounded-2xl p-4 glass-panel border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9933]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Today's Progress</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#FFB86C] bg-[#FF9933]/15 px-2.5 py-0.5 rounded-full border border-[#FF9933]/30">
            7 / 10 Completed
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#FFB86C] via-[#FF9933] to-[#06B6D4] transition-all duration-700 shadow-gold-glow"
            style={{ width: '70%' }}
          />
        </div>

        {/* Quick Reward Cards Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => navigateTo('mining')}
            className="p-3 rounded-xl bg-[#141724] border border-white/10 hover:border-[#FF9933]/50 transition-all text-left flex items-start justify-between group"
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Zap className="w-3 h-3 text-[#FF9933]" />
                <span>Daily Mining</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-white">+18 VDC</span>
          </button>

          <button
            onClick={() => navigateTo('quiz')}
            className="p-3 rounded-xl bg-[#141724] border border-white/10 hover:border-[#FF9933]/50 transition-all text-left flex items-start justify-between group"
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>Quiz</span>
              </div>
              <div className="text-xs font-bold text-[#FF9933] mt-1">
                Ready to play
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-white">+10 VDC</span>
          </button>

          <button
            onClick={() => navigateTo('circle')}
            className="p-3 rounded-xl bg-[#141724] border border-white/10 hover:border-[#FF9933]/50 transition-all text-left flex items-start justify-between group"
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Users className="w-3 h-3 text-purple-400" />
                <span>VandeCircle</span>
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                8 Members
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-white">+4.50 VDC</span>
          </button>

          <button
            onClick={() => navigateTo('streaks')}
            className="p-3 rounded-xl bg-[#141724] border border-white/10 hover:border-[#FF9933]/50 transition-all text-left flex items-start justify-between group"
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Streak</span>
              </div>
              <div className="text-xs font-bold text-rose-400 mt-1">
                14 Days 🔥
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-white">+5 VDC</span>
          </button>
        </div>

        <button
          onClick={() => navigateTo('achievements')}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-white/5 to-[#FF9933]/10 border border-white/10 hover:border-[#FF9933]/40 flex items-center justify-between text-xs transition-all"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FF9933]" />
            <span className="font-medium text-slate-200">Achievements ({user.achievementsUnlocked}/{user.totalAchievements})</span>
          </div>
          <span className="font-mono font-bold text-[#FFB86C] flex items-center gap-1">
            +5.00 VDC Unclaimed
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* 3. Today's Earnings & Micro Activity Timeline */}
      <div className="w-full rounded-2xl p-4 glass-panel border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <div className="text-[11px] font-mono text-slate-400">TODAY'S EARNINGS</div>
            <div className="text-xl font-extrabold text-[#FF9933] font-mono text-gold-glow">
              +{user.todayEarnings.toFixed(2)} VDC
            </div>
          </div>
          <button
            onClick={() => navigateTo('rewards')}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
          >
            <span>Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Daily participation verified</span>
            </div>
            <span className="font-mono font-semibold text-white">+18.00 VDC</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Quiz: Blockchain Concepts (8/10)</span>
            </div>
            <span className="font-mono font-semibold text-white">+10.00 VDC</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span className="text-slate-300">14-Day Streak Milestone Reward</span>
            </div>
            <span className="font-mono font-semibold text-white">+5.00 VDC</span>
          </div>
        </div>
      </div>

      {/* 4. Come back tomorrow Engagement Card */}
      <div 
        onClick={() => navigateTo('streaks')}
        className="w-full rounded-2xl p-4 bg-gradient-to-r from-[#18141F] via-[#201828] to-[#141B2B] border border-purple-500/25 cursor-pointer hover:border-purple-400/50 transition-all flex items-center gap-3.5 group shadow-lg"
      >
        <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Calendar className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">Day 15 Unlocks Tomorrow</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-mono font-semibold">
              +50 VDC Bonus
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Maintain your 14-day streak to claim your half-month ecosystem milestone reward.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* 5. Setup Checklist Teaser */}
      {user.setupTasksCompleted < user.setupTasksTotal && (
        <div 
          onClick={() => navigateTo('setup-journey')}
          className="w-full p-3.5 rounded-2xl bg-[#0F1424] border border-[#06B6D4]/30 cursor-pointer hover:border-cyan-400 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-white">
                Setup Journey: {user.setupTasksCompleted} / {user.setupTasksTotal} Completed
              </div>
              <div className="text-[11px] text-cyan-300 font-mono">
                Claim +25 VDC Welcome Reward
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
            VIEW
          </span>
        </div>
      )}
    </div>
  );
};
