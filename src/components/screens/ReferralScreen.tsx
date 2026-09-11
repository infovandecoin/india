import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Copy, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Network,
  AlertTriangle,
  Gift
} from 'lucide-react';

export const ReferralScreen: React.FC = () => {
  const { user, navigateBack, copyReferralCode, showToast, redeemReferral } = useApp();
  const [inviteInput, setInviteInput] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join VandeCoin (VDC) Ecosystem',
        text: `Join me on VandeCoin (VDC) - the global participation and learning ecosystem. Use my referral code: ${user.referralCode}`,
        url: 'https://vandecoin.network/join',
      }).catch(() => {});
    } else {
      copyReferralCode();
      showToast('Invite link & code copied to share!', 'gold');
    }
  };

  const handleRedeem = async () => {
    if (!inviteInput.trim()) {
      showToast('Please enter an invitation code', 'info');
      return;
    }
    setIsRedeeming(true);
    const res = await redeemReferral(inviteInput.trim());
    setIsRedeeming(false);
    if (res.success) {
      setInviteInput('');
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
          Invite & Earn
        </h1>
        <div className="w-9" />
      </div>

      <div className="text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GRASSROOTS EXPANSION</span>
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Grow the VandeCoin community
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
          Introduce authentic pioneers to build India's sovereign digital participation network.
        </p>
      </div>

      {/* Referral Code Box */}
      <div className="p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/40 text-center space-y-3 shadow-xl relative overflow-hidden">
        {/* 3D Coin Watermark */}
        <div className="absolute -right-8 -top-8 w-36 h-36 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>

        <div className="text-[11px] font-mono tracking-widest text-[#FFB86C] uppercase font-semibold">
          Your Unique Referral Code
        </div>
        <div className="py-2 px-4 rounded-2xl bg-[#0C0F17] border border-[#FF9933]/30 inline-block font-mono text-xl font-extrabold text-[#FF9933] tracking-widest text-gold-glow select-all">
          {user.referralCode}
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={copyReferralCode}
            className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Copy className="w-4 h-4 text-slate-300" />
            <span>COPY CODE</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#FF9933] to-[#F59E0B] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE INVITE</span>
          </button>
        </div>
      </div>

      {/* Enter Invitation Code (If invited by someone) */}
      <div className="p-4 rounded-2xl bg-[#111420] border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
          <Gift className="w-4 h-4 text-[#FF9933]" />
          <span>Have an Invitation Code?</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Enter a friend's referral code to link your account and earn +10.00 VDC welcome bonus.
        </p>
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={inviteInput}
            onChange={e => setInviteInput(e.target.value)}
            placeholder="e.g. VDC-PIONEER-4821"
            className="flex-1 px-3 py-2 rounded-xl bg-[#0B0D14] border border-white/15 text-xs text-white font-mono uppercase placeholder:text-slate-500 focus:outline-none focus:border-[#FF9933]"
          />
          <button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="px-4 py-2 rounded-xl bg-[#FF9933] text-black font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isRedeeming ? 'Redeeming...' : 'Redeem'}
          </button>
        </div>
      </div>

      {/* Network Stats Card */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Your Network</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
              {user.referralCount} <span className="text-sm font-normal text-slate-400 font-sans">Members</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Total Referral Rewards</div>
            <div className="text-lg font-extrabold text-[#FF9933] font-mono text-gold-glow">
              {user.referralRewardsTotal.toFixed(2)} VDC
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] font-mono text-emerald-400 uppercase flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{user.referralActive}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="text-[10px] font-mono text-cyan-400 uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Verified
            </div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{user.referralVerified}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[10px] font-mono text-amber-400 uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Pending
            </div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{user.referralPending}</div>
          </div>
        </div>
      </div>

      {/* Referral Tier Progress Cards */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Network Progression Tiers
        </h3>

        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          user.referralCount >= 5 ? 'bg-[#111420] border-emerald-500/30' : 'bg-[#10121A] border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
              L1
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Level 1: Community Pioneer</span>
                {user.referralCount >= 5 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {Math.min(5, user.referralCount)} / 5 Members • +50 VDC Milestone
              </div>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
            user.referralCount >= 5 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
          }`}>
            {user.referralCount >= 5 ? 'UNLOCKED' : `${5 - Math.min(5, user.referralCount)} LEFT`}
          </span>
        </div>

        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
          user.referralCount >= 25 ? 'bg-[#111420] border-emerald-500/30' : 'bg-[#10121A] border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center font-bold text-xs font-mono">
              L2
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Level 2: Network Builder</span>
                {user.referralCount >= 25 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {Math.min(25, user.referralCount)} / 25 Members • +150 VDC Milestone
              </div>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
            user.referralCount >= 25 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
          }`}>
            {user.referralCount >= 25 ? 'UNLOCKED' : `${25 - Math.min(25, user.referralCount)} LEFT`}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <span className="text-slate-200 font-semibold">Ethical Growth Policy:</span> VandeCoin strictly discourages spam, bot accounts, or self-referrals. Every invitation is linked to an immutable ledger entry with cryptographic fraud detection.
        </p>
      </div>
    </div>
  );
};
