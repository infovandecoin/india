import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Flame, 
  Shield, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Gift
} from 'lucide-react';

export const StreaksScreen: React.FC = () => {
  const { user, navigateBack, claimStreakBonus, showToast } = useApp();
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  const handleContinueStreak = () => {
    if (!hasClaimedToday) {
      setHasClaimedToday(true);
      claimStreakBonus();
    } else {
      showToast('Today\'s streak already verified! Come back tomorrow for Day 15.', 'info');
    }
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

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
          Streaks & Bonuses
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-6 rounded-3xl glass-panel-gold border border-[#FF9933]/40 text-center space-y-2 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        
        <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-rose-500/20 to-[#FF9933]/20 border border-rose-500/30 text-rose-500 shadow-gold-glow animate-pulse">
          <Flame className="w-10 h-10 fill-rose-500 text-rose-400" />
        </div>

        <div className="text-3xl font-extrabold text-white font-mono tracking-tight text-gold-glow">
          {user.streakDays} DAY STREAK
        </div>

        <p className="text-xs text-slate-300 font-sans">
          Keep participating every day to maintain momentum.
        </p>

        <div className="pt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172238] border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <span>{user.streakShields} Streak Shield Available</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white font-mono uppercase">
            Next Milestone: 16 days
          </span>
          <span className="text-[#FFB86C] font-mono font-semibold">
            Day 30 (+150 VDC)
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#FF9933] via-rose-500 to-purple-500 shadow-gold-glow transition-all duration-700"
            style={{ width: `${(user.streakDays / 30) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Day {user.streakDays} (Current)</span>
          <span>16 / 30 Days Remaining</span>
        </div>
      </div>

      {/* 30-Day Heatmap Calendar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <CalendarIcon className="w-4 h-4 text-[#FF9933]" />
            <span>30-Day Participation Calendar</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-semibold">
            14 Active Days
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 pt-1">
          {days.map(day => {
            const isCompleted = day <= user.streakDays;
            const isCurrent = day === user.streakDays;
            const isMilestone = [7, 14, 30].includes(day);

            return (
              <div
                key={day}
                className={`relative h-12 rounded-xl flex flex-col items-center justify-center text-xs font-mono transition-all select-none border ${
                  isCurrent
                    ? 'bg-[#FF9933]/25 border-[#FF9933] text-white shadow-gold-glow ring-1 ring-[#FF9933]'
                    : isCompleted
                    ? 'bg-[#18231E] border-emerald-500/40 text-emerald-300'
                    : 'bg-[#111420] border-white/5 text-slate-500'
                }`}
              >
                <span className={`text-[11px] font-bold ${isCurrent ? 'text-[#FFB86C]' : ''}`}>
                  D{day}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                ) : isMilestone ? (
                  <Gift className="w-3.5 h-3.5 text-amber-400 mt-0.5 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1" />
                )}

                {isMilestone && (
                  <span className="absolute -top-1.5 -right-1 px-1 rounded bg-[#FF9933] text-black text-[8px] font-extrabold font-mono">
                    {day === 7 ? '+25' : day === 14 ? '+50' : '+150'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Ladder Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Milestone Progression Rewards
        </h3>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#121E19] border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">7 Days Streak</div>
                <div className="text-[10px] text-slate-400 font-mono">Consistency badge earned</div>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-400">+25 VDC CLAIMED</span>
          </div>

          <div className="p-3 rounded-xl bg-[#241C15] border border-[#FF9933]/50 flex items-center justify-between text-xs shadow-gold-glow">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-[#FF9933] fill-[#FF9933] shrink-0" />
              <div>
                <div className="font-bold text-white">14 Days Streak (Today!)</div>
                <div className="text-[10px] text-[#FFB86C] font-mono">Two weeks unbroken participation</div>
              </div>
            </div>
            <span className="font-mono font-bold text-[#FF9933]">+50 VDC CLAIMED</span>
          </div>

          <div className="p-3 rounded-xl bg-[#131624] border border-purple-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold text-white">30 Days Streak</div>
                <div className="text-[10px] text-slate-400 font-mono">Unlocks 30-Day Legend Badge</div>
              </div>
            </div>
            <span className="font-mono font-bold text-purple-400">+150 VDC</span>
          </div>

          <div className="p-3 rounded-xl bg-[#10121A] border border-white/10 flex items-center justify-between text-xs opacity-75">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="font-bold text-white">90 Days Streak</div>
                <div className="text-[10px] text-slate-400 font-mono">Founding Elder Status</div>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-400">Special Achievement</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinueStreak}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-[#FF9933] to-[#F59E0B] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
      >
        <Flame className="w-4 h-4 fill-current" />
        <span>CONTINUE STREAK</span>
      </button>
    </div>
  );
};
