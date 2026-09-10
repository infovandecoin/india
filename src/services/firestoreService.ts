import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { UserState } from '../types';

export interface RemoteLeaderboardEntry {
  uid: string;
  rank: number;
  username: string;
  avatarUrl: string;
  country: string;
  balance: number;
  streakDays: number;
  xp: number;
}

/**
 * Fetch or initialize a user document in Firestore
 */
export async function syncUserProfile(uid: string, initialData: Partial<UserState>): Promise<UserState | null> {
  if (!db || !isFirebaseConfigured) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as UserState;
    } else {
      // First time initialization in Cloud Firestore
      const newDoc = {
        ...initialData,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };
      await setDoc(userRef, newDoc);
      return initialData as UserState;
    }
  } catch (err) {
    console.warn('Firestore syncUserProfile error:', err);
    return null;
  }
}

/**
 * Update user state in Firestore
 */
export async function updateRemoteUserState(uid: string, updates: Partial<UserState>): Promise<void> {
  if (!db || !isFirebaseConfigured) return;

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      lastActive: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore updateRemoteUserState error:', err);
  }
}

/**
 * Real-time subscription to global leaderboard
 */
export function subscribeToLeaderboard(
  callback: (entries: RemoteLeaderboardEntry[]) => void,
  maxResults = 25
): () => void {
  if (!db || !isFirebaseConfigured) {
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'users'),
      orderBy('balance', 'desc'),
      limit(maxResults)
    );

    return onSnapshot(q, (snapshot) => {
      const results: RemoteLeaderboardEntry[] = [];
      let rank = 1;
      snapshot.forEach((docSnap) => {
        const d = docSnap.data() as UserState;
        results.push({
          uid: docSnap.id,
          rank: rank++,
          username: d.username || 'Pioneer',
          avatarUrl: d.avatarUrl || '',
          country: 'IN',
          balance: d.balance || 0,
          streakDays: d.streakDays || 1,
          xp: d.xp || 100,
        });
      });
      callback(results);
    });
  } catch (err) {
    console.warn('Firestore subscribeToLeaderboard error:', err);
    return () => {};
  }
}