import { Preferences } from '@capacitor/preferences';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { recordLedgerTransaction } from './ledgerService';

const STREAK_KEY = 'vdc_streak_info';

export interface StreakEvaluation {
  streakDays: number;
  streakShields: number;
  lastCheckInDate: string;
  hasClaimedToday: boolean;
  isShieldConsumed: boolean;
  isReset: boolean;
}

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function getDayDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(`${dateStr1}T00:00:00Z`).getTime();
  const d2 = new Date(`${dateStr2}T00:00:00Z`).getTime();
  const diffDays = Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Load streak status for user
 */
export async function getStreakStatus(
  uid: string, 
  currentStreakDays = 1, 
  currentShields = 1, 
  savedDate?: string
): Promise<StreakEvaluation> {
  const today = getTodayDateString();
  let storedLastDate = savedDate;
  let storedStreak = currentStreakDays;
  let storedShields = currentShields;

  try {
    const { value } = await Preferences.get({ key: `${STREAK_KEY}_${uid}` });
    if (value) {
      const parsed = JSON.parse(value);
      storedLastDate = parsed.lastCheckInDate || storedLastDate;
      storedStreak = parsed.streakDays || storedStreak;
      storedShields = parsed.streakShields ?? storedShields;
    }
  } catch (err) {
    console.warn('Failed to read local streak:', err);
  }

  if (!storedLastDate) {
    return {
      streakDays: storedStreak,
      streakShields: storedShields,
      lastCheckInDate: '',
      hasClaimedToday: false,
      isShieldConsumed: false,
      isReset: false,
    };
  }

  if (storedLastDate === today) {
    return {
      streakDays: storedStreak,
      streakShields: storedShields,
      lastCheckInDate: storedLastDate,
      hasClaimedToday: true,
      isShieldConsumed: false,
      isReset: false,
    };
  }

  const diff = getDayDifference(storedLastDate, today);

  if (diff === 1) {
    // Yesterday - streak is preserved, ready to claim for today!
    return {
      streakDays: storedStreak,
      streakShields: storedShields,
      lastCheckInDate: storedLastDate,
      hasClaimedToday: false,
      isShieldConsumed: false,
      isReset: false,
    };
  } else if (diff === 2 && storedShields > 0) {
    // Missed exactly 1 day, but user has a shield!
    return {
      streakDays: storedStreak,
      streakShields: storedShields - 1,
      lastCheckInDate: storedLastDate,
      hasClaimedToday: false,
      isShieldConsumed: true,
      isReset: false,
    };
  } else {
    // Missed days without shield: streak resets to 1
    return {
      streakDays: 1,
      streakShields: storedShields,
      lastCheckInDate: storedLastDate,
      hasClaimedToday: false,
      isShieldConsumed: false,
      isReset: true,
    };
  }
}

/**
 * Claim daily streak bonus and check for milestone bonuses (Day 7, 14, 30)
 */
export async function claimDailyStreakBonus(
  uid: string, 
  currentStreakDays: number, 
  currentShields: number, 
  savedDate?: string
): Promise<{
  success: boolean;
  newStreakDays: number;
  newShields: number;
  rewardVdc: number;
  isMilestone: boolean;
  milestoneTitle?: string;
  error?: string;
}> {
  const status = await getStreakStatus(uid, currentStreakDays, currentShields, savedDate);
  const today = getTodayDateString();

  if (status.hasClaimedToday) {
    return {
      success: false,
      newStreakDays: status.streakDays,
      newShields: status.streakShields,
      rewardVdc: 0,
      isMilestone: false,
      error: 'Streak already claimed for today! Return tomorrow.',
    };
  }

  let nextStreak = status.isReset ? 1 : status.streakDays + 1;
  let nextShields = status.streakShields;

  // Calculate rewards
  let baseBonus = 1.00;
  let milestoneBonus = 0;
  let milestoneTitle = '';

  if (nextStreak === 7) {
    milestoneBonus = 15.00;
    milestoneTitle = '7-Day Early Explorer Milestone';
  } else if (nextStreak === 14) {
    milestoneBonus = 30.00;
    milestoneTitle = '14-Day Dedication Milestone';
  } else if (nextStreak === 30) {
    milestoneBonus = 150.00;
    milestoneTitle = '30-Day Legend Milestone';
    nextShields = Math.min(3, nextShields + 1); // Reward an extra shield
  }

  const totalReward = baseBonus + milestoneBonus;
  const refKey = `streak_${today}_${uid}`;

  // Record in authoritative ledger
  const recordResult = await recordLedgerTransaction(uid, {
    title: milestoneBonus > 0 ? milestoneTitle : `Day ${nextStreak} Streak Check-In`,
    activity: milestoneBonus > 0 ? `Milestone reward +${totalReward.toFixed(2)} VDC` : 'Daily consecutive participation bonus',
    amount: totalReward,
    timestamp: 'Just now',
    status: 'completed',
    category: 'streak',
    refKey,
  });

  if (!recordResult.success) {
    return {
      success: false,
      newStreakDays: status.streakDays,
      newShields: status.streakShields,
      rewardVdc: 0,
      isMilestone: false,
      error: recordResult.error || 'Failed to record streak in ledger',
    };
  }

  // Save new streak locally
  await Preferences.set({
    key: `${STREAK_KEY}_${uid}`,
    value: JSON.stringify({
      streakDays: nextStreak,
      streakShields: nextShields,
      lastCheckInDate: today,
    }),
  });

  // Sync to Firestore
  if (db && isFirebaseConfigured) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        streakDays: nextStreak,
        streakShields: nextShields,
        lastCheckInDate: today,
        lastActive: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore streak update error:', err);
    }
  }

  return {
    success: true,
    newStreakDays: nextStreak,
    newShields: nextShields,
    rewardVdc: totalReward,
    isMilestone: milestoneBonus > 0,
    milestoneTitle,
  };
}
