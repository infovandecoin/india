import { Preferences } from '@capacitor/preferences';
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ReferralRecord } from '../types';
import { recordLedgerTransaction } from './ledgerService';

const REFERRAL_RECORDS_KEY = 'vdc_referral_records';
const REFERRED_BY_KEY = 'vdc_referred_by_code';

/**
 * Generate a deterministic referral code for a user
 */
export function generateUserReferralCode(username: string, uid: string): string {
  const cleanName = username
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7) || 'PIONEER';
  
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) % 9000;
  }
  const digits = 1000 + Math.abs(hash);

  return `VDC-${cleanName}-${digits}`;
}

/**
 * Check if the user has already entered a referral code
 */
export async function getAppliedReferralCode(uid: string): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: `${REFERRED_BY_KEY}_${uid}` });
    return value;
  } catch {
    return null;
  }
}

/**
 * Load list of people invited by this user
 */
export async function getUserReferrals(uid: string): Promise<ReferralRecord[]> {
  try {
    const { value } = await Preferences.get({ key: `${REFERRAL_RECORDS_KEY}_${uid}` });
    if (value) {
      return JSON.parse(value) as ReferralRecord[];
    }
  } catch (err) {
    console.warn('Failed to read referrals cache:', err);
  }

  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'referrals'), where('referrerUid', '==', uid));
      const snap = await getDocs(q);
      const records: ReferralRecord[] = [];
      snap.forEach(docSnap => records.push(docSnap.data() as ReferralRecord));

      if (records.length > 0) {
        await Preferences.set({
          key: `${REFERRAL_RECORDS_KEY}_${uid}`,
          value: JSON.stringify(records),
        });
        return records;
      }
    } catch (err) {
      console.warn('Firestore getUserReferrals error:', err);
    }
  }

  return [];
}

/**
 * Apply a referral invitation code during registration or from settings
 */
export async function applyReferralCode(
  uid: string,
  myOwnCode: string,
  enteredCode: string,
  userHandle: string
): Promise<{ success: boolean; rewardVdc: number; error?: string }> {
  const code = enteredCode.trim().toUpperCase();

  // 1. Anti-Self-Referral Check
  if (code === myOwnCode.trim().toUpperCase()) {
    return { success: false, rewardVdc: 0, error: 'You cannot use your own referral code.' };
  }

  // 2. Format validation
  if (!code.startsWith('VDC-') || code.length < 8) {
    return { success: false, rewardVdc: 0, error: 'Invalid referral code format. Example: VDC-PIONEER-4821' };
  }

  // 3. Prevent duplicate entry
  const alreadyApplied = await getAppliedReferralCode(uid);
  if (alreadyApplied) {
    return { success: false, rewardVdc: 0, error: `You have already redeemed referral code ${alreadyApplied}.` };
  }

  const bonusAmount = 10.00;
  const refKey = `referral_invite_${code}_${uid}`;

  // Credit Invitee with Welcome Referral Bonus in ledger
  const recordResult = await recordLedgerTransaction(uid, {
    title: 'Referral Welcome Bonus',
    activity: `Redeemed invitation code ${code}`,
    amount: bonusAmount,
    timestamp: 'Just now',
    status: 'completed',
    category: 'referral',
    refKey,
  });

  if (!recordResult.success) {
    return { success: false, rewardVdc: 0, error: recordResult.error || 'Failed to credit referral bonus.' };
  }

  // Record that this user redeemed the code
  await Preferences.set({ key: `${REFERRED_BY_KEY}_${uid}`, value: code });

  // Record referral document in Firestore
  if (db && isFirebaseConfigured) {
    try {
      const referralDocId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await setDoc(doc(db, 'referrals', referralDocId), {
        id: referralDocId,
        referrerCode: code,
        inviteeUid: uid,
        inviteeHandle: userHandle,
        bonusVdc: bonusAmount,
        createdAt: serverTimestamp(),
        status: 'verified',
      });
    } catch (err) {
      console.warn('Firestore referral record error:', err);
    }
  }

  return { success: true, rewardVdc: bonusAmount };
}
