export type NavigationTab = 'home' | 'earn' | 'community' | 'leaderboard' | 'profile';

export type ScreenRoute = 
  | 'home'
  | 'earn'
  | 'community'
  | 'leaderboard'
  | 'profile'
  | 'mining'
  | 'circle'
  | 'referral'
  | 'streaks'
  | 'quiz'
  | 'quiz-result'
  | 'achievements'
  | 'rewards'
  | 'security'
  | 'notifications'
  | 'onboarding'
  | 'auth'
  | 'setup-journey';

export interface UserState {
  username: string;
  avatarUrl: string;
  balance: number;
  miningRatePerHour: number;
  miningActive: boolean;
  sessionRemainingSeconds: number;
  todayEarnings: number;
  pendingRewards: number;
  streakDays: number;
  streakMaxDays: number;
  streakShields: number;
  streakBonusMultiplier: number;
  circleMembersCount: number;
  circleMaxMembers: number;
  circleStrengthPercent: number;
  circleEarningsToday: number;
  referralCount: number;
  referralActive: number;
  referralVerified: number;
  referralPending: number;
  referralRewardsTotal: number;
  referralCode: string;
  quizScorePercent: number;
  quizQuestionsAnswered: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  globalRank: number;
  rankDeltaToday: number;
  xp: number;
  xpMax: number;
  levelTitle: string;
  levelTier: number;
  profileCompletionPercent: number;
  isVerifiedVandeId: boolean;
  setupTasksCompleted: number;
  setupTasksTotal: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  vdcReward: number;
}

export interface CircleMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  status: 'active' | 'idle';
  contributionPerHour: number;
  joinedDays: number;
  trustScore: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'Ecosystem' | 'Learning' | 'Community' | 'Dedication';
  icon: string;
  progress: number;
  target: number;
  rewardVdc: number;
  unlocked: boolean;
  claimed: boolean;
}

export interface RewardTransaction {
  id: string;
  title: string;
  activity: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending';
  category: 'mining' | 'quiz' | 'streak' | 'circle' | 'referral' | 'achievement' | 'welcome';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  category: 'rewards' | 'community' | 'achievements' | 'security' | 'system';
  read: boolean;
  targetRoute?: ScreenRoute;
}

export interface SetupTask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  actionRoute?: ScreenRoute;
}
