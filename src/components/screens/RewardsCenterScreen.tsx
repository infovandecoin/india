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
  Clock, 
  CheckCircle2, 
  Search,
  Gift
} from 'lucide-react';

export const RewardsCenterScreen: React.FC = () => {
  const { user, rewardsHistory, navigateBack } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically calculate category earnings
  const miningTotal = rewardsHistory
    .filter(t => t.category === 'mining' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const quizTotal = rewardsHistory
    .filter(t => t.category === 'quiz' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const streakTotal = rewardsHistory
    .filter(t => t.category === 'streak' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const referralTotal = rewardsHistory
    .filter(t => t.category === 'referral' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const milestonesTotal = rewardsHistory
    .filter(t => (t.category === 'achievement' || t.category === 'welcome') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredHistory = rewardsHistory.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.activity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'mining', label: 'Mining' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'streak', label: 'Streak' },
    { id: 'referral', label: 'Referral' },
    { id: 'welcome', label: 'Welcome' },
    { id: 'achievement', label: 'Badges' },
  ];

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
          Total Verified Balance (From Ledger)
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

      {/* Itemized Dynamic Breakdown from Ledger */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Cumulative Earnings Breakdown
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="text-slate-300">Daily PoP Mining</span>
            </div>
            <span className="font-mono font-bold text-white">+{miningTotal.toFixed(2)} VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300">Educational VandeQuiz</span>
            </div>
            <span className="font-mono font-bold text-white">+{quizTotal.toFixed(2)} VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-300">Participation Streaks</span>
            </div>
            <span className="font-mono font-bold text-white">+{streakTotal.toFixed(2)} VDC</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Referral Network</span>
            </div>
            <span className="font-mono font-bold text-white">+{referralTotal.toFixed(2)} VDC</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-300">Welcome & Milestones</span>
            </div>
            <span className="font-mono font-bold text-white">+{milestonesTotal.toFixed(2)} VDC</span>
          </div>
        </div>
      </div>

      {/* Transaction History Filter & Search */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Ledger Transactions ({rewardsHistory.length})
          </h3>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#111420] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF9933]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-[#FF9933] text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filteredHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#111420] border border-white/10 text-center space-y-1">
            <Clock className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No transactions found in this category.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map(tx => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#FF9933]">
                    {tx.category === 'mining' ? <Zap className="w-4 h-4" /> :
                     tx.category === 'quiz' ? <HelpCircle className="w-4 h-4 text-cyan-400" /> :
                     tx.category === 'streak' ? <Flame className="w-4 h-4 text-rose-400" /> :
                     tx.category === 'referral' ? <Users className="w-4 h-4 text-emerald-400" /> :
                     <Award className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{tx.title}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.activity} • {tx.timestamp}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-extrabold text-[#FF9933]">
                    +{Number(tx.amount).toFixed(2)} VDC
                  </span>
                  <div className="text-[9px] text-emerald-400 font-semibold">VERIFIED</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
