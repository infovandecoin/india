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
    setInviteModalOpen 
  } = useApp();

  const [inviteSearch, setInviteSearch] = useState('');

  const sampleContacts = [
    { name: 'Kavita Menon', handle: '@kavita_m', phone: '+91 98201 •••••' },
    { name: 'David Miller', handle: '@david_m', phone: '+1 415 555 ••••' },
    { name: 'Vikram Joshi', handle: '@vikram_j', phone: '+91 99882 •••••' },
    { name: 'Zainab Al-Mansoor', handle: '@zainab_vdc', phone: '+971 50 •••••••' },
  ];

  const handleSendInvite = (name: string) => {
    setInviteModalOpen(false);
    showToast(`Circle invitation sent to ${name}!`, 'gold');
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
          title="Invite trusted member"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center px-2">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Build Your Circle
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
          Connect with people you trust and grow the VandeCoin community.
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
            <span className="text-[9px] font-mono text-[#FF9933] font-semibold">82% Trust</span>
          </div>

          {/* Connected Peripheral Circle Members orbiting */}
          {circleMembers.slice(0, 8).map((member, index) => {
            const angle = (index / 8) * 2 * Math.PI - Math.PI / 2;
            const radius = 98;
            const x = Math.round(Math.cos(angle) * radius);
            const y = Math.round(Math.sin(angle) * radius);

            return (
              <div
                key={member.id}
                onClick={() => {
                  showToast(`${member.name} contributes +${member.contributionPerHour.toFixed(2)} VDC/h`, 'info');
                }}
                className="absolute cursor-pointer group transition-transform hover:scale-125 z-10"
                style={{ transform: `translate(${x}px, ${y}px)` }}
                title={`${member.name} (${member.status})`}
              >
                <div className="relative p-0.5 rounded-full bg-[#181C2B] border border-white/20 group-hover:border-[#FF9933] shadow-md transition-all">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {member.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300">Circle Strength:</span>
            <span className="text-purple-300 font-bold">{user.circleStrengthPercent}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="text-white font-bold">{user.circleMembersCount} / {user.circleMaxMembers}</span>
            <span className="text-slate-400">Members</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setInviteModalOpen(true)}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-98 transition-all"
      >
        <UserPlus className="w-4 h-4" />
        <span>INVITE TO CIRCLE</span>
      </button>

      <div className="p-4 rounded-2xl glass-panel-gold border border-[#FF9933]/30 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Circle Rewards
          </div>
          <div className="text-xl font-extrabold text-[#FF9933] font-mono text-gold-glow mt-0.5">
            +{user.circleEarningsToday.toFixed(2)} VDC
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Rewards earned from your active circle members
          </p>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/40">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Circle Members ({circleMembers.length} / 10)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">2 Slots Available</span>
        </div>

        <div className="space-y-2">
          {circleMembers.map(member => (
            <div
              key={member.id}
              className="p-3 rounded-2xl bg-[#121522] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/15"
                  />
                  {member.verified && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#08090C]">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-black" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{member.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{member.username}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Trust {member.trustScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#FF9933] font-mono">
                  +{member.contributionPerHour.toFixed(3)}/h
                </span>
                <div className="text-[10px] text-slate-500 font-mono">VDC rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-slate-400 text-xs">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <span className="text-slate-300 font-semibold">Vande Trust Protocol:</span> Rewards are based on eligible, genuine participation. Fake, bot, or duplicate accounts are systematically filtered to protect network integrity.
        </p>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#141826] border border-white/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FF9933]" />
                <h3 className="text-sm font-bold text-white">Add Trusted Member</h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select from your verified contacts or enter a VandeID to send an endorsement request.
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={inviteSearch}
                onChange={e => setInviteSearch(e.target.value)}
                placeholder="Search by name or @VandeID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D101A] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF9933]"
              />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sampleContacts.map(contact => (
                <div
                  key={contact.handle}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{contact.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{contact.handle} • {contact.phone}</div>
                  </div>
                  <button
                    onClick={() => handleSendInvite(contact.name)}
                    className="px-3 py-1 rounded-lg bg-[#FF9933] text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    Invite
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setInviteModalOpen(false);
                showToast('Invite link shared!', 'info');
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/15"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite Link Via WhatsApp / SMS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
