import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  Users, 
  Flame, 
  Award, 
  Globe2, 
  ArrowRight, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { VdcCoin } from '../../assets/VdcLogo';

export const EarnHubScreen: React.FC = () => {
  const { user, navigateTo } = useApp();

  const hours = Math.floor(user.sessionRemainingSeconds / 3600);
  const minutes = Math.floor((user.sessionRemainingSeconds % 3600) / 60);

  return (
    <div className="w-full flex-1 px-4 py-4 space-y-4 pb-8">
      <div className="rounded-3xl p-5 glass-panel-gold border border-[#FF9933]/30 relative overflow-hidden">
        {/* 3D Coin Watermark */}
        <div className="absolute -right-6 -top-6 w-32 h-32 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#FF9933]/15 blur-2xl pointer-events-none" />
        <div className="text-[11px] font-mono tracking-widest text-[#FFB86C] uppercase font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Participation Rewards Hub</span>
        </div>

        <div className="flex items-baseline justify-between mt-2 relative z-10">
          <div>
            <div className="text-2xl font-extrabold text-white font-mono text-gold-glow">
              +{user.todayEarnings.toFixed(2)} VDC
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Verified Earnings Today</div>
          </div>
          <button
            onClick={() => navigateTo('rewards')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            View Ledger
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
          Eligible Earning Modules
        </h2>
        <span className="text-xs text-slate-400 font-mono">6 Active Programs</span>
      </div>

      {/* Module 1: Daily Mining */}
      <div className="rounded-2xl p-4 glass-panel border border-white/10 hover:border-[#FF9933]/40 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-center p-1 shrink-0">
              <VdcCoin size={40} glow={user.miningActive} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Daily Mining</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 ${
                  user.miningActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.miningActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  {user.miningActive ? 'Active' : 'Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Run your 24-hour eco-friendly proof-of-participation session.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-[#FF9933] font-mono">+{user.miningRatePerHour.toFixed(2)}/h</span>
            <div className="text-[10px] text-slate-500 font-mono">VDC Rate</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{user.miningActive ? `${hours}h ${minutes}m remaining` : 'Ready to start'}</span>
          </div>
          <button
            onClick={() => navigateTo('mining')}
            className="px-3.5 py-1.5 rounded-xl bg-[#FF9933] text-black font-bold text-xs flex items-center gap-1.5 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <span>CONSOLE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Module 2: VandeQuiz */}
      <div className="rounded-2xl p-4 glass-panel border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">VandeQuiz</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-semibold">
                  Daily
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete educational Web3 quizzes and earn verified tokens.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-cyan-400 font-mono">Up to +12 VDC</span>
            <div className="text-[10px] text-slate-500 font-mono">10 Questions</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono">
            Today: <span className="text-white font-medium">Blockchain & Participation</span>
          </span>
          <button
            onClick={() => navigateTo('quiz')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>START QUIZ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Module 3: VandeCircle */}
      <div className="rounded-2xl p-4 glass-panel border border-purple-500/20 hover:border-purple-400/50 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">VandeCircle</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-mono font-semibold">
                  {user.circleMembersCount} / {user.circleMaxMembers} Peers
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect with verified peers to amplify mutual network trust.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-purple-400 font-mono">+{user.circleEarningsToday.toFixed(2)} VDC</span>
            <div className="text-[10px] text-slate-500 font-mono">Daily Boost</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono">
            Trust Strength: <span className="text-purple-300 font-bold">{user.circleStrengthPercent}%</span>
          </span>
          <button
            onClick={() => navigateTo('circle')}
            className="px-3.5 py-1.5 rounded-xl bg-[#2A1F3D] hover:bg-[#382952] border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>MANAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Module 4: Streak */}
      <div className="rounded-2xl p-4 glass-panel border border-rose-500/20 hover:border-rose-400/50 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-6 h-6 fill-rose-500/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Streak & Bonuses</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-mono font-semibold">
                  Day {user.streakDays} 🔥
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Log in and check in daily for cumulative milestone rewards.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-rose-400 font-mono">Up to +150 VDC</span>
            <div className="text-[10px] text-slate-500 font-mono">Milestones</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono">
            Protection: <span className="text-rose-300 font-semibold">{user.streakShields} Shield Available</span>
          </span>
          <button
            onClick={() => navigateTo('streaks')}
            className="px-3.5 py-1.5 rounded-xl bg-[#2D1620] hover:bg-[#3D1E2C] border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>CALENDAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Module 5: Achievements */}
      <div className="rounded-2xl p-4 glass-panel border border-white/10 hover:border-white/20 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Achievements</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-mono font-semibold">
                  {user.achievementsUnlocked} / {user.totalAchievements} Badges
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Unlock badges and milestones across learning, circle, and streak.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-amber-400 font-mono">Milestones</span>
            <div className="text-[10px] text-slate-500 font-mono">On-Chain</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono">
            XP Progress: <span className="text-white font-medium">{user.xp} / {user.xpMax} XP</span>
          </span>
          <button
            onClick={() => navigateTo('achievements')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Module 6: Referral */}
      <div className="rounded-2xl p-4 glass-panel border border-emerald-500/20 hover:border-emerald-400/50 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Invite & Network</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-semibold">
                  {user.referralCount} Members
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Build an authentic grassroots community of verified participants.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-emerald-400 font-mono">{user.referralRewardsTotal.toFixed(2)} VDC</span>
            <div className="text-[10px] text-slate-500 font-mono">Total Earned</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-400 font-mono">
            Code: <span className="text-emerald-300 font-bold">{user.referralCode}</span>
          </span>
          <button
            onClick={() => navigateTo('referral')}
            className="px-3.5 py-1.5 rounded-xl bg-[#142B22] hover:bg-[#1C3B2E] border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>INVITE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
