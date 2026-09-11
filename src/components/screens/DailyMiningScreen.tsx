import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  Flame, 
  Info, 
  Leaf,
  Users
} from 'lucide-react';
import { VdcCoin } from '../../assets/VdcLogo';

export const DailyMiningScreen: React.FC = () => {
  const { 
    user, 
    toggleMining, 
    navigateBack, 
    navigateTo 
  } = useApp();

  const hours = Math.floor(user.sessionRemainingSeconds / 3600);
  const minutes = Math.floor((user.sessionRemainingSeconds % 3600) / 60);
  const seconds = user.sessionRemainingSeconds % 60;
  const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const streakPercent = Math.min(100, Math.round((user.streakDays / 30) * 100));

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
          Daily Mining
        </h1>
        <div className="w-9" />
      </div>

      <div className="relative p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/30 text-center overflow-hidden">
        {/* 3D Coin Watermark */}
        <div className="absolute -right-8 -top-8 w-36 h-36 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="text-[11px] font-mono tracking-widest text-[#FFB86C] uppercase font-semibold">
            Current VDC Mining Reserve
          </div>
          <div className="flex items-baseline justify-center gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono text-gold-glow">
              {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-bold text-[#FF9933]">VDC</span>
          </div>
        </div>
      </div>

      <div className="relative my-6 flex flex-col items-center justify-center">
        <div 
          onClick={toggleMining}
          className="relative w-56 h-56 rounded-full flex items-center justify-center cursor-pointer group select-none transition-transform hover:scale-105 active:scale-95"
        >
          {user.miningActive && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-[#FF9933]/50 radar-wave pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 radar-wave-delayed pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border border-[#FF9933]/20 animate-spin-slow pointer-events-none border-dashed" />
            </>
          )}

          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="url(#miningGoldGradient)"
              strokeWidth="10"
              strokeDasharray="552"
              strokeDashoffset={user.miningActive ? String(552 - (552 * (86400 - user.sessionRemainingSeconds) / 86400)) : '552'}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="miningGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB86C" />
                <stop offset="40%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central 3D Embossed Minted Coin with Dynamic Session Badge */}
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center p-2 group-hover:scale-105 transition-all">
            <VdcCoin size={156} glow={user.miningActive} spin={false} />

            {/* Glowing session indicator pill across center-bottom */}
            <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#0B0E17]/95 border border-[#FF9933]/50 shadow-2xl backdrop-blur-md flex items-center gap-2 z-10">
              <span className={`w-2 h-2 rounded-full ${user.miningActive ? 'bg-emerald-400 shadow-cyan-glow animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                {user.miningActive ? 'MINING ACTIVE' : 'MINING READY'}
              </span>
              <span className="text-[10px] font-mono text-[#FFB86C] font-semibold border-l border-white/20 pl-1.5">
                +{user.miningRatePerHour.toFixed(2)}/h
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141724] border border-white/10 text-xs font-mono text-slate-300 mt-2">
          <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Session Remaining:</span>
          <span className="text-white font-bold tracking-wider">{timeFormatted}</span>
        </div>
      </div>

      <button
        onClick={toggleMining}
        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 active:scale-98 ${
          user.miningActive
            ? 'bg-gradient-to-r from-cyan-500 to-[#009944] text-white shadow-cyan-glow hover:brightness-110'
            : 'bg-gradient-to-r from-[#FF9933] via-[#F59E0B] to-[#D97706] text-black shadow-gold-glow hover:brightness-110'
        }`}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>{user.miningActive ? 'COLLECT & SETTLE SESSION' : 'START 24-HOUR MINING SESSION'}</span>
      </button>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Mining Rate</div>
          <div className="text-sm font-bold text-[#FF9933] font-mono mt-1">+{user.miningRatePerHour.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">VDC / hour</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PoP Status</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            {user.miningActive ? 'Verifying' : 'Standby'}
          </div>
          <div className="text-[10px] text-slate-500">Eco-friendly</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Trust Boost</div>
          <div className="text-sm font-bold text-cyan-400 font-mono mt-1">{user.circleMembersCount}/10</div>
          <div className="text-[10px] text-slate-500">Circle Peers</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#0F1622] border border-cyan-500/25 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>Zero Device Battery & CPU Drain</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-400/20 text-cyan-300 font-mono">ECO PoP</span>
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            VandeCoin operates strictly on a Proof-of-Participation (PoP) protocol. No background computation, hashing loops, or battery drain occurs on your device. Sessions are recorded securely on-chain with full Google Play policy compliance.
          </p>
        </div>
      </div>

      <div 
        onClick={() => navigateTo('streaks')}
        className="p-4 rounded-2xl glass-panel border border-[#FF9933]/30 space-y-3 cursor-pointer hover:border-[#FF9933]/60 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF9933] fill-[#FF9933]" />
            <div>
              <h3 className="text-xs font-bold text-white">Participation Streak: {user.streakDays} Days</h3>
              <p className="text-[11px] text-slate-400">{user.streakDays} / 30 Days to Legend tier</p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-[#FF9933]/15 border border-[#FF9933]/30 text-xs font-mono font-bold text-[#FFB86C]">
            +0.0{Math.floor(user.streakDays / 5)} VDC/h Boost
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#FF9933] to-[#F59E0B] shadow-gold-glow transition-all duration-500"
            style={{ width: `${streakPercent}%` }}
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#FF9933]" />
          <span>How Vande Mining Works</span>
        </h3>

        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <span className="font-bold text-white">Start your 24h session</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Check in once every 24 hours to prove active network presence.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <span className="font-bold text-white">Grow your trust network</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Connect with up to 10 verified circle members to boost your mining speed up to +0.10 VDC/h.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <span className="font-bold text-white">Collect verified VDC</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Tokens are written directly to your immutable, sovereign ledger.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
