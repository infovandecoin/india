import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBar } from './StatusBar';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../common/Toast';
import { 
  Volume2, 
  VolumeX, 
  Layers, 
  ChevronDown
} from 'lucide-react';
import { ScreenRoute } from '../../types';
import { VdcLogo } from '../../assets/VdcLogo';
import { isNativePlatform } from '../../services/native';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { 
    deviceModel, 
    setDeviceModel, 
    soundEnabled, 
    toggleSound, 
    toasts, 
    activeRoute, 
    navigateTo
  } = useApp();

  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false);

  const screens: { id: ScreenRoute; label: string }[] = [
    { id: 'home', label: '1. Home Dashboard' },
    { id: 'mining', label: '2. Dedicated Daily Mining' },
    { id: 'earn', label: '3. Earn Hub' },
    { id: 'community', label: '4. Community Hub' },
    { id: 'leaderboard', label: '5. Leaderboard' },
    { id: 'profile', label: '6. Profile & Verification' },
    { id: 'circle', label: '7. VandeCircle Trust Graph' },
    { id: 'referral', label: '8. Referral Network' },
    { id: 'streaks', label: '9. Streaks & 30-Day Calendar' },
    { id: 'quiz', label: '10. VandeQuiz Arena' },
    { id: 'quiz-result', label: '11. Quiz Complete & Rewards' },
    { id: 'achievements', label: '12. Achievements (18/50)' },
    { id: 'rewards', label: '13. Rewards Center & Ledger' },
    { id: 'security', label: '14. Security & Passkey' },
    { id: 'notifications', label: '15. Notification Center' },
    { id: 'onboarding', label: '16. 4-Screen Onboarding' },
    { id: 'auth', label: '17. Login / Register' },
    { id: 'setup-journey', label: '18. Setup Journey (5/7)' },
  ];

  const isFullscreen = deviceModel === 'fullscreen';

  // Native Android edge-to-edge view
  if (isNativePlatform) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden pt-safe pb-safe">
        <TopHeader />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
        <BottomNav />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050608] text-slate-100 flex flex-col items-center justify-start lg:py-6 px-0 sm:px-4 font-sans selection:bg-[#FF9933]/30">
      {/* Top Prototype Control Bar */}
      <header className="w-full max-w-5xl mb-4 px-4 py-3 rounded-2xl bg-[#0D1017]/90 border border-white/[0.08] backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-2xl z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <VdcLogo size={26} variant="mark" />
            <span className="font-bold tracking-wide text-white text-sm">
              VANDECOIN <span className="text-[#FF9933]">PROTOTYPE</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30">
              v2.4 OFFICIAL IDENTITY
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono border-l border-white/10 pl-3">
            <span className="text-slate-300">Philosophy:</span>
            <span className="text-[#FF9933] font-medium">LEARN • PARTICIPATE • EARN • BUILD</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Quick Jump Screen Selector */}
          <div className="relative">
            <button
              onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161B29] border border-[#FF9933]/30 text-xs font-semibold text-[#FFB86C] hover:border-[#FF9933] transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="font-mono">Jump: {activeRoute.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isScreenMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto rounded-2xl bg-[#121624] border border-white/15 p-2 shadow-2xl z-50 backdrop-blur-2xl"
                onMouseLeave={() => setIsScreenMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>ALL 18 SCREENS</span>
                  <span className="text-[#FF9933]">Tap to test</span>
                </div>
                {screens.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      navigateTo(s.id);
                      setIsScreenMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                      activeRoute === s.id
                        ? 'bg-[#FF9933]/20 text-[#FF9933] font-bold border border-[#FF9933]/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{s.label}</span>
                    {activeRoute === s.id && <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] shadow-gold-glow" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              soundEnabled
                ? 'bg-[#181D2D] border-cyan-500/40 text-cyan-300'
                : 'bg-[#141724] border-white/10 text-slate-400'
            }`}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline text-[11px]">{soundEnabled ? 'FX On' : 'Muted'}</span>
          </button>

          {/* Device Model Switcher */}
          <div className="hidden sm:flex items-center bg-[#131622] rounded-xl p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setDeviceModel('iphone16')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceModel === 'iphone16' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              iPhone 16
            </button>
            <button
              onClick={() => setDeviceModel('pixel9')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceModel === 'pixel9' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pixel 9
            </button>
            <button
              onClick={() => setDeviceModel('fullscreen')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceModel === 'fullscreen' ? 'bg-[#FF9933] text-black font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Screen
            </button>
          </div>
        </div>
      </header>

      {/* Main Container / Device Simulator Shell */}
      <div className="relative w-full flex items-center justify-center flex-1">
        <div
          className={`relative transition-all duration-300 flex flex-col ${
            isFullscreen
              ? 'w-full max-w-md h-[92vh] sm:h-[860px] rounded-3xl border border-white/10 shadow-2xl bg-[#08090C] overflow-hidden'
              : deviceModel === 'iphone16'
              ? 'w-[400px] h-[844px] rounded-[52px] p-[11px] bg-gradient-to-b from-[#333742] via-[#1E222D] to-[#12151E] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/20'
              : 'w-[404px] h-[846px] rounded-[44px] p-[10px] bg-[#222634] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/15'
          }`}
        >
          {!isFullscreen && deviceModel === 'iphone16' && (
            <>
              <div className="absolute -left-[14px] top-[115px] w-[3px] h-[28px] bg-[#3B4050] rounded-l-md" />
              <div className="absolute -left-[14px] top-[160px] w-[3px] h-[48px] bg-[#3B4050] rounded-l-md" />
              <div className="absolute -left-[14px] top-[220px] w-[3px] h-[48px] bg-[#3B4050] rounded-l-md" />
              <div className="absolute -right-[14px] top-[180px] w-[3px] h-[75px] bg-[#3B4050] rounded-r-md" />
            </>
          )}

          <div
            className={`relative w-full h-full bg-[#08090C] flex flex-col overflow-hidden text-slate-100 ${
              isFullscreen ? 'rounded-3xl' : 'rounded-[42px]'
            }`}
          >
            <StatusBar />
            <TopHeader />
            <ToastContainer />

            <main className="relative flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
              {children}
            </main>

            <BottomNav />

            <div className="w-full h-4 bg-[#0A0C14] flex items-center justify-center pb-1 shrink-0 select-none">
              <div className="w-32 h-1 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-md mt-3 px-4 text-center text-slate-500 text-[11px] font-mono flex items-center justify-between pb-4">
        <span>VandeCoin (VDC) • Official Mobile Prototype</span>
        <span className="text-[#FF9933] font-semibold">1,248.65 VDC Verified</span>
      </footer>
    </div>
  );
};
