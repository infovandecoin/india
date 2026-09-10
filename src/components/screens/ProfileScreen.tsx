import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Users, 
  Award, 
  Share2, 
  Clock, 
  ChevronRight, 
  Settings, 
  Sparkles,
  Cloud,
  LogOut,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    user, 
    navigateTo, 
    authUser, 
    logout, 
    deleteAccountAndData, 
    isCloudConnected 
  } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const success = await deleteAccountAndData();
    setIsDeleting(false);
    if (success) {
      setShowDeleteModal(false);
      navigateTo('onboarding');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('auth');
  };

  return (
    <div className="w-full flex-1 px-4 py-3 space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold text-white tracking-wide font-sans">
          User Profile
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111420] border border-white/10 text-[10px] font-mono text-emerald-400">
            <Cloud className="w-3 h-3" />
            <span>{isCloudConnected ? 'Cloud Synced' : 'Offline'}</span>
          </div>
          <button
            onClick={() => navigateTo('security')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Account Security"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/30 text-center space-y-3 relative overflow-hidden">
        {/* 3D Coin Watermark */}
        <div className="absolute -right-8 -top-8 w-36 h-36 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#FF9933]/15 blur-3xl pointer-events-none" />

        <div className="relative inline-block">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#FF9933] via-purple-500 to-cyan-400 shadow-gold-glow">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0B0E14]"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-black">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-lg font-bold text-white font-sans">
              {user.username}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
              VandeID
            </span>
          </div>
          <div className="text-xs font-mono text-[#FFB86C] font-semibold mt-0.5">
            Level 4 • {user.levelTitle}
          </div>
          {authUser?.email && (
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {authUser.email}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            VDC Balance
          </div>
          <div className="text-2xl font-extrabold text-white font-mono text-gold-glow mt-0.5">
            {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VDC
          </div>
        </div>
      </div>

      {/* Gamification System */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF9933]" />
            <span className="font-bold text-white uppercase">Vande XP</span>
          </div>
          <span className="text-[#FFB86C] font-bold">
            {user.xp.toLocaleString()} / {user.xpMax.toLocaleString()} XP
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#FFB86C] via-[#FF9933] to-[#8B5CF6] shadow-gold-glow transition-all duration-700"
            style={{ width: `${(user.xp / user.xpMax) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
          <span>Level 4 (Pioneer)</span>
          <span className="text-purple-300 font-semibold">Next: Level 5 (Champion)</span>
        </div>
      </div>

      <div 
        onClick={() => navigateTo('setup-journey')}
        className="p-4 rounded-2xl bg-[#0F1522] border border-cyan-500/30 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
            {user.profileCompletionPercent}%
          </div>
          <div>
            <div className="text-xs font-bold text-white">Profile Completion</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Complete 2 remaining items for +25 VDC welcome reward.
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-cyan-400" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => navigateTo('streaks')}
          className="p-3.5 rounded-2xl bg-[#111420] border border-white/10 hover:border-rose-500/40 text-left transition-all"
        >
          <Flame className="w-5 h-5 text-rose-400 mb-1 fill-rose-500/30" />
          <div className="text-xs font-bold text-white">{user.streakDays} Day Streak</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">1 Shield active</div>
        </button>

        <button
          onClick={() => navigateTo('circle')}
          className="p-3.5 rounded-2xl bg-[#111420] border border-white/10 hover:border-purple-500/40 text-left transition-all"
        >
          <Users className="w-5 h-5 text-purple-400 mb-1" />
          <div className="text-xs font-bold text-white">VandeCircle: 8</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">82% trust strength</div>
        </button>

        <button
          onClick={() => navigateTo('referral')}
          className="p-3.5 rounded-2xl bg-[#111420] border border-white/10 hover:border-emerald-500/40 text-left transition-all"
        >
          <Share2 className="w-5 h-5 text-emerald-400 mb-1" />
          <div className="text-xs font-bold text-white">127 Referrals</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">386.40 VDC earned</div>
        </button>

        <button
          onClick={() => navigateTo('achievements')}
          className="p-3.5 rounded-2xl bg-[#111420] border border-white/10 hover:border-amber-500/40 text-left transition-all"
        >
          <Award className="w-5 h-5 text-amber-400 mb-1" />
          <div className="text-xs font-bold text-white">{user.achievementsUnlocked} / {user.totalAchievements} Badges</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Achievements</div>
        </button>
      </div>

      <div className="space-y-1.5 pt-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Account & Safety
        </h3>

        <div className="rounded-2xl bg-[#111420] border border-white/10 divide-y divide-white/5 overflow-hidden text-xs">
          <button
            onClick={() => navigateTo('security')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Security Center (Passkey & 2FA)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
              <span>PROTECTED</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </button>

          <button
            onClick={() => navigateTo('rewards')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5 text-slate-200">
              <Clock className="w-4 h-4 text-[#FF9933]" />
              <span className="font-medium">Reward History & Ledger</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => navigateTo('onboarding')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5 text-slate-200">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-medium">Replay Welcome Onboarding</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-all text-amber-400"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out / Switch Account</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Delete Account (Mandatory Google Play Requirement) */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-500/10 transition-all text-red-400"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete Account & Stored Data</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Google Play Compliant Account Deletion Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#131722] border border-red-500/30 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Delete Account & Data</h3>
              </div>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In compliance with Google Play Store User Data Policy, requesting deletion will permanently remove your VandeID credentials, offline cache, streak records, and participation history.
            </p>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-300">
              ⚠️ This action is irreversible. All unverified or pending VDC balances will be forfeited.
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
