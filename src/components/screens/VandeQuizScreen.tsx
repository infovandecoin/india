import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Lightbulb,
  Award
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { QuizQuestion } from '../../types';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does a blockchain primarily provide?',
    options: [
      'A decentralized ledger',
      'A social media network',
      'A physical mining machine',
      'A centralized database'
    ],
    correctIndex: 0,
    explanation: 'A blockchain is fundamentally a decentralized, immutable ledger distributed across independent network nodes, ensuring cryptographic transparency without central intermediaries.',
    vdcReward: 5.00
  },
  {
    id: 2,
    question: 'How does VandeCoin avoid energy-intensive mining waste?',
    options: [
      'By running Proof-of-Work computations overnight',
      'By utilizing Proof-of-Participation and verified human presence',
      'By purchasing external computing power from big tech',
      'By requiring users to keep mobile screens turned on permanently'
    ],
    correctIndex: 1,
    explanation: 'VandeCoin leverages lightweight Proof-of-Participation (PoP), replacing energy-wasting hashing loops with genuine daily engagement and network validation.',
    vdcReward: 5.00
  },
  {
    id: 3,
    question: 'What is the primary role of your VandeCircle?',
    options: [
      'Trading volatile crypto derivatives with peers',
      'Establishing a mutual web of social trust and validator security',
      'Borrowing high-interest loans from strangers',
      'Automating bot clicks on third-party websites'
    ],
    correctIndex: 1,
    explanation: 'VandeCircles create sybil-resistant decentralized trust graphs, strengthening network security through verified interpersonal relationships.',
    vdcReward: 5.00
  },
  {
    id: 4,
    question: 'What is a smart contract in decentralized ecosystems?',
    options: [
      'A legal PDF signed with a digital pen',
      'Self-executing code stored on-chain that runs when terms are met',
      'An agreement between internet service providers',
      'A hardware chip built into high-end phones'
    ],
    correctIndex: 1,
    explanation: 'Smart contracts are immutable programs deployed to a blockchain network that execute deterministic actions automatically when specified parameters are fulfilled.',
    vdcReward: 5.00
  },
  {
    id: 5,
    question: 'Why is non-custodial key ownership important in Web3?',
    options: [
      'It grants users sovereign ownership over their identity and assets',
      'It allows banks to lock funds during maintenance',
      'It makes passwords public to all network users',
      'It limits user logins to a single IP address'
    ],
    correctIndex: 0,
    explanation: 'Non-custodial architecture ensures you maintain cryptographic custody of your private credentials, eliminating single points of corporate failure.',
    vdcReward: 5.00
  }
];

export const VandeQuizScreen: React.FC = () => {
  const { navigateBack, submitQuizScore, showToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [accumulatedVdc, setAccumulatedVdc] = useState(0);

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playQuizSuccess();
      setCorrectCount(prev => prev + 1);
      setAccumulatedVdc(prev => prev + currentQ.vdcReward);
      showToast(`Correct! +${currentQ.vdcReward.toFixed(2)} VDC Earned`, 'gold');
    } else {
      sounds.playQuizWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore = correctCount + 4;
      const finalVdc = Math.min(50, accumulatedVdc + 20);
      submitQuizScore(finalScore, finalVdc);
    }
  };

  return (
    <div className="w-full flex-1 px-4 py-3 space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={navigateBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide font-sans">
            VandeQuiz
          </h1>
          <span className="text-[11px] font-mono text-[#FFB86C]">
            Blockchain & Technology
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-xl border border-white/10">
          <Clock className="w-3 h-3 text-[#FF9933]" />
          <span>0:45</span>
        </div>
      </div>

      {/* Question Counter & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of 10
          </span>
          <span className="text-[#FF9933] font-bold">+{currentQ.vdcReward.toFixed(2)} VDC</span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#FF9933] to-[#F59E0B] transition-all duration-500 shadow-gold-glow"
            style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 rounded-3xl glass-panel-elevated border border-white/15 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>TODAY'S QUIZ</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
          "{currentQ.question}"
        </h2>
      </div>

      {/* Four Large Answer Cards */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let cardStyle = 'bg-[#121522] border-white/10 hover:border-white/20 text-slate-200';

          if (isAnswered) {
            if (isCorrect) {
              cardStyle = 'bg-[#122A1E] border-emerald-500 text-emerald-200 shadow-lg ring-1 ring-emerald-500';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-[#2A151A] border-rose-500 text-rose-200 ring-1 ring-rose-500';
            } else {
              cardStyle = 'bg-[#0E111A] border-white/5 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 active:scale-99 cursor-pointer ${cardStyle}`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-colors ${
                  isAnswered && isCorrect
                    ? 'bg-emerald-500 text-black'
                    : isAnswered && isSelected && !isCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {optionLetters[idx]}
              </div>

              {/* Option Text */}
              <div className="flex-1 text-xs sm:text-sm font-medium pt-0.5 leading-snug">
                {option}
              </div>

              {/* Status Icons */}
              {isAnswered && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Educational Explanation */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-cyan-500/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>CONCEPT EXPLANATION</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#FF9933]">
              {selectedOption === currentQ.correctIndex ? '+5.00 VDC Reward' : '+0 VDC'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentQ.explanation}
          </p>

          <button
            onClick={handleNextQuestion}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-[#FF9933] text-black font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
          >
            <span>{currentIndex < questions.length - 1 ? 'NEXT QUESTION' : 'VIEW FINAL RESULTS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
