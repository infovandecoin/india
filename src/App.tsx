import React, { useState, useEffect } from 'react';
import { initNativeApp, setupHardwareBackHandler } from './services/native';
import { AppProvider, useApp } from './context/AppContext';
import { PhoneFrame } from './components/layout/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { DailyMiningScreen } from './components/screens/DailyMiningScreen';
import { EarnHubScreen } from './components/screens/EarnHubScreen';
import { VandeCircleScreen } from './components/screens/VandeCircleScreen';
import { ReferralScreen } from './components/screens/ReferralScreen';
import { StreaksScreen } from './components/screens/StreaksScreen';
import { VandeQuizScreen } from './components/screens/VandeQuizScreen';
import { QuizResultScreen } from './components/screens/QuizResultScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { RewardsCenterScreen } from './components/screens/RewardsCenterScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SecurityCenterScreen } from './components/screens/SecurityCenterScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { FirstTimeJourneyScreen } from './components/screens/FirstTimeJourneyScreen';

// Combined Community Hub
const CommunityHub: React.FC = () => {
  const [communityTab, setCommunityTab] = useState<'circle' | 'referral'>('circle');

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="px-4 pt-3 select-none">
        <div className="flex rounded-2xl bg-[#111420] p-1 border border-white/10 text-xs">
          <button
            onClick={() => setCommunityTab('circle')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              communityTab === 'circle' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            VandeCircle (8/10)
          </button>
          <button
            onClick={() => setCommunityTab('referral')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              communityTab === 'referral' ? 'bg-[#10B981] text-black shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Invite & Network (127)
          </button>
        </div>
      </div>

      {communityTab === 'circle' ? <VandeCircleScreen /> : <ReferralScreen />}
    </div>
  );
};

const ScreenRouter: React.FC = () => {
  const { activeRoute } = useApp();

  switch (activeRoute) {
    case 'home':
      return <HomeScreen />;
    case 'earn':
      return <EarnHubScreen />;
    case 'community':
      return <CommunityHub />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'mining':
      return <DailyMiningScreen />;
    case 'circle':
      return <VandeCircleScreen />;
    case 'referral':
      return <ReferralScreen />;
    case 'streaks':
      return <StreaksScreen />;
    case 'quiz':
      return <VandeQuizScreen />;
    case 'quiz-result':
      return <QuizResultScreen />;
    case 'achievements':
      return <AchievementsScreen />;
    case 'rewards':
      return <RewardsCenterScreen />;
    case 'security':
      return <SecurityCenterScreen />;
    case 'notifications':
      return <NotificationsScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'auth':
      return <AuthScreen />;
    case 'setup-journey':
      return <FirstTimeJourneyScreen />;
    default:
      return <HomeScreen />;
  }
};

const NativeLifecycle: React.FC = () => {
  const { navigateBack, activeRoute } = useApp();

  useEffect(() => {
    initNativeApp();
  }, []);

  useEffect(() => {
    const unregister = setupHardwareBackHandler(() => {
      if (activeRoute !== 'home') {
        navigateBack();
        return true;
      }
      return false;
    });
    return unregister;
  }, [activeRoute, navigateBack]);

  return null;
};

export function App() {
  return (
    <AppProvider>
      <NativeLifecycle />
      <PhoneFrame>
        <ScreenRouter />
      </PhoneFrame>
    </AppProvider>
  );
}

export default App;
