import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCheck, 
  Sparkles, 
  Users, 
  Award, 
  ShieldCheck, 
  Zap, 
  ChevronRight
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { 
    notifications, 
    markAllNotificationsRead, 
    navigateBack, 
    navigateTo 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rewards': return <Sparkles className="w-4 h-4 text-[#FF9933]" />;
      case 'community': return <Users className="w-4 h-4 text-purple-400" />;
      case 'achievements': return <Award className="w-4 h-4 text-amber-400" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
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
          Notifications
        </h1>
        <button
          onClick={markAllNotificationsRead}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
          title="Mark all as read"
        >
          <CheckCheck className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['all', 'rewards', 'community', 'achievements', 'security', 'system'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all border capitalize ${
              selectedCategory === cat
                ? 'bg-[#FF9933] text-black font-bold border-[#FF9933] shadow-gold-glow'
                : 'bg-[#111420] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => item.targetRoute && navigateTo(item.targetRoute)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              item.read
                ? 'bg-[#10121A] border-white/5 opacity-80 hover:opacity-100 hover:border-white/15'
                : 'bg-[#141826] border-[#FF9933]/30 hover:border-[#FF9933]/60 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF9933] shadow-gold-glow animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-500">
                  {item.timeAgo}
                </span>
              </div>
            </div>

            {item.targetRoute && (
              <div className="flex items-center justify-end text-[11px] text-[#FFB86C] font-mono font-medium gap-1 pt-1 border-t border-white/5">
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
