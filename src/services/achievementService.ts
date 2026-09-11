import { Preferences } from '@capacitor/preferences';
import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { AchievementItem, UserState } from '../types';
import { recordLedgerTransaction } from './ledgerService';

const ACHIEVEMENTS_STATE_KEY = 'vdc_achievements_state';

export const INITIAL_ACHIEVEMENTS_CONFIG: AchievementItem[] = [
  {
    id: 'first-mining',
    title: 'First Step',
    description: 'Complete your first VandeCoin mining session.',
    category: 'Ecosystem',
    icon: 'Sparkles',
    progress: 0,
    target: 1,
    rewardVdc: 5.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'explorer-7',
    title: 'Early Explorer',
    description: 'Reach a 7-day participation streak.',
    category: 'Dedication',
    icon: 'Compass',
    progress: 1,
    target: 7,
    rewardVdc: 15.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'quiz-10',
    title: 'Knowledge Seeker',
    description: 'Answer 10 educational quiz questions.',
    category: 'Learning',
    icon: 'BookOpen',
    progress: 0,
    target: 10,
    rewardVdc: 25.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'circle-3',
    title: 'Circle Builder',
    description: 'Build an active VandeCircle with 3+ trusted members.',
    category: 'Community',
    icon: 'Users',
    progress: 0,
    target: 3,
    rewardVdc: 20.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'referral-5',
    title: 'Community Champion',
    description: 'Introduce 5 pioneers to the ecosystem.',
    category: 'Community',
    icon: 'Award',
    progress: 0,
    target: 5,
    rewardVdc: 50.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'streak-30',
    title: '30-Day Legend',
    description: 'Maintain a continuous 30-day streak.',
    category: 'Dedication',
    icon: 'Flame',
    progress: 1,
    target: 30,
    rewardVdc: 150.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Achieve 90%+ accuracy on the daily quiz.',
    category: 'Learning',
    icon: 'Trophy',
    progress: 0,
    target: 90,
    rewardVdc: 50.00,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'security-guardian',
    title: 'Security Guardian',
    description: 'Enable Passkey, 2FA, and verify your 12-word recovery phrase.',
    category: 'Ecosystem',
    icon: 'ShieldCheck',
    progress: 0,
    target: 3,
    rewardVdc: 30.00,
    unlocked: false,
    claimed: false,
  },
];

/**
 * Load saved achievements state
 */
export async function getSavedAchievements(uid: string): Promise<AchievementItem[]> {
  try {
    const { value } = await Preferences.get({ key: `${ACHIEVEMENTS_STATE_KEY}_${uid}` });
    if (value) {
      return JSON.parse(value) as AchievementItem[];
    }
  } catch (err) {
    console.warn('Failed to read achievements state:', err);
  }
  return INITIAL_ACHIEVEMENTS_CONFIG;
}

/**
 * Recalculate progress and unlock status for all achievements based on live user state
 */
export function evaluateAchievements(
  currentList: AchievementItem[],
  user: UserState,
  securityFactorsCount: number
): AchievementItem[] {
  return currentList.map(item => {
    let currentProgress = item.progress;

    switch (item.id) {
      case 'first-mining':
        currentProgress = user.miningActive || user.todayEarnings > 0 ? 1 : 0;
        break;
      case 'explorer-7':
        currentProgress = user.streakDays;
        break;
      case 'quiz-10':
        currentProgress = user.quizQuestionsAnswered;
        break;
      case 'circle-3':
        currentProgress = user.circleMembersCount;
        break;
      case 'referral-5':
        currentProgress = user.referralCount;
        break;
      case 'streak-30':
        currentProgress = user.streakDays;
        break;
      case 'quiz-master':
        currentProgress = user.quizScorePercent;
        break;
      case 'security-guardian':
        currentProgress = securityFactorsCount;
        break;
    }

    const isUnlocked = currentProgress >= item.target;
    return {
      ...item,
      progress: Math.min(item.target, currentProgress),
      unlocked: isUnlocked,
    };
  });
}

/**
 * Claim an unlocked achievement reward and credit VDC via ledger
 */
export async function claimAchievementReward(
  uid: string,
  achievementId: string,
  currentList: AchievementItem[]
): Promise<{
  success: boolean;
  rewardVdc: number;
  updatedList: AchievementItem[];
  error?: string;
}> {
  const target = currentList.find(a => a.id === achievementId);

  if (!target) {
    return { success: false, rewardVdc: 0, updatedList: currentList, error: 'Achievement not found' };
  }

  if (!target.unlocked) {
    return { success: false, rewardVdc: 0, updatedList: currentList, error: 'Achievement milestone not reached yet' };
  }

  if (target.claimed) {
    return { success: false, rewardVdc: 0, updatedList: currentList, error: 'Achievement reward already claimed' };
  }

  // Authoritative Ledger Transaction
  const refKey = `achievement_${achievementId}_${uid}`;
  const ledgerResult = await recordLedgerTransaction(uid, {
    title: `${target.title} Unlocked`,
    activity: `Achievement reward milestone claimed`,
    amount: target.rewardVdc,
    timestamp: 'Just now',
    status: 'completed',
    category: 'achievement',
    refKey,
  });

  if (!ledgerResult.success) {
    return { success: false, rewardVdc: 0, updatedList: currentList, error: ledgerResult.error };
  }

  const updatedList = currentList.map(a => 
    a.id === achievementId ? { ...a, claimed: true, unlocked: true } : a
  );

  await Preferences.set({
    key: `${ACHIEVEMENTS_STATE_KEY}_${uid}`,
    value: JSON.stringify(updatedList),
  });

  if (db && isFirebaseConfigured) {
    try {
      const achRef = doc(db, 'user_achievements', `${uid}_${achievementId}`);
      await setDoc(achRef, {
        userId: uid,
        achievementId,
        rewardVdc: target.rewardVdc,
        claimedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore user_achievements write error:', err);
    }
  }

  return { success: true, rewardVdc: target.rewardVdc, updatedList };
}
