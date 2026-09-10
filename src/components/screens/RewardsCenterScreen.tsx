import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Flame, 
  Users, 
  Award, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Info,
  Search
} from 'lucide-react';

export const RewardsCenterScreen: React.FC = () => {
  const { user, rewardsHistory, navigateBack } = useApp();
  const [filterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = rewardsHistory.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.activity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
          Rewards Center
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/30 text-center space-y-2 relative overflow-hidden">
        {/* 3D Coin Watermark */}
        <div className="absolute -right-8 -top-8 w-36 h-36 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="text-[11px] font-mono tracking-widest text-[#FFB86C] uppercase font-semibold">
          Total Available VDC
        </div>
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-4xl font-extrabold text-white font-mono text-gold-glow">
            {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-lg font-bold text-[#FF9933]">VDC</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="text-slate-300">Today's Rewards:</span>
          <span className="text-[#FFB86C] font-bold">+{user.todayEarnings.toFixed(2)} VDC</span>
        </div>
      </div>

      {/* Itemized Breakdown */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Today's Earnings Breakdown
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="text-slate-300">Daily Mining</span>
            </div>
            <span className="font-mono font-bold text-white">+18.00 VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300">Quiz (8/10)</span>
            </div>
            <span className="font-mono font-bold text-white">+10.00 VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-300">Streak Bonus</span>
            </div>
            <span className="font-mono font-bold text-white">+5.00 VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-300">VandeCircle</span>
            </div>
            <span className="font-mono font-bold text-white">+4.50 VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">Achievements</span>
            </div>
            <span className="font-mono font-bold text-white">+5.00 VDC</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Community</span>
            </div>
            <span className="font-mono font-semibold text-slate-500">+0.00 VDC</span>
          </div>
        </div>
      </div>

      {/* Pending Rewards Card */}
      <div className="p-4 rounded-2xl bg-[#141A28] border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 uppercase">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pending Rewards</span>
          </div>
          <span className="text-base font-bold text-cyan-300 font-mono">
            {user.pendingRewards.toFixed(2)} VDC
          </span>
        </div>

        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Some rewards may remain pending until eligibility and network requirements are satisfied, such as peer circle verification and ongoing activity criteria.
          </p>
        </div>
      </div>

      {/* Reward History Ledger */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Reward History Ledger
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredHistory.length} Entries
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter reward activity..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#111420] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF9933] font-mono"
          />
        </div>

        <div className="space-y-2">
          {filteredHistory.map(tx => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-[#111420] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  tx.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                }`}>
                  {tx.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>

                <div>
                  <div className="text-xs font-bold text-white">{tx.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {tx.timestamp} • {tx.activity}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-mono font-bold ${
                  tx.status === 'completed' ? 'text-[#FF9933]' : 'text-cyan-300'
                }`}>
                  +{tx.amount.toFixed(2)} VDC
                </span>
                <div className="text-[9px] font-mono text-slate-500 uppercase">
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
