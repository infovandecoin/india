import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Crown, 
  CheckCircle2, 
  Globe, 
  ChevronUp
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  vdc: number;
  badge: string;
  country: string;
  verified: boolean;
  scoreMetric: string;
}

const top3: LeaderboardUser[] = [
  { rank: 1, name: 'Satya K.', handle: '@satya_k', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', vdc: 24820.00, badge: 'Pioneer Vanguard', country: 'IN', verified: true, scoreMetric: '99% Consistency' },
  { rank: 2, name: 'Elena Rostova', handle: '@elena_vdc', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', vdc: 22450.00, badge: 'Protocol Elder', country: 'DE', verified: true, scoreMetric: '98% Consistency' },
  { rank: 3, name: 'Aarav Tech', handle: '@aarav_tech', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', vdc: 21980.00, badge: 'Circle Anchor', country: 'IN', verified: true, scoreMetric: '96% Consistency' },
];

const generalList: LeaderboardUser[] = [
  { rank: 4, name: 'Marcus Vance', handle: '@marcus_v', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', vdc: 19840.00, badge: 'Community Champion', country: 'US', verified: true, scoreMetric: '94% Consistency' },
  { rank: 5, name: 'Priya Patel', handle: '@priya_p', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', vdc: 18210.00, badge: 'Knowledge Seeker', country: 'IN', verified: true, scoreMetric: '95% Consistency' },
  { rank: 6, name: 'Kenji Sato', handle: '@kenji_s', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', vdc: 16950.00, badge: 'Early Explorer', country: 'JP', verified: true, scoreMetric: '91% Consistency' },
  { rank: 7, name: 'Ananya Iyer', handle: '@ananya_i', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', vdc: 15420.00, badge: 'Circle Builder', country: 'IN', verified: true, scoreMetric: '93% Consistency' },
  { rank: 8, name: 'Liam O\'Connor', handle: '@liam_oc', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', vdc: 14100.00, badge: 'Network Pillar', country: 'IE', verified: true, scoreMetric: '89% Consistency' },
];

export const LeaderboardScreen: React.FC = () => {
  const { user, navigateTo, remoteLeaderboard } = useApp();
  const [scopeTab, setScopeTab] = useState<'global' | 'country' | 'friends'>('global');
  const [timeTab, setTimeTab] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [filterMetric, setFilterMetric] = useState<'earnings' | 'quiz' | 'streak' | 'community' | 'achievements'>('earnings');

  // If live Firestore users exist, map them dynamically
  const activeTop3 = remoteLeaderboard.length >= 3
    ? remoteLeaderboard.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.username,
        handle: `@${r.username.replace('@', '').toLowerCase()}`,
        avatar: r.avatarUrl || (i === 0 ? top3[0].avatar : i === 1 ? top3[1].avatar : top3[2].avatar),
        vdc: r.balance,
        badge: i === 0 ? 'Pioneer Vanguard' : i === 1 ? 'Protocol Elder' : 'Circle Anchor',
        country: r.country || 'IN',
        verified: true,
        scoreMetric: `${r.streakDays}d Streak`,
      }))
    : top3;

  const activeGeneralList = remoteLeaderboard.length > 3
    ? remoteLeaderboard.slice(3).map((r, i) => ({
        rank: i + 4,
        name: r.username,
        handle: `@${r.username.replace('@', '').toLowerCase()}`,
        avatar: r.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        vdc: r.balance,
        badge: 'Verified Pioneer',
        country: r.country || 'IN',
        verified: true,
        scoreMetric: `${r.streakDays}d Streak`,
      }))
    : generalList;

  return (
    <div className="w-full flex-1 px-4 py-3 space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white tracking-wide font-sans">
            Global Leaderboard
          </h1>
          <span className="text-[11px] font-mono text-[#FFB86C]">
            Verified Participation Rankings
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Worldwide</span>
        </div>
      </div>

      <div className="flex rounded-xl bg-[#111420] p-1 border border-white/10 text-xs">
        <button
          onClick={() => setScopeTab('global')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            scopeTab === 'global' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setScopeTab('country')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            scopeTab === 'country' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Country (IN)
        </button>
        <button
          onClick={() => setScopeTab('friends')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            scopeTab === 'friends' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Friends
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0 font-mono text-[11px]">
          <button
            onClick={() => setTimeTab('weekly')}
            className={`px-2 py-0.5 rounded-lg ${timeTab === 'weekly' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeTab('monthly')}
            className={`px-2 py-0.5 rounded-lg ${timeTab === 'monthly' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeTab('all')}
            className={`px-2 py-0.5 rounded-lg ${timeTab === 'all' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
          >
            All-Time
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(['earnings', 'quiz', 'streak', 'community', 'achievements'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterMetric(f)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono capitalize transition-all border ${
                filterMetric === f
                  ? 'bg-[#FF9933]/20 border-[#FF9933] text-[#FFB86C] font-bold'
                  : 'bg-[#10121A] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="pt-3 pb-1 grid grid-cols-3 gap-2 items-end select-none">
        {/* 2nd Place */}
        <div className="p-3 rounded-2xl bg-[#111422] border border-slate-400/30 flex flex-col items-center text-center relative pt-5">
          <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-slate-300 text-black text-[10px] font-extrabold font-mono shadow-md">
            🥈 #2
          </span>
          <img
            src={activeTop3[1].avatar}
            alt={activeTop3[1].name}
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-md"
          />
          <span className="text-xs font-bold text-white mt-1.5 truncate max-w-full">
            {activeTop3[1].name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{activeTop3[1].handle}</span>
          <span className="text-xs font-mono font-extrabold text-slate-200 mt-1">
            {activeTop3[1].vdc.toLocaleString()} VDC
          </span>
        </div>

        {/* 1st Place */}
        <div className="p-3.5 rounded-3xl bg-gradient-to-b from-[#241A10] to-[#14121A] border-2 border-[#FF9933] flex flex-col items-center text-center relative pt-7 shadow-gold-glow-lg -translate-y-2">
          <span className="absolute -top-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFB86C] to-[#FF9933] text-black text-xs font-extrabold font-mono shadow-lg flex items-center gap-1">
            <Crown className="w-3 h-3" />
            🥇 #1
          </span>
          <img
            src={activeTop3[0].avatar}
            alt={activeTop3[0].name}
            className="w-15 h-15 rounded-full object-cover border-2 border-[#FF9933] shadow-gold-glow"
          />
          <span className="text-xs font-extrabold text-white mt-2 truncate max-w-full">
            {activeTop3[0].name}
          </span>
          <span className="text-[10px] text-[#FFB86C] font-mono">{activeTop3[0].handle}</span>
          <span className="text-sm font-mono font-extrabold text-[#FF9933] mt-1 text-gold-glow">
            {activeTop3[0].vdc.toLocaleString()} VDC
          </span>
        </div>

        {/* 3rd Place */}
        <div className="p-3 rounded-2xl bg-[#111422] border border-amber-700/40 flex flex-col items-center text-center relative pt-5">
          <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold font-mono shadow-md">
            🥉 #3
          </span>
          <img
            src={activeTop3[2].avatar}
            alt={activeTop3[2].name}
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-600 shadow-md"
          />
          <span className="text-xs font-bold text-white mt-1.5 truncate max-w-full">
            {activeTop3[2].name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{activeTop3[2].handle}</span>
          <span className="text-xs font-mono font-extrabold text-amber-200 mt-1">
            {activeTop3[2].vdc.toLocaleString()} VDC
          </span>
        </div>
      </div>

      {/* Sticky User Rank Card (#128) */}
      <div 
        onClick={() => navigateTo('profile')}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1710] to-[#101422] border border-[#FF9933]/50 shadow-gold-glow flex items-center justify-between cursor-pointer hover:border-[#FF9933] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] flex items-center justify-center font-extrabold text-sm font-mono">
            #{user.globalRank}
          </div>

          <div className="relative">
            <img
              src={user.avatarUrl}
              alt="You"
              className="w-9 h-9 rounded-full object-cover border border-[#FF9933]"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
              <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 fill-black" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">You ({user.username})</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FF9933]/20 text-[#FFB86C]">
                PIONEER
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
              <ChevronUp className="w-3 h-3" />
              <span>+{user.rankDeltaToday} positions today</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-[#FF9933] font-mono text-gold-glow">
            {user.balance.toFixed(2)} VDC
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Verified Score</div>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Ranks #4 - #{activeGeneralList.length + 3}
        </h3>

        <div className="space-y-2">
          {activeGeneralList.map(u => (
            <div
              key={u.rank}
              className="p-3 rounded-2xl bg-[#111420] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-bold text-xs text-slate-400">
                  #{u.rank}
                </span>
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{u.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{u.handle}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {u.badge} • {u.scoreMetric}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-white font-mono">
                  {u.vdc.toLocaleString()} VDC
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
