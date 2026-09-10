import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { 
  NavigationTab, 
  ScreenRoute, 
  UserState, 
  CircleMember, 
  AchievementItem, 
  RewardTransaction, 
  AppNotification, 
  SetupTask 
} from '../types';
import { sounds } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  registerWithEmail as authRegister, 
  loginWithEmail as authLogin, 
  loginAsGuest as authGuest, 
  logoutUser as authLogout, 
  deleteAccount as authDelete, 
  subscribeToAuth, 
  AuthUserProfile 
} from '../services/authService';
import { 
  syncUserProfile, 
  updateRemoteUserState, 
  subscribeToLeaderboard, 
  RemoteLeaderboardEntry 
} from '../services/firestoreService';
import { isFirebaseConfigured } from '../services/firebase';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'gold';
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeRoute: ScreenRoute;
  navigateTo: (route: ScreenRoute) => void;
  navigateBack: () => void;
  user: UserState;
  circleMembers: CircleMember[];
  achievements: AchievementItem[];
  rewardsHistory: RewardTransaction[];
  notifications: AppNotification[];
  setupTasks: SetupTask[];
  unreadNotificationCount: number;
  deviceModel: 'iphone16' | 'pixel9' | 'fullscreen';
  setDeviceModel: (model: 'iphone16' | 'pixel9' | 'fullscreen') => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;
  toggleMining: () => void;
  claimAchievement: (id: string) => void;
  claimStreakBonus: () => void;
  submitQuizScore: (score: number, vdc: number) => void;
  lastQuizResult: { score: number; vdc: number } | null;
  copyReferralCode: () => void;
  claimWelcomeReward: () => void;
  markAllNotificationsRead: () => void;
  isInviteModalOpen: boolean;
  setInviteModalOpen: (open: boolean) => void;
  // Cloud Integration State & Actions
  authUser: AuthUserProfile | null;
  isCloudConnected: boolean;
  remoteLeaderboard: RemoteLeaderboardEntry[];
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccountAndData: () => Promise<boolean>;
}

const initialUser: UserState = {
  username: '@VandeExplorer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  balance: 1248.65,
  miningRatePerHour: 0.25,
  miningActive: true,
  sessionRemainingSeconds: 85338, // 23:42:18
  todayEarnings: 42.50,
  pendingRewards: 720.00,
  streakDays: 14,
  streakMaxDays: 30,
  streakShields: 1,
  streakBonusMultiplier: 15,
  circleMembersCount: 8,
  circleMaxMembers: 10,
  circleStrengthPercent: 82,
  circleEarningsToday: 12.50,
  referralCount: 127,
  referralActive: 94,
  referralVerified: 76,
  referralPending: 33,
  referralRewardsTotal: 386.40,
  referralCode: 'VDC-RISHI-8294',
  quizScorePercent: 82,
  quizQuestionsAnswered: 73,
  achievementsUnlocked: 18,
  totalAchievements: 50,
  globalRank: 128,
  rankDeltaToday: 4,
  xp: 2480,
  xpMax: 3000,
  levelTitle: 'Vande Pioneer',
  levelTier: 4,
  profileCompletionPercent: 85,
  isVerifiedVandeId: true,
  setupTasksCompleted: 5,
  setupTasksTotal: 7,
};

const initialCircleMembers: CircleMember[] = [
  { id: '1', name: 'Aarav Sharma', username: '@aarav_vdc', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.04, joinedDays: 38, trustScore: 96 },
  { id: '2', name: 'Ananya Iyer', username: '@ananya_i', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.04, joinedDays: 30, trustScore: 94 },
  { id: '3', name: 'Marcus Vance', username: '@marcus_v', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.035, joinedDays: 24, trustScore: 91 },
  { id: '4', name: 'Priya Patel', username: '@priya_p', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.04, joinedDays: 21, trustScore: 95 },
  { id: '5', name: 'Devendra Nair', username: '@dev_nair', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.03, joinedDays: 18, trustScore: 89 },
  { id: '6', name: 'Sophia Chen', username: '@sophia_c', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.035, joinedDays: 15, trustScore: 92 },
  { id: '7', name: 'Rohan Gupta', username: '@rohan_g', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', verified: false, status: 'active', contributionPerHour: 0.02, joinedDays: 8, trustScore: 78 },
  { id: '8', name: 'Elena Rostova', username: '@elena_vdc', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', verified: true, status: 'active', contributionPerHour: 0.04, joinedDays: 6, trustScore: 97 },
];

const initialAchievements: AchievementItem[] = [
  { id: '1', title: 'First Step', description: 'Complete your first VandeCoin session.', category: 'Ecosystem', icon: 'Sparkles', progress: 1, target: 1, rewardVdc: 5.00, unlocked: true, claimed: true },
  { id: '2', title: 'Early Explorer', description: 'Complete 7 days of participation.', category: 'Dedication', icon: 'Compass', progress: 7, target: 7, rewardVdc: 15.00, unlocked: true, claimed: true },
  { id: '3', title: 'Knowledge Seeker', description: 'Answer 100 quiz questions.', category: 'Learning', icon: 'BookOpen', progress: 73, target: 100, rewardVdc: 25.00, unlocked: false, claimed: false },
  { id: '4', title: 'Circle Builder', description: 'Create an active VandeCircle with trusted members.', category: 'Community', icon: 'Users', progress: 8, target: 5, rewardVdc: 20.00, unlocked: true, claimed: true },
  { id: '5', title: 'Community Champion', description: 'Reach 100 eligible active referrals.', category: 'Community', icon: 'Award', progress: 76, target: 100, rewardVdc: 75.00, unlocked: false, claimed: false },
  { id: '6', title: '30-Day Legend', description: 'Maintain a continuous 30-day streak.', category: 'Dedication', icon: 'Flame', progress: 14, target: 30, rewardVdc: 150.00, unlocked: false, claimed: false },
  { id: '7', title: 'Quiz Master', description: 'Achieve 90%+ accuracy over a defined quiz period.', category: 'Learning', icon: 'Trophy', progress: 82, target: 90, rewardVdc: 50.00, unlocked: false, claimed: false },
  { id: '8', title: 'Security Guardian', description: 'Enable Passkey, 2FA, and verified recovery phrase.', category: 'Ecosystem', icon: 'ShieldCheck', progress: 3, target: 3, rewardVdc: 30.00, unlocked: true, claimed: false },
];

const initialRewardsHistory: RewardTransaction[] = [
  { id: 'tx-1', title: 'Daily Participation Session', activity: 'Daily Mining Proof-of-Participation', amount: 18.00, timestamp: 'Today, 09:30 AM', status: 'completed', category: 'mining' },
  { id: 'tx-2', title: 'Blockchain Fundamentals Quiz', activity: 'Daily VandeQuiz 8/10 Score', amount: 10.00, timestamp: 'Today, 11:15 AM', status: 'completed', category: 'quiz' },
  { id: 'tx-3', title: '14-Day Streak Milestone', activity: 'Streak bonus payout', amount: 5.00, timestamp: 'Today, 12:00 PM', status: 'completed', category: 'streak' },
  { id: 'tx-4', title: 'Circle Collective Contribution', activity: '8 active trusted circle peers', amount: 4.50, timestamp: 'Today, 01:20 PM', status: 'completed', category: 'circle' },
  { id: 'tx-5', title: 'Early Explorer Achievement', activity: 'Achievement milestone claimed', amount: 5.00, timestamp: 'Today, 02:00 PM', status: 'completed', category: 'achievement' },
  { id: 'tx-6', title: 'Network Expansion Bonus', activity: 'Referral verification (tier 2)', amount: 45.00, timestamp: 'Yesterday', status: 'completed', category: 'referral' },
  { id: 'tx-7', title: 'Ecosystem Reserve Allotment', activity: 'Network validator tier qualification', amount: 720.00, timestamp: 'Pending verification', status: 'pending', category: 'welcome' },
];

const initialNotifications: AppNotification[] = [
  { id: 'n1', title: 'Streak Active', message: 'Your 14-day streak is active. Keep participating every day to reach Day 30!', timeAgo: '10m ago', category: 'rewards', read: false, targetRoute: 'streaks' },
  { id: 'n2', title: 'Quiz Reward Earned', message: 'You earned +10 VDC from today\'s Blockchain & Technology quiz.', timeAgo: '2h ago', category: 'rewards', read: false, targetRoute: 'rewards' },
  { id: 'n3', title: 'VandeCircle Milestone', message: 'Your VandeCircle reached 8 active members. Collective rate increased!', timeAgo: '4h ago', category: 'community', read: false, targetRoute: 'circle' },
  { id: 'n4', title: 'Achievement Unlocked', message: 'You unlocked "Knowledge Seeker" milestone progress: 73/100.', timeAgo: '1d ago', category: 'achievements', read: true, targetRoute: 'achievements' },
  { id: 'n5', title: 'Mining Session Ready', message: 'Your daily mining session is active. Current speed: +0.25 VDC/h.', timeAgo: '1d ago', category: 'system', read: true, targetRoute: 'mining' },
  { id: 'n6', title: 'Account Protected', message: 'Biometric passkey verified on iPhone 16 Pro.', timeAgo: '3d ago', category: 'security', read: true, targetRoute: 'security' },
];

const initialSetupTasks: SetupTask[] = [
  { id: 1, title: 'Create VandeID Username', description: 'Your global decentralized identity handle: @VandeExplorer', completed: true },
  { id: 2, title: 'Secure Account', description: 'Enable Passkey & biometric verification', completed: true, actionRoute: 'security' },
  { id: 3, title: 'Start First Mining Session', description: 'Activate eco-friendly proof-of-participation', completed: true, actionRoute: 'mining' },
  { id: 4, title: 'Complete First Quiz', description: 'Pass your first blockchain educational quiz', completed: true, actionRoute: 'quiz' },
  { id: 5, title: 'Create VandeCircle', description: 'Build your inner trust network with 5+ members', completed: true, actionRoute: 'circle' },
  { id: 6, title: 'Invite First Friend', description: 'Share your code VDC-RISHI-8294 with a friend', completed: false, actionRoute: 'referral' },
  { id: 7, title: 'Unlock First Milestone Achievement', description: 'Claim your initial Explorer badge', completed: false, actionRoute: 'achievements' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [activeRoute, setActiveRoute] = useState<ScreenRoute>('home');
  const [history, setHistory] = useState<ScreenRoute[]>(['home']);
  const [user, setUser] = useState<UserState>(initialUser);
  const [circleMembers] = useState<CircleMember[]>(initialCircleMembers);
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [rewardsHistory, setRewardsHistory] = useState<RewardTransaction[]>(initialRewardsHistory);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [setupTasks, setSetupTasks] = useState<SetupTask[]>(initialSetupTasks);
  const [deviceModel, setDeviceModel] = useState<'iphone16' | 'pixel9' | 'fullscreen'>('iphone16');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; vdc: number } | null>(null);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUserProfile | null>(null);
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<RemoteLeaderboardEntry[]>([]);

  // Real-time Firebase Auth Subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuth((profile) => {
      setAuthUser(profile);
      if (profile) {
        if (profile.displayName) {
          setUser(prev => ({ ...prev, username: profile.displayName || prev.username }));
        }
        // Fetch or create user in Cloud Firestore
        syncUserProfile(profile.uid, user).then(remoteData => {
          if (remoteData) {
            setUser(prev => ({ ...prev, ...remoteData }));
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Cloud Firestore Leaderboard Listener
  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        setRemoteLeaderboard(entries);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cloud Firestore Sync: Update remote document when critical state changes
  useEffect(() => {
    if (!authUser?.uid) return;
    const timeout = setTimeout(() => {
      updateRemoteUserState(authUser.uid, {
        balance: user.balance,
        streakDays: user.streakDays,
        miningActive: user.miningActive,
        xp: user.xp,
        quizScorePercent: user.quizScorePercent,
        achievementsUnlocked: user.achievementsUnlocked,
        username: user.username,
      });
    }, 2500);
    return () => clearTimeout(timeout);
  }, [user.balance, user.streakDays, user.miningActive, user.xp, authUser?.uid]);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setUser(prev => {
        if (!prev.miningActive) return prev;
        const nextSeconds = prev.sessionRemainingSeconds > 0 ? prev.sessionRemainingSeconds - 1 : 86400;
        const microRate = (prev.miningRatePerHour / 3600);
        return {
          ...prev,
          sessionRemainingSeconds: nextSeconds,
          balance: Number((prev.balance + microRate).toFixed(5)),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Offline Persistence: Load stored data from native device storage on boot
  useEffect(() => {
    async function loadPersistedState() {
      try {
        const { value: storedUser } = await Preferences.get({ key: 'vdc_user_state' });
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(prev => ({ ...prev, ...parsed }));
        }

        const { value: storedSound } = await Preferences.get({ key: 'vdc_sound_enabled' });
        if (storedSound !== null && storedSound !== undefined) {
          const isEnabled = storedSound === 'true';
          setSoundEnabled(isEnabled);
          sounds.enabled = isEnabled;
        }
      } catch (err) {
        console.warn('Preferences load error:', err);
      }
    }
    loadPersistedState();
  }, []);

  // Offline Persistence: Save user state periodically / on updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      Preferences.set({
        key: 'vdc_user_state',
        value: JSON.stringify(user),
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(timeout);
  }, [user]);

  // Save sound settings
  useEffect(() => {
    Preferences.set({
      key: 'vdc_sound_enabled',
      value: String(soundEnabled),
    }).catch(() => {});
  }, [soundEnabled]);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
    showToast(next ? 'Sound FX Enabled' : 'Sound FX Muted', 'info');
  };

  const navigateTo = (route: ScreenRoute) => {
    sounds.playClick();
    setHistory(prev => [...prev, route]);
    setActiveRoute(route);
    if (['home', 'earn', 'community', 'leaderboard', 'profile'].includes(route)) {
      setActiveTabState(route as NavigationTab);
    }
  };

  const navigateBack = () => {
    sounds.playClick();
    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop();
      const prevRoute = nextHistory[nextHistory.length - 1];
      setHistory(nextHistory);
      setActiveRoute(prevRoute);
      if (['home', 'earn', 'community', 'leaderboard', 'profile'].includes(prevRoute)) {
        setActiveTabState(prevRoute as NavigationTab);
      }
    } else {
      setActiveRoute(activeTab);
    }
  };

  const setActiveTab = (tab: NavigationTab) => {
    sounds.playClick();
    setActiveTabState(tab);
    setActiveRoute(tab);
    setHistory([tab]);
  };

  const toggleMining = () => {
    const nextState = !user.miningActive;
    sounds.playMiningToggle(nextState);
    if (nextState) {
      triggerConfetti(0.4);
      showToast('Daily Mining Active: +0.25 VDC/h verified', 'gold');
    } else {
      showToast('Mining session paused', 'info');
    }
    setUser(prev => ({
      ...prev,
      miningActive: nextState,
    }));
  };

  const claimAchievement = (id: string) => {
    const target = achievements.find(a => a.id === id);
    if (!target || target.claimed) return;
    sounds.playRewardChime();
    triggerConfetti(0.5);
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, claimed: true, unlocked: true } : a));
    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + target.rewardVdc).toFixed(2)),
      todayEarnings: Number((prev.todayEarnings + target.rewardVdc).toFixed(2)),
      xp: Math.min(prev.xpMax, prev.xp + 150),
    }));
    setRewardsHistory(prev => [
      {
        id: `tx-claim-${Date.now()}`,
        title: `${target.title} Unlocked`,
        activity: 'Achievement reward claimed',
        amount: target.rewardVdc,
        timestamp: 'Just now',
        status: 'completed',
        category: 'achievement'
      },
      ...prev,
    ]);
    showToast(`Claimed +${target.rewardVdc.toFixed(2)} VDC & +150 XP!`, 'gold');
  };

  const claimStreakBonus = () => {
    sounds.playRewardChime();
    triggerConfetti(0.5);
    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + 5.00).toFixed(2)),
      todayEarnings: Number((prev.todayEarnings + 5.00).toFixed(2)),
    }));
    showToast('Daily Streak bonus +5.00 VDC added to balance!', 'gold');
  };

  const submitQuizScore = (score: number, vdc: number) => {
    setLastQuizResult({ score, vdc });
    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + vdc).toFixed(2)),
      todayEarnings: Number((prev.todayEarnings + vdc).toFixed(2)),
      quizScorePercent: Math.round((prev.quizScorePercent * 3 + score * 10) / 4),
      quizQuestionsAnswered: prev.quizQuestionsAnswered + 10,
      xp: Math.min(prev.xpMax, prev.xp + 200),
    }));
    setRewardsHistory(prev => [
      {
        id: `tx-quiz-${Date.now()}`,
        title: 'Daily VandeQuiz Completed',
        activity: `${score}/10 correct questions reward`,
        amount: vdc,
        timestamp: 'Just now',
        status: 'completed',
        category: 'quiz'
      },
      ...prev
    ]);
    navigateTo('quiz-result');
  };

  const copyReferralCode = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode);
    }
    showToast(`Referral code ${user.referralCode} copied to clipboard!`, 'gold');
  };

  const claimWelcomeReward = () => {
    sounds.playRewardChime();
    triggerConfetti(0.4);
    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + 25.00).toFixed(2)),
      todayEarnings: Number((prev.todayEarnings + 25.00).toFixed(2)),
      setupTasksCompleted: 7,
      xp: Math.min(prev.xpMax, prev.xp + 300),
    }));
    setSetupTasks(prev => prev.map(t => ({ ...t, completed: true })));
    setRewardsHistory(prev => [
      {
        id: `tx-welcome-${Date.now()}`,
        title: 'Welcome to VandeCoin Reward',
        activity: 'Completed 7/7 onboarding ecosystem setup',
        amount: 25.00,
        timestamp: 'Just now',
        status: 'completed',
        category: 'welcome'
      },
      ...prev
    ]);
    showToast('🎉 +25.00 VDC Welcome Reward credited!', 'gold');
  };

  const markAllNotificationsRead = () => {
    sounds.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      const profile = await authLogin(email, pass);
      setAuthUser(profile);
      setUser(prev => ({ ...prev, username: profile.displayName || email.split('@')[0] }));
      showToast('Signed in successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'info');
      return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string): Promise<boolean> => {
    try {
      const profile = await authRegister(email, pass, name);
      setAuthUser(profile);
      setUser(prev => ({ ...prev, username: name || profile.displayName || '@Pioneer' }));
      showToast('Account created successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'info');
      return false;
    }
  };

  const loginAsGuest = async (): Promise<boolean> => {
    try {
      const profile = await authGuest();
      setAuthUser(profile);
      showToast('Signed in as Guest Pioneer', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Guest sign in failed', 'info');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authLogout();
    setAuthUser(null);
    showToast('Logged out', 'info');
  };

  const deleteAccountAndData = async (): Promise<boolean> => {
    try {
      await authDelete();
      setAuthUser(null);
      await Preferences.remove({ key: 'vdc_user_state' });
      setUser(initialUser);
      showToast('Account & local data deleted', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Account deletion failed', 'info');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeRoute,
        navigateTo,
        navigateBack,
        user,
        circleMembers,
        achievements,
        rewardsHistory,
        notifications,
        setupTasks,
        unreadNotificationCount,
        deviceModel,
        setDeviceModel,
        soundEnabled,
        toggleSound,
        toasts,
        showToast,
        toggleMining,
        claimAchievement,
        claimStreakBonus,
        submitQuizScore,
        lastQuizResult,
        copyReferralCode,
        claimWelcomeReward,
        markAllNotificationsRead,
        isInviteModalOpen,
        setInviteModalOpen,
        authUser,
        isCloudConnected: isFirebaseConfigured,
        remoteLeaderboard,
        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        deleteAccountAndData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
