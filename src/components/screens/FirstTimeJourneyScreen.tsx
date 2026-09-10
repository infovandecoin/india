import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Gift, 
  ChevronRight 
} from 'lucide-react';
import { VdcCoin } from '../../assets/VdcLogo';

export const FirstTimeJourneyScreen: React.FC = () => {
  const { 
    user, 
    setupTasks, 
    claimWelcomeReward, 
    navigateTo, 
    navigateBack, 
    setActiveTab 
  } = useApp();

  const isAllComplete = user.setupTasksCompleted >= user.setupTasksTotal;

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
          Setup Journey
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-5 rounded-3xl glass-panel-gold border border-[#FF9933]/40 text-center space-y-3 relative overflow-hidden">
        {/* Subtle background coin watermark */}
        <div className="absolute -right-6 -top-6 w-32 h-32 opacity-15 pointer-events-none filter blur-[0.5px]">
          <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
        </div>

        <div className="inline-flex p-2 rounded-2xl bg-[#FF9933]/15 border border-[#FF9933]/30 shadow-gold-glow">
          <VdcCoin size={68} glow={false} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Welcome to VandeCoin
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#009944] uppercase font-bold mt-0.5">
            BUILT FOR A BRIGHTER INDIA
          </p>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            Complete your founding pioneer checklist to claim your starter ecosystem reward.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#0F121C] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">VandeCoin Setup</span>
            <span className="text-[#FFB86C] font-extrabold">
              {user.setupTasksCompleted} / {user.setupTasksTotal}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#FF9933] to-[#F59E0B] transition-all duration-700 shadow-gold-glow"
              style={{ width: `${(user.setupTasksCompleted / user.setupTasksTotal) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={claimWelcomeReward}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#F59E0B] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>+25 VDC WELCOME REWARD {isAllComplete ? '(CLAIMED)' : '(CLAIM NOW)'}</span>
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1">
          Pioneer Setup Milestones
        </h3>

        <div className="space-y-2">
          {setupTasks.map(task => (
            <div
              key={task.id}
              onClick={() => task.actionRoute && navigateTo(task.actionRoute)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                task.completed
                  ? 'bg-[#121824] border-emerald-500/30'
                  : 'bg-[#111420] border-white/10 hover:border-[#FF9933]/50 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div>
                  <div className={`text-xs font-bold ${task.completed ? 'text-white' : 'text-slate-200'}`}>
                    {task.id}. {task.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {task.description}
                  </div>
                </div>
              </div>

              {!task.completed && task.actionRoute && (
                <ChevronRight className="w-4 h-4 text-[#FF9933] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setActiveTab('home')}
        className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all"
      >
        GO TO HOME DASHBOARD
      </button>
    </div>
  );
};
