import { Preferences } from '@capacitor/preferences';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { MiningSession } from '../types';
import { recordLedgerTransaction } from './ledgerService';

const MINING_SESSION_KEY = 'vdc_active_mining_session';
const SESSION_DURATION_SECONDS = 24 * 60 * 60; // 24 Hours

export interface CalculatedMiningState {
  isActive: boolean;
  ratePerHour: number;
  baseRate: number;
  streakBonus: number;
  circleBonus: number;
  sessionRemainingSeconds: number;
  accruedVdc: number;
  currentSession: MiningSession | null;
  isExpired: boolean;
}

/**
 * Calculate dynamic mining rate according to Proof-of-Participation rules
 */
export function calculateDynamicMiningRate(streakDays: number, activeCircleCount: number): {
  totalRate: number;
  baseRate: number;
  streakBonus: number;
  circleBonus: number;
} {
  const baseRate = 0.20;
  // +0.01 VDC/h per 5 days of streak up to max +0.05 VDC/h
  const streakBonus = Math.min(0.05, Math.floor(streakDays / 5) * 0.01);
  // +0.02 VDC/h per active verified circle member up to max 5 members = +0.10 VDC/h
  const circleBonus = Math.min(0.10, Math.min(activeCircleCount, 5) * 0.02);
  const totalRate = Number((baseRate + streakBonus + circleBonus).toFixed(3));

  return { totalRate, baseRate, streakBonus, circleBonus };
}

/**
 * Retrieve current active mining session from local storage or Firestore
 */
export async function getActiveMiningSession(uid: string): Promise<MiningSession | null> {
  try {
    const { value } = await Preferences.get({ key: `${MINING_SESSION_KEY}_${uid}` });
    if (value) {
      return JSON.parse(value) as MiningSession;
    }
  } catch (err) {
    console.warn('Failed to read local mining session:', err);
  }

  if (db && isFirebaseConfigured) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      if (data?.activeMiningSessionId) {
        const sessionRef = doc(db, 'mining_sessions', data.activeMiningSessionId);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          const session = sessionSnap.data() as MiningSession;
          await Preferences.set({
            key: `${MINING_SESSION_KEY}_${uid}`,
            value: JSON.stringify(session),
          });
          return session;
        }
      }
    } catch (err) {
      console.warn('Failed to query remote mining session:', err);
    }
  }

  return null;
}

/**
 * Calculate realtime mining session status and accrued VDC
 */
export function evaluateMiningSession(session: MiningSession | null): CalculatedMiningState {
  if (!session || session.settled) {
    return {
      isActive: false,
      ratePerHour: 0.20,
      baseRate: 0.20,
      streakBonus: 0,
      circleBonus: 0,
      sessionRemainingSeconds: SESSION_DURATION_SECONDS,
      accruedVdc: 0,
      currentSession: null,
      isExpired: false,
    };
  }

  const nowMs = Date.now();
  const elapsedMs = Math.max(0, nowMs - session.startedAt);
  const elapsedSeconds = Math.min(SESSION_DURATION_SECONDS, Math.floor(elapsedMs / 1000));
  const remainingSeconds = Math.max(0, SESSION_DURATION_SECONDS - elapsedSeconds);
  const accruedVdc = Number(((elapsedSeconds / 3600) * session.ratePerHour).toFixed(4));
  const isExpired = remainingSeconds === 0;

  return {
    isActive: !isExpired,
    ratePerHour: session.ratePerHour,
    baseRate: session.baseRate,
    streakBonus: session.streakBonus,
    circleBonus: session.circleBonus,
    sessionRemainingSeconds: remainingSeconds,
    accruedVdc,
    currentSession: session,
    isExpired,
  };
}

/**
 * Start a new 24-hour Proof-of-Participation mining session
 */
export async function startMiningSession(
  uid: string, 
  streakDays: number, 
  activeCircleCount: number
): Promise<MiningSession> {
  const rates = calculateDynamicMiningRate(streakDays, activeCircleCount);
  const now = Date.now();
  const sessionId = `session_${now}_${Math.random().toString(36).substring(2, 6)}`;

  const newSession: MiningSession = {
    id: sessionId,
    userId: uid,
    startedAt: now,
    expiresAt: now + (SESSION_DURATION_SECONDS * 1000),
    ratePerHour: rates.totalRate,
    baseRate: rates.baseRate,
    streakBonus: rates.streakBonus,
    circleBonus: rates.circleBonus,
    settled: false,
    accruedVdc: 0,
  };

  // 1. Save locally
  await Preferences.set({
    key: `${MINING_SESSION_KEY}_${uid}`,
    value: JSON.stringify(newSession),
  });

  // 2. Save to Firestore
  if (db && isFirebaseConfigured) {
    try {
      const sessionRef = doc(db, 'mining_sessions', sessionId);
      await setDoc(sessionRef, {
        ...newSession,
        createdAt: serverTimestamp(),
      });
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { activeMiningSessionId: sessionId }, { merge: true });
    } catch (err) {
      console.warn('Firestore startMiningSession error:', err);
    }
  }

  return newSession;
}

/**
 * Settle the active session and award accrued VDC to the ledger
 */
export async function settleMiningSession(uid: string): Promise<{ 
  success: boolean; 
  settledVdc: number; 
  error?: string 
}> {
  const session = await getActiveMiningSession(uid);
  if (!session || session.settled) {
    return { success: false, settledVdc: 0, error: 'No active session to settle' };
  }

  const evalState = evaluateMiningSession(session);
  const earnedVdc = Math.max(0.01, Number(evalState.accruedVdc.toFixed(2)));

  // Write to ledger with anti-cheat refKey
  const recordResult = await recordLedgerTransaction(uid, {
    title: 'Proof-of-Participation Mining',
    activity: `24-Hour session reward (+${session.ratePerHour.toFixed(2)}/h rate)`,
    amount: earnedVdc,
    timestamp: 'Just now',
    status: 'completed',
    category: 'mining',
    refKey: `mining_${session.id}`,
  });

  // Mark session settled
  const settledSession: MiningSession = {
    ...session,
    settled: true,
    accruedVdc: earnedVdc,
  };

  await Preferences.remove({ key: `${MINING_SESSION_KEY}_${uid}` });

  if (db && isFirebaseConfigured) {
    try {
      const sessionRef = doc(db, 'mining_sessions', session.id);
      await setDoc(sessionRef, { settled: true, settledAmount: earnedVdc }, { merge: true });
    } catch (err) {
      console.warn('Firestore settleMiningSession error:', err);
    }
  }

  return { success: recordResult.success, settledVdc: earnedVdc };
}
