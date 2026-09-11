import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Lightbulb,
  Award,
  Lock
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { 
  getDailyQuizQuestions, 
  evaluateAnswer, 
  submitDailyQuiz, 
  canTakeDailyQuiz 
} from '../../services/quizService';
import { QuizQuestionPublic, QuizEvaluationResult } from '../../types';

export const VandeQuizScreen: React.FC = () => {
  const { navigateBack, submitQuizScore, showToast, authUser } = useApp();
  const currentUid = authUser?.uid || 'local_pioneer';

  const [questions, setQuestions] = useState<QuizQuestionPublic[]>([]);
  const [canPlay, setCanPlay] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<QuizEvaluationResult | null>(null);
  const [answeredHistory, setAnsweredHistory] = useState<{ questionId: number; selectedIndex: number }[]>([]);
  const [accumulatedVdc, setAccumulatedVdc] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initQuiz() {
      const available = await canTakeDailyQuiz(currentUid);
      setCanPlay(available);
      if (available) {
        setQuestions(getDailyQuizQuestions());
      }
    }
    initQuiz();
  }, [currentUid]);

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (canPlay === false) {
    return (
      <div className="w-full flex-1 px-4 py-3 space-y-4 pb-8 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide font-sans">
            VandeQuiz
          </h1>
          <div className="w-9" />
        </div>

        <div className="my-auto p-6 rounded-3xl glass-panel-gold border border-[#FF9933]/40 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center mx-auto border border-[#FF9933]/30 shadow-gold-glow">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">
              Today's Quiz Completed!
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              You have already verified your daily Web3 educational knowledge. To ensure authentic long-term learning and anti-abuse compliance, only one quiz session is permitted per calendar day.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111624] border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next Quiz Available Tomorrow (00:00 UTC)</span>
          </div>

          <button
            onClick={navigateBack}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#F59E0B] text-black font-bold text-xs hover:brightness-110 active:scale-98 transition-all"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full flex-1 flex items-center justify-center text-slate-400 font-mono text-xs">
        Loading questions bank...
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (evaluation !== null) return;
    setSelectedOption(index);

    // Authoritative answer evaluation via quizService
    const result = evaluateAnswer(currentQ.id, index);
    setEvaluation(result);
    setAnsweredHistory(prev => [...prev, { questionId: currentQ.id, selectedIndex: index }]);

    if (result.isCorrect) {
      sounds.playQuizSuccess();
      setCorrectCount(prev => prev + 1);
      setAccumulatedVdc(prev => prev + result.vdcReward);
      showToast(`Correct! +${result.vdcReward.toFixed(2)} VDC Earned`, 'gold');
    } else {
      sounds.playQuizWrong();
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setEvaluation(null);
    } else {
      // Finalize quiz attempt with authoritative server-side ledger credit
      setIsSubmitting(true);
      const submitResult = await submitDailyQuiz(currentUid, answeredHistory);
      setIsSubmitting(false);

      if (submitResult.success) {
        submitQuizScore(submitResult.score, submitResult.totalVdcEarned);
      } else {
        showToast(submitResult.error || 'Quiz completed', 'info');
        navigateBack();
      }
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
          <span>Daily</span>
        </div>
      </div>

      {/* Question Counter & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}
          </span>
          <span className="text-[#FF9933] font-bold">+{currentQ.vdcReward.toFixed(2)} VDC</span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-[#FF9933] to-[#F59E0B] transition-all duration-500 shadow-gold-glow"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 rounded-3xl glass-panel-elevated border border-white/15 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>QUESTION {currentIndex + 1}</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
          "{currentQ.question}"
        </h2>
      </div>

      {/* Four Large Answer Cards */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isAnswered = evaluation !== null;
          const isCorrect = isAnswered && idx === evaluation.correctIndex;

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
      {evaluation && (
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-cyan-500/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>CONCEPT EXPLANATION</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#FF9933]">
              {evaluation.isCorrect ? `+${evaluation.vdcReward.toFixed(2)} VDC Reward` : '+0 VDC'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {evaluation.explanation}
          </p>

          <button
            onClick={handleNextQuestion}
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-[#FF9933] text-black font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
          >
            <span>
              {isSubmitting 
                ? 'RECORDING TO LEDGER...' 
                : currentIndex < questions.length - 1 
                ? 'NEXT QUESTION' 
                : 'SUBMIT & CLAIM VDC'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
