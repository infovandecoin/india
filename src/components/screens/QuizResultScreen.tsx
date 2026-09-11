import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';
import { sounds } from '../../utils/audio';
import { VdcCoin } from '../../assets/VdcLogo';

export const QuizResultScreen: React.FC = () => {
  const { 
    lastQuizResult, 
    navigateTo, 
    setActiveTab 
  } = useApp();

  const score = lastQuizResult ? lastQuizResult.score : 8;
  const vdcEarned = lastQuizResult ? lastQuizResult.vdc : 10.00;
  const knowledgeScore = Math.round((score / 10) * 100);

  useEffect(() => {
    sounds.playRewardChime();
    triggerConfetti(0.5);
  }, []);

  return (
    <div className="w-full flex-1 px-4 py-4 space-y-4 pb-8 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Trophy Banner with 3D Coin */}
        <div className="p-6 rounded-3xl glass-panel-gold border border-[#FF9933]/40 text-center space-y-3 relative overflow-hidden">
          {/* Background Watermark */}
          <div className="absolute -right-8 -top-8 w-36 h-36 opacity-15 pointer-events-none filter blur-[0.5px]">
            <img src="/images/vdc-coin.png" alt="" className="w-full h-full object-contain rotate-12" />
          </div>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-[#FF9933]/20 blur-3xl pointer-events-none" />

          <div className="inline-flex p-2 rounded-3xl bg-[#FF9933]/15 border border-[#FF9933]/40 shadow-gold-glow animate-bounce">
            <VdcCoin size={88} glow={true} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Quiz Complete!
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-[#009944] uppercase font-bold mt-0.5">
              BUILT FOR A BRIGHTER INDIA
            </p>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Decentralized ecosystem knowledge verified and credited.
            </p>
          </div>

          {/* Large Metrics Stack */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0D101A]/80 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Accuracy</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                {score} / 10
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Correct Answers</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D101A]/80 border border-[#FF9933]/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Reward Earned</div>
              <div className="text-2xl font-extrabold text-[#FF9933] font-mono text-gold-glow mt-0.5">
                +{vdcEarned.toFixed(2)}
              </div>
              <div className="text-[10px] text-[#FFB86C] font-mono">VDC in Ledger</div>
            </div>
          </div>
        </div>

        {/* Knowledge Score Metric Card */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Knowledge Score: {knowledgeScore}%</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold">
              {knowledgeScore >= 80 ? 'TIER: ADVANCED' : knowledgeScore >= 50 ? 'TIER: INTERMEDIATE' : 'TIER: EXPLORER'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-[#FF9933] shadow-cyan-glow"
              style={{ width: `${knowledgeScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            You've demonstrated a strong conceptual grasp of consensus mechanisms and peer-to-peer data integrity.
          </p>
        </div>

        {/* Educational Highlights Learned */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2.5 text-xs">
          <div className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FF9933]" />
            <span>Key Takeaways Covered</span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Blockchains replace central intermediaries with mathematical consensus.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Proof-of-Participation removes power-wasting ASIC hardware dependency.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>VandeCircles anchor Sybil defense in authentic human community.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => navigateTo('rewards')}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-[#FF9933] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
        >
          <span>VIEW IN REWARDS LEDGER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('achievements')}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#141724] border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 active:scale-98 transition-all"
        >
          <Award className="w-4 h-4 text-[#FF9933]" />
          <span>VIEW ACHIEVEMENTS</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="w-full py-2.5 text-xs font-mono text-slate-400 hover:text-white text-center transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
