import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { 
  fetchUserLedger, 
  calculateBalanceFromLedger, 
  recordLedgerTransaction 
} from '../services/ledgerService';
import { 
  getActiveMiningSession, 
  evaluateMiningSession, 
  startMiningSession, 
  settleMiningSession, 
  calculateDynamicMiningRate 
} from '../services/miningService';
import { 
  getStreakStatus, 
  claimDailyStreakBonus 
} from '../services/streakService';
import { 
  fetchCircleMembers, 
  addCircleMember, 
  calculateCircleMetrics 
} from '../services/circleService';
import { 
  generateUserReferralCode, 
  getUserReferrals, 
  applyReferralCode 
} from '../services/referralService';
import { 
  getSavedAchievements, 
  evaluateAchievements, 
  claimAchievementReward 
} from '../services/achievementService';
import { 
  getUserNotifications, 
  saveUserNotifications 
} from '../services/notificationService';
import { getSecuritySettings } from '../services/securityService';

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
  toggleMining: () => Promise<void>;
  claimAchievement: (id: string) => Promise<void>;
  claimStreakBonus: () => Promise<void>;
  submitQuizScore: (score: number, vdc: number) => void;
  lastQuizResult: { score: number; vdc: number } | null;
  copyReferralCode: () => void;
  claimWelcomeReward: () => Promise<void>;
  markAllNotificationsRead: () => void;
  isInviteModalOpen: boolean;
  setInviteModalOpen: (open: boolean) => void;
  addCirclePeer: (handleOrCode: string) => Promise<{ success: boolean; error?: string }>;
  redeemReferral: (code: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
  // Cloud Auth
  authUser: AuthUserProfile | null;
  isCloudConnected: boolean;
  remoteLeaderboard: RemoteLeaderboardEntry[];
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccountAndData: () => Promise<boolean>;
}

const defaultInitialUser: UserState = {
  username: '@VandePioneer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  balance: 0.00,
  miningRatePerHour: 0.20,
  miningActive: false,
  sessionRemainingSeconds: 86400,
  todayEarnings: 0.00,
  pendingRewards: 0.00,
  streakDays: 1,
  streakMaxDays: 30,
  streakShields: 1,
  streakBonusMultiplier: 1,
  circleMembersCount: 0,
  circleMaxMembers: 10,
  circleStrengthPercent: 0,
  circleEarningsToday: 0.00,
  referralCount: 0,
  referralActive: 0,
  referralVerified: 0,
  referralPending: 0,
  referralRewardsTotal: 0.00,
  referralCode: 'VDC-PIONEER-1001',
  quizScorePercent: 0,
  quizQuestionsAnswered: 0,
  achievementsUnlocked: 0,
  totalAchievements: 8,
  globalRank: 1042,
  rankDeltaToday: 1,
  xp: 150,
  xpMax: 1000,
  levelTitle: 'Founding Pioneer',
  levelTier: 1,
  profileCompletionPercent: 40,
  isVerifiedVandeId: true,
  setupTasksCompleted: 2,
  setupTasksTotal: 7,
};

const initialSetupTasksConfig: SetupTask[] = [
  { id: 1, title: 'Create VandeID Handle', description: 'Your sovereign identity across the ecosystem', completed: true },
  { id: 2, title: 'Secure Cryptographic Keys', description: 'Passkey & 12-word recovery phrase backup', completed: true, actionRoute: 'security' },
  { id: 3, title: 'Start First Mining Session', description: 'Activate Proof-of-Participation daily mining', completed: false, actionRoute: 'mining' },
  { id: 4, title: 'Complete First Educational Quiz', description: 'Learn Web3 fundamentals and earn VDC', completed: false, actionRoute: 'quiz' },
  { id: 5, title: 'Build Your VandeCircle', description: 'Connect with trusted peers for mutual validator security', completed: false, actionRoute: 'circle' },
  { id: 6, title: 'Invite a Pioneer', description: 'Share your referral code to expand the network', completed: false, actionRoute: 'referral' },
  { id: 7, title: 'Claim First Milestone Badge', description: 'Unlock your initial explorer achievement', completed: false, actionRoute: 'achievements' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');
  const [activeRoute, setActiveRoute] = useState<ScreenRoute>('home');
  const [history, setHistory] = useState<ScreenRoute[]>(['home']);
  const [user, setUser] = useState<UserState>(defaultInitialUser);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [rewardsHistory, setRewardsHistory] = useState<RewardTransaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [setupTasks, setSetupTasks] = useState<SetupTask[]>(initialSetupTasksConfig);
  const [deviceModel, setDeviceModel] = useState<'iphone16' | 'pixel9' | 'fullscreen'>('iphone16');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; vdc: number } | null>(null);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUserProfile | null>(null);
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<RemoteLeaderboardEntry[]>([]);

  const currentUid = authUser?.uid || 'local_pioneer';

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  /**
   * Authoritative refresh of all user state from ledger & services
   */
  const refreshUserData = useCallback(async () => {
    const uid = currentUid;
    
    // 1. Fetch Ledger Transactions
    const txs = await fetchUserLedger(uid);
    setRewardsHistory(txs);

    // 2. Authoritative Balance Calculation
    const verifiedBalance = calculateBalanceFromLedger(txs);

    // 3. Compute Today's Ledger Earnings
    const todayStr = new Date().toDateString();
    const todayEarned = txs
      .filter(tx => tx.status === 'completed' && (tx.timestamp.includes('Today') || tx.timestamp.includes('Just now') || tx.timestamp.includes(todayStr)))
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    // 4. Load Circle Members & Metrics
    const members = await fetchCircleMembers(uid);
    setCircleMembers(members);
    const circleMetrics = calculateCircleMetrics(members);

    // 5. Load Active Mining Session
    const activeSession = await getActiveMiningSession(uid);
    const miningEval = evaluateMiningSession(activeSession);

    // 6. Load Streak Status
    const streakStatus = await getStreakStatus(uid, user.streakDays, user.streakShields, user.lastCheckInDate);

    // 7. Load Referrals
    const referrals = await getUserReferrals(uid);
    const referralTotal = referrals.length;
    const referralRewardsTotal = txs
      .filter(tx => tx.category === 'referral' && tx.status === 'completed')
      .reduce((s, tx) => s + tx.amount, 0);

    // 8. Generate / Sync Referral Code
    const refCode = generateUserReferralCode(user.username, uid);

    // 9. Load Security Factors
    const secSettings = await getSecuritySettings(uid);
    const secCount = (secSettings.passkeyActive ? 1 : 0) + (secSettings.twoFactorActive ? 1 : 0) + (secSettings.phraseVerified ? 1 : 0);

    // 10. Load & Evaluate Achievements
    const savedAchs = await getSavedAchievements(uid);
    const evaluatedAchs = evaluateAchievements(savedAchs, {
      ...user,
      balance: verifiedBalance,
      streakDays: streakStatus.streakDays,
      circleMembersCount: circleMetrics.count,
      referralCount: referralTotal,
    }, secCount);
    setAchievements(evaluatedAchs);
    const unlockedCount = evaluatedAchs.filter(a => a.unlocked).length;

    // 11. Load Notifications
    const notifs = await getUserNotifications(uid);
    setNotifications(notifs);

    // 12. Evaluate Setup Tasks
    const hasMining = miningEval.isActive || txs.some(t => t.category === 'mining');
    const hasQuiz = txs.some(t => t.category === 'quiz');
    const hasCircle = circleMetrics.count > 0;
    const hasReferral = referralTotal > 0 || txs.some(t => t.category === 'referral');
    const hasBadge = evaluatedAchs.some(a => a.claimed);
    const welcomeClaimed = txs.some(t => t.category === 'welcome');

    const updatedTasks: SetupTask[] = [
      { id: 1, title: 'Create VandeID Handle', description: `Decentralized identity: ${user.username}`, completed: true },
      { id: 2, title: 'Secure Cryptographic Keys', description: 'Passkey & 12-word recovery phrase backup', completed: secSettings.phraseVerified, actionRoute: 'security' },
      { id: 3, title: 'Start First Mining Session', description: 'Activate Proof-of-Participation daily mining', completed: hasMining, actionRoute: 'mining' },
      { id: 4, title: 'Complete First Educational Quiz', description: 'Learn Web3 fundamentals and earn VDC', completed: hasQuiz, actionRoute: 'quiz' },
      { id: 5, title: 'Build Your VandeCircle', description: 'Connect with trusted peers for mutual validator security', completed: hasCircle, actionRoute: 'circle' },
      { id: 6, title: 'Invite a Pioneer', description: `Share code ${refCode} to expand the network`, completed: hasReferral, actionRoute: 'referral' },
      { id: 7, title: 'Claim First Milestone Badge', description: 'Unlock your initial explorer achievement', completed: hasBadge, actionRoute: 'achievements' },
    ];
    setSetupTasks(updatedTasks);
    const tasksDone = updatedTasks.filter(t => t.completed).length;

    // Dynamic rate calculation
    const rateCalc = calculateDynamicMiningRate(streakStatus.streakDays, circleMetrics.activeCount);

    setUser(prev => ({
      ...prev,
      balance: verifiedBalance,
      todayEarnings: Number(todayEarned.toFixed(2)),
      miningActive: miningEval.isActive,
      miningRatePerHour: miningEval.isActive ? miningEval.ratePerHour : rateCalc.totalRate,
      sessionRemainingSeconds: miningEval.sessionRemainingSeconds,
      streakDays: streakStatus.streakDays,
      streakShields: streakStatus.streakShields,
      circleMembersCount: circleMetrics.count,
      circleStrengthPercent: circleMetrics.strengthPercent,
      circleEarningsToday: circleMetrics.earningsToday,
      referralCount: referralTotal,
      referralActive: referrals.filter(r => r.status === 'active' || r.status === 'verified').length,
      referralVerified: referrals.filter(r => r.status === 'verified').length,
      referralPending: referrals.filter(r => r.status === 'pending').length,
      referralRewardsTotal: Number(referralRewardsTotal.toFixed(2)),
      referralCode: refCode,
      achievementsUnlocked: unlockedCount,
      totalAchievements: evaluatedAchs.length,
      setupTasksCompleted: tasksDone,
      setupTasksTotal: updatedTasks.length,
    }));
  }, [currentUid, user.username, user.streakDays, user.streakShields, user.lastCheckInDate]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuth((profile) => {
      setAuthUser(profile);
      if (profile) {
        const username = profile.displayName || `@${profile.email?.split('@')[0] || 'Pioneer'}`;
        setUser(prev => ({ ...prev, username }));

        syncUserProfile(profile.uid, {
          username,
          avatarUrl: profile.photoURL || defaultInitialUser.avatarUrl,
        }).then(remote => {
          if (remote) {
            setUser(prev => ({ ...prev, ...remote }));
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Leaderboard Listener
  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((entries) => {
      if (entries && entries.length > 0) {
        setRemoteLeaderboard(entries);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load state on mount / uid change
  useEffect(() => {
    refreshUserData();
  }, [currentUid]);

  // Live timer tick for active mining
  useEffect(() => {
    const timer = setInterval(() => {
      setUser(prev => {
        if (!prev.miningActive) return prev;
        if (prev.sessionRemainingSeconds <= 1) {
          // Session expired: auto settle on next tick
          return {
            ...prev,
            sessionRemainingSeconds: 0,
            miningActive: false,
          };
        }
        const nextSeconds = prev.sessionRemainingSeconds - 1;
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

  // Sound and Nav Handlers
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

  // Mining Toggle
  const toggleMining = async () => {
    const uid = currentUid;
    if (!user.miningActive) {
      // Start session
      const session = await startMiningSession(uid, user.streakDays, user.circleMembersCount);
      sounds.playMiningToggle(true);
      triggerConfetti(0.4);
      showToast(`Daily Mining Active: +${session.ratePerHour.toFixed(2)} VDC/h verified`, 'gold');
      await refreshUserData();
    } else {
      // Settle active session
      const result = await settleMiningSession(uid);
      sounds.playMiningToggle(false);
      if (result.success) {
        triggerConfetti(0.4);
        showToast(`Mining session settled: +${result.settledVdc.toFixed(2)} VDC credited to ledger!`, 'gold');
      } else {
        showToast('Mining session paused', 'info');
      }
      await refreshUserData();
    }
  };

  // Streak Bonus Claim
  const claimStreakBonus = async () => {
    const uid = currentUid;
    const result = await claimDailyStreakBonus(uid, user.streakDays, user.streakShields, user.lastCheckInDate);
    if (result.success) {
      sounds.playRewardChime();
      triggerConfetti(0.5);
      showToast(
        result.isMilestone 
          ? `🎉 ${result.milestoneTitle}! +${result.rewardVdc.toFixed(2)} VDC credited!`
          : `Daily Streak verified! +${result.rewardVdc.toFixed(2)} VDC added to balance!`,
        'gold'
      );
      await refreshUserData();
    } else {
      showToast(result.error || 'Streak already claimed for today', 'info');
    }
  };

  // Quiz Score Submission (after completion)
  const submitQuizScore = (score: number, vdc: number) => {
    setLastQuizResult({ score, vdc });
    refreshUserData();
    navigateTo('quiz-result');
  };

  // Claim Achievement
  const claimAchievement = async (id: string) => {
    const uid = currentUid;
    const result = await claimAchievementReward(uid, id, achievements);
    if (result.success) {
      sounds.playRewardChime();
      triggerConfetti(0.5);
      showToast(`Claimed +${result.rewardVdc.toFixed(2)} VDC milestone reward!`, 'gold');
      await refreshUserData();
    } else {
      showToast(result.error || 'Unable to claim achievement', 'info');
    }
  };

  // Claim Welcome Starter Reward (+25.00 VDC)
  const claimWelcomeReward = async () => {
    const uid = currentUid;
    const refKey = `welcome_starter_${uid}`;
    
    // Anti-cheat verification
    const recordResult = await recordLedgerTransaction(uid, {
      title: 'Welcome Pioneer Starter Reward',
      activity: 'Completed ecosystem onboarding setup tasks',
      amount: 25.00,
      timestamp: 'Just now',
      status: 'completed',
      category: 'welcome',
      refKey,
    });

    if (recordResult.success) {
      sounds.playRewardChime();
      triggerConfetti(0.6);
      showToast('🎉 +25.00 VDC Starter Reward credited to ledger!', 'gold');
      await refreshUserData();
    } else {
      showToast('Welcome reward has already been claimed for this account!', 'info');
    }
  };

  // Add VandeCircle Peer
  const addCirclePeer = async (handleOrCode: string): Promise<{ success: boolean; error?: string }> => {
    const uid = currentUid;
    const result = await addCircleMember(uid, user.username, handleOrCode);
    if (result.success) {
      sounds.playRewardChime();
      showToast(`Added ${result.member?.name} to your VandeCircle!`, 'gold');
      await refreshUserData();
      return { success: true };
    } else {
      showToast(result.error || 'Failed to add member', 'info');
      return { success: false, error: result.error };
    }
  };

  // Redeem Referral Code
  const redeemReferral = async (code: string): Promise<{ success: boolean; error?: string }> => {
    const uid = currentUid;
    const result = await applyReferralCode(uid, user.referralCode, code, user.username);
    if (result.success) {
      sounds.playRewardChime();
      triggerConfetti(0.5);
      showToast(`🎉 Invitation code redeemed! +${result.rewardVdc.toFixed(2)} VDC credited!`, 'gold');
      await refreshUserData();
      return { success: true };
    } else {
      showToast(result.error || 'Invalid referral code', 'info');
      return { success: false, error: result.error };
    }
  };

  const copyReferralCode = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode);
    }
    showToast(`Referral code ${user.referralCode} copied to clipboard!`, 'gold');
  };

  const markAllNotificationsRead = async () => {
    sounds.playClick();
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await saveUserNotifications(currentUid, updated);
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Cloud Auth Functions
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      const profile = await authLogin(email, pass);
      setAuthUser(profile);
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
    setUser(defaultInitialUser);
    setRewardsHistory([]);
    setCircleMembers([]);
    showToast('Logged out', 'info');
  };

  const deleteAccountAndData = async (): Promise<boolean> => {
    try {
      await authDelete();
      setAuthUser(null);
      await Preferences.clear();
      setUser(defaultInitialUser);
      setRewardsHistory([]);
      setCircleMembers([]);
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
        addCirclePeer,
        redeemReferral,
        refreshUserData,
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
