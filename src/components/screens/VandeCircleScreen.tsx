import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  X, 
  Search, 
  ArrowLeft, 
  Users 
} from 'lucide-react';

export const VandeCircleScreen: React.FC = () => {
  const { 
    user, 
    circleMembers, 
    navigateBack, 
    showToast,
    isInviteModalOpen,
    setInviteModalOpen,
    addCirclePeer 
  } = useApp();

  const [inviteSearch, setInviteSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const sampleSuggested = [
    { name: 'Aarav Sharma', handle: '@aarav_vdc' },
    { name: 'Priya Patel', handle: '@priya_p' },
    { name: 'Kavita Menon', handle: '@kavita_m' },
    { name: 'Rohan Gupta', handle: '@rohan_g' },
  ];

  const handleAddMember = async (handle: string) => {
    if (!handle.trim()) {
      showToast('Please enter a VandeID handle or code', 'info');
      return;
    }
    setIsAdding(true);
    const result = await addCirclePeer(handle.trim());
    setIsAdding(false);
    if (result.success) {
      setInviteSearch('');
      setInviteModalOpen(false);
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
          VandeCircle
        </h1>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="p-2 rounded-xl bg-[#FF9933]/15 hover:bg-[#FF9933]/25 border border-[#FF9933]/30 text-[#FF9933] transition-all"
          title="Add trusted member"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center px-2">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Build Your Circle
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
          Connect with trusted peers to establish mutual validator security and increase your mining rate.
        </p>
      </div>

      {/* Orbital Trust Graph */}
      <div className="relative w-full py-4 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 rounded-full flex items-center justify-center select-none">
          <div className="absolute inset-0 rounded-full border border-purple-500/20 border-dashed animate-spin-reverse" />
          <div className="absolute inset-6 rounded-full border border-[#FF9933]/25" />
          <div className="absolute inset-14 rounded-full border border-cyan-500/15" />

          {/* Center: Current User Hub */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FF9933] via-purple-500 to-cyan-400 shadow-gold-glow">
              <img
                src={user.avatarUrl}
                alt="You"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#0A0C14]"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-black" />
              </span>
            </div>
            <span className="text-[11px] font-bold text-white mt-1">You</span>
            <span className="text-[9px] font-mono text-[#FF9933] font-semibold">{user.circleStrengthPercent}% Trust</span>
          </div>

          {/* Connected Peripheral Circle Members orbiting */}
          {circleMembers.slice(0, 8).map((member, index) => {
            const angle = (index / Math.max(1, circleMembers.length)) * 2 * Math.PI - Math.PI / 2;
            const radius = 98;
            const x = Math.round(Math.cos(angle) * radius);
            const y = Math.round(Math.sin(angle) * radius);

            return (
              <div
                key={member.id}
                className="absolute z-20 flex flex-col items-center transition-transform duration-500"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div className="relative p-0.5 rounded-full bg-[#1A1F30] border border-[#FF9933]/40 shadow-md">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                </div>
                <span className="text-[9px] font-mono text-slate-300 font-medium max-w-[50px] truncate text-center mt-0.5">
                  {member.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circle Stats Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Trust Network</div>
          <div className="text-base font-bold text-white font-mono mt-1">
            {user.circleMembersCount} / {user.circleMaxMembers}
          </div>
          <div className="text-[10px] text-slate-500">Verified Peers</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Circle Strength</div>
          <div className="text-base font-bold text-emerald-400 font-mono mt-1">
            {user.circleStrengthPercent}%
          </div>
          <div className="text-[10px] text-slate-500">Sybil Resistance</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#111420] border border-white/10 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Bonus Rate</div>
          <div className="text-base font-bold text-[#FF9933] font-mono mt-1">
            +{(Math.min(user.circleMembersCount, 5) * 0.02).toFixed(2)}/h
          </div>
          <div className="text-[10px] text-slate-500">Mining Boost</div>
        </div>
      </div>

      {/* Member List Section */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Connected Members ({circleMembers.length})
          </h3>
          <button
            onClick={() => setInviteModalOpen(true)}
            className="text-xs text-[#FFB86C] font-semibold hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {circleMembers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#111420] border border-white/10 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300">No circle members yet.</p>
            <p className="text-[11px] text-slate-500">Add trusted peers to increase your mining speed by up to +0.10 VDC/h!</p>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#FF9933] text-black text-xs font-bold"
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {circleMembers.map(member => (
              <div
                key={member.id}
                className="p-3 rounded-2xl bg-[#111420] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{member.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{member.username}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">Trust {member.trustScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-[#FF9933]">
                    +{member.contributionPerHour.toFixed(2)}/h
                  </span>
                  <div className="text-[9px] text-slate-500">VDC boost</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-slate-400 text-xs">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <span className="text-slate-300 font-semibold">Vande Trust Protocol:</span> Rewards are based on eligible, genuine participation. Fake, bot, or duplicate accounts are systematically filtered to protect network integrity.
        </p>
      </div>

      {/* Add Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#141826] border border-white/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FF9933]" />
                <h3 className="text-sm font-bold text-white">Add Trusted Peer</h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter any pioneer's VandeID handle (e.g. @aarav_vdc) or referral code to link them to your inner trust circle.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inviteSearch}
                  onChange={e => setInviteSearch(e.target.value)}
                  placeholder="Enter @handle or code..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D101A] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF9933]"
                />
              </div>
              <button
                onClick={() => handleAddMember(inviteSearch)}
                disabled={isAdding}
                className="px-4 py-2 rounded-xl bg-[#FF9933] text-black font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Suggested Pioneers</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {sampleSuggested.map(s => (
                  <div
                    key={s.handle}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.handle}</div>
                    </div>
                    <button
                      onClick={() => handleAddMember(s.handle)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#FF9933] hover:text-black text-white text-[11px] font-semibold transition-all"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
