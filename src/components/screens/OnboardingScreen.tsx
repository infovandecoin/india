import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe2, 
  Zap, 
  BookOpen, 
  Users, 
  ArrowRight
} from 'lucide-react';
import { VdcLogo, VdcCoin } from '../../assets/VdcLogo';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon?: React.ElementType;
  customGraphic?: 'dark' | 'coin';
  gradient: string;
  accent: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Welcome to VandeCoin',
    subtitle: 'Built for a Brighter India • Designed for the World',
    description: 'Participate in a global digital ecosystem powered by human contribution, authentic community trust, and sustainable proof-of-presence.',
    customGraphic: 'dark',
    gradient: 'from-[#FF9933]/25 via-amber-500/10 to-transparent',
    accent: '#FF9933',
  },
  {
    id: 2,
    title: 'Participate Daily',
    subtitle: 'Zero Hardware Wear or Energy Waste',
    description: 'Complete simple daily activities and mint VDC rewards with lightweight eco-friendly proof-of-participation sessions.',
    customGraphic: 'coin',
    gradient: 'from-emerald-500/25 via-cyan-500/10 to-transparent',
    accent: '#10B981',
  },
  {
    id: 3,
    title: 'Learn & Earn',
    subtitle: 'Knowledge-First Rewarding System',
    description: 'Challenge yourself with interactive quizzes and educational experiences designed to build genuine decentralized literacy.',
    icon: BookOpen,
    gradient: 'from-cyan-500/25 via-blue-500/10 to-transparent',
    accent: '#06B6D4',
  },
  {
    id: 4,
    title: 'Build the Network',
    subtitle: 'VandeCircles & Grassroots Trust',
    description: 'Connect with your community, establish mutual trust nodes, and grow together as a founding Pioneer in the VDC ecosystem.',
    icon: Users,
    gradient: 'from-purple-500/25 via-[#FF9933]/10 to-transparent',
    accent: '#8B5CF6',
  },
];

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigateTo('auth');
    }
  };

  return (
    <div className="w-full flex-1 px-5 py-6 flex flex-col justify-between select-none relative overflow-hidden bg-gradient-to-b from-[#08090C] via-[#0E121C] to-[#08090C]">
      <div className="flex items-center justify-between z-10">
        <VdcLogo size={32} variant="full" />
        <button
          onClick={() => navigateTo('auth')}
          className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="my-auto py-6 flex flex-col items-center text-center space-y-6 z-10">
        <div className={`relative w-48 h-48 rounded-full flex items-center justify-center p-4 bg-gradient-to-tr ${slide.gradient} border border-white/10 shadow-2xl transition-all duration-500`}>
          <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow" />
          <div className="w-28 h-28 rounded-full bg-[#121624] border border-white/20 flex items-center justify-center shadow-inner overflow-hidden p-1">
            {slide.customGraphic === 'dark' ? (
              <img 
                src="/images/vdc-dark.png" 
                alt="VandeCoin 3D Emblem" 
                className="w-full h-full object-cover rounded-2xl" 
              />
            ) : slide.customGraphic === 'coin' ? (
              <VdcCoin size={96} glow={true} spin={false} />
            ) : Icon ? (
              <Icon className="w-14 h-14" style={{ color: slide.accent }} />
            ) : null}
          </div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <div className="text-[11px] font-mono tracking-widest uppercase font-semibold text-[#FFB86C]">
            {slide.subtitle}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
            {slide.title}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {slide.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#FF9933] shadow-gold-glow' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 z-10">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF9933] via-[#F59E0B] to-[#D97706] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-98 transition-all"
        >
          <span>{currentSlide === slides.length - 1 ? 'GET STARTED' : 'CONTINUE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-[10px] font-mono text-slate-500">
          LEARN • PARTICIPATE • EARN • BUILD
        </div>
      </div>
    </div>
  );
};
