import { Preferences } from '@capacitor/preferences';
import { doc, setDoc, deleteDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { CircleMember } from '../types';

const CIRCLE_STORAGE_KEY = 'vdc_circle_members';

/**
 * Get circle members from local cache
 */
export async function getLocalCircleMembers(uid: string): Promise<CircleMember[]> {
  try {
    const { value } = await Preferences.get({ key: `${CIRCLE_STORAGE_KEY}_${uid}` });
    if (value) {
      return JSON.parse(value) as CircleMember[];
    }
  } catch (err) {
    console.warn('Failed to read circle cache:', err);
  }
  return [];
}

/**
 * Save circle members to local cache
 */
export async function saveLocalCircleMembers(uid: string, members: CircleMember[]): Promise<void> {
  try {
    await Preferences.set({
      key: `${CIRCLE_STORAGE_KEY}_${uid}`,
      value: JSON.stringify(members),
    });
  } catch (err) {
    console.warn('Failed to save circle cache:', err);
  }
}

/**
 * Fetch circle members (Firestore with local fallback)
 */
export async function fetchCircleMembers(uid: string): Promise<CircleMember[]> {
  const local = await getLocalCircleMembers(uid);

  if (!db || !isFirebaseConfigured) {
    return local;
  }

  try {
    const q = query(collection(db, 'circle_members'), where('ownerUid', '==', uid));
    const snap = await getDocs(q);
    const remoteMembers: CircleMember[] = [];

    snap.forEach(docSnap => {
      remoteMembers.push(docSnap.data() as CircleMember);
    });

    if (remoteMembers.length > 0) {
      await saveLocalCircleMembers(uid, remoteMembers);
      return remoteMembers;
    }
    return local;
  } catch (err) {
    console.warn('Firestore fetchCircleMembers error, using local:', err);
    return local;
  }
}

/**
 * Add a new verified peer to user's VandeCircle
 */
export async function addCircleMember(
  uid: string,
  userHandle: string,
  targetHandleOrCode: string
): Promise<{ success: boolean; member?: CircleMember; error?: string }> {
  const cleanedTarget = targetHandleOrCode.trim();
  const currentMembers = await getLocalCircleMembers(uid);

  // 1. Capacity limit: Max 10 members
  if (currentMembers.length >= 10) {
    return { success: false, error: 'Your VandeCircle is already at maximum capacity (10 members).' };
  }

  // 2. Anti-Self-Addition Check
  const normalizedUserHandle = userHandle.toLowerCase().replace('@', '');
  const normalizedTarget = cleanedTarget.toLowerCase().replace('@', '');
  if (normalizedTarget === normalizedUserHandle) {
    return { success: false, error: 'You cannot add yourself to your own VandeCircle.' };
  }

  // 3. Duplicate check
  const alreadyMember = currentMembers.find(m => 
    m.username.toLowerCase().replace('@', '') === normalizedTarget ||
    m.name.toLowerCase() === cleanedTarget.toLowerCase()
  );
  if (alreadyMember) {
    return { success: false, error: `${cleanedTarget} is already in your VandeCircle.` };
  }

  // Generate trusted member profile
  const memberId = `circle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const displayName = cleanedTarget.startsWith('@') 
    ? cleanedTarget.substring(1).charAt(0).toUpperCase() + cleanedTarget.substring(2)
    : cleanedTarget;

  const newMember: CircleMember = {
    id: memberId,
    name: displayName,
    username: cleanedTarget.startsWith('@') ? cleanedTarget : `@${cleanedTarget}`,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanedTarget)}`,
    verified: true,
    status: 'active',
    contributionPerHour: 0.02,
    joinedDays: 1,
    trustScore: Math.floor(88 + Math.random() * 10),
  };

  const updatedMembers = [...currentMembers, newMember];
  await saveLocalCircleMembers(uid, updatedMembers);

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'circle_members', memberId);
      await setDoc(docRef, {
        ...newMember,
        ownerUid: uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore addCircleMember error:', err);
    }
  }

  return { success: true, member: newMember };
}

/**
 * Remove a member from the user's circle
 */
export async function removeCircleMember(uid: string, memberId: string): Promise<boolean> {
  const currentMembers = await getLocalCircleMembers(uid);
  const updated = currentMembers.filter(m => m.id !== memberId);
  await saveLocalCircleMembers(uid, updated);

  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'circle_members', memberId));
    } catch (err) {
      console.warn('Firestore removeCircleMember error:', err);
    }
  }

  return true;
}

/**
 * Calculate circle health & collective strength
 */
export function calculateCircleMetrics(members: CircleMember[]) {
  const count = members.length;
  const strengthPercent = Math.min(100, Math.round((count / 10) * 100));
  const activeCount = members.filter(m => m.status === 'active').length;
  const collectiveBonusPerHour = Number((Math.min(activeCount, 5) * 0.02).toFixed(3));
  const earningsToday = Number((collectiveBonusPerHour * 24).toFixed(2));

  return {
    count,
    activeCount,
    strengthPercent,
    collectiveBonusPerHour,
    earningsToday,
  };
}
