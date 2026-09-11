import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { Preferences } from '@capacitor/preferences';
import { db, isFirebaseConfigured } from './firebase';
import { LedgerTransaction, RewardTransaction } from '../types';

const LOCAL_LEDGER_KEY = 'vdc_ledger_transactions';

/**
 * Fetch cached transactions from local device storage
 */
export async function getLocalTransactions(uid: string): Promise<LedgerTransaction[]> {
  try {
    const { value } = await Preferences.get({ key: `${LOCAL_LEDGER_KEY}_${uid}` });
    if (!value) return [];
    return JSON.parse(value) as LedgerTransaction[];
  } catch (err) {
    console.warn('Failed to read local ledger:', err);
    return [];
  }
}

/**
 * Save transactions to local device storage
 */
export async function saveLocalTransactions(uid: string, txs: LedgerTransaction[]): Promise<void> {
  try {
    await Preferences.set({
      key: `${LOCAL_LEDGER_KEY}_${uid}`,
      value: JSON.stringify(txs),
    });
  } catch (err) {
    console.warn('Failed to save local ledger:', err);
  }
}

/**
 * Fetch all verified ledger transactions for a user (Cloud first, fallback to local)
 */
export async function fetchUserLedger(uid: string): Promise<LedgerTransaction[]> {
  const localTxs = await getLocalTransactions(uid);

  if (!db || !isFirebaseConfigured) {
    return localTxs;
  }

  try {
    const q = query(
      collection(db, 'ledger'),
      where('userId', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    const remoteTxs: LedgerTransaction[] = [];

    snap.forEach((docSnap) => {
      remoteTxs.push(docSnap.data() as LedgerTransaction);
    });

    if (remoteTxs.length > 0) {
      // Merge remote with any un-synced local items
      const mergedMap = new Map<string, LedgerTransaction>();
      remoteTxs.forEach(tx => mergedMap.set(tx.refKey, tx));
      localTxs.forEach(tx => {
        if (!mergedMap.has(tx.refKey)) {
          mergedMap.set(tx.refKey, tx);
        }
      });
      const mergedList = Array.from(mergedMap.values());
      await saveLocalTransactions(uid, mergedList);
      return mergedList;
    }

    return localTxs;
  } catch (err) {
    console.warn('Firestore fetchUserLedger error, falling back to local:', err);
    return localTxs;
  }
}

/**
 * Calculate user balance authoritatively by summing all completed ledger credits
 */
export function calculateBalanceFromLedger(transactions: (LedgerTransaction | RewardTransaction)[]): number {
  const total = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  return Number(total.toFixed(2));
}

/**
 * Record an immutable ledger transaction with anti-cheat idempotency verification
 */
export async function recordLedgerTransaction(
  uid: string, 
  data: Omit<LedgerTransaction, 'id' | 'userId'>
): Promise<{ success: boolean; transaction?: LedgerTransaction; error?: string }> {
  const localTxs = await getLocalTransactions(uid);

  // 1. Anti-Cheat Idempotency Check: Prevent duplicate reward claiming
  const existing = localTxs.find(tx => tx.refKey === data.refKey);
  if (existing) {
    return { 
      success: false, 
      transaction: existing, 
      error: `Transaction with key ${data.refKey} already processed` 
    };
  }

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newTx: LedgerTransaction = {
    ...data,
    id: txId,
    userId: uid,
  };

  // 2. Write to local secure storage
  const updatedLocal = [newTx, ...localTxs];
  await saveLocalTransactions(uid, updatedLocal);

  // 3. Write to Cloud Firestore if connected
  if (db && isFirebaseConfigured) {
    try {
      const txRef = doc(db, 'ledger', txId);
      await setDoc(txRef, {
        ...newTx,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Cloud ledger write error (saved locally):', err);
    }
  }

  return { success: true, transaction: newTx };
}
