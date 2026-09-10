import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

/**
 * Register a new user with Email and Password
 */
export async function registerWithEmail(email: string, pass: string, displayName: string): Promise<AuthUserProfile> {
  if (!auth || !isFirebaseConfigured) {
    // Offline simulation mode
    return {
      uid: 'offline_' + Math.random().toString(36).substring(2, 9),
      email,
      displayName,
      photoURL: null,
      isAnonymous: false,
    };
  }

  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  return {
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: cred.user.displayName || displayName,
    photoURL: cred.user.photoURL,
    isAnonymous: false,
  };
}

/**
 * Sign in existing user with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<AuthUserProfile> {
  if (!auth || !isFirebaseConfigured) {
    return {
      uid: 'offline_' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      isAnonymous: false,
    };
  }

  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return {
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: cred.user.displayName,
    photoURL: cred.user.photoURL,
    isAnonymous: false,
  };
}

/**
 * Guest / Anonymous Pioneer Sign In
 */
export async function loginAsGuest(): Promise<AuthUserProfile> {
  if (!auth || !isFirebaseConfigured) {
    return {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: null,
      displayName: 'VandeGuest',
      photoURL: null,
      isAnonymous: true,
    };
  }

  const cred = await signInAnonymously(auth);
  return {
    uid: cred.user.uid,
    email: null,
    displayName: 'Pioneer_' + cred.user.uid.substring(0, 5),
    photoURL: null,
    isAnonymous: true,
  };
}

/**
 * Sign Out
 */
export async function logoutUser(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    await fbSignOut(auth);
  }
}

/**
 * Delete User Account & Data (Mandatory Google Play requirement)
 */
export async function deleteAccount(): Promise<boolean> {
  if (auth && auth.currentUser) {
    await deleteUser(auth.currentUser);
    return true;
  }
  return true;
}

/**
 * Subscribe to Auth State Changes
 */
export function subscribeToAuth(callback: (user: AuthUserProfile | null) => void): () => void {
  if (!auth || !isFirebaseConfigured) {
    return () => {};
  }

  return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      callback({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        isAnonymous: fbUser.isAnonymous,
      });
    } else {
      callback(null);
    }
  });
}