import { Preferences } from '@capacitor/preferences';
import { AppNotification } from '../types';

const NOTIFICATIONS_KEY = 'vdc_user_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-welcome',
    title: 'Welcome to VandeCoin!',
    message: 'Start your daily Proof-of-Participation session to earn your first VDC tokens.',
    timeAgo: 'Just now',
    category: 'system',
    read: false,
    targetRoute: 'mining',
  },
  {
    id: 'n-quiz',
    title: 'Daily VandeQuiz Available',
    message: 'Test your blockchain and Web3 knowledge today to earn educational VDC rewards.',
    timeAgo: 'Just now',
    category: 'rewards',
    read: false,
    targetRoute: 'quiz',
  },
];

export async function getUserNotifications(uid: string): Promise<AppNotification[]> {
  try {
    const { value } = await Preferences.get({ key: `${NOTIFICATIONS_KEY}_${uid}` });
    if (value) {
      return JSON.parse(value) as AppNotification[];
    }
  } catch (err) {
    console.warn('Failed to read notifications:', err);
  }
  return DEFAULT_NOTIFICATIONS;
}

export async function saveUserNotifications(uid: string, list: AppNotification[]): Promise<void> {
  try {
    await Preferences.set({
      key: `${NOTIFICATIONS_KEY}_${uid}`,
      value: JSON.stringify(list),
    });
  } catch (err) {
    console.warn('Failed to save notifications:', err);
  }
}

export async function addNotification(
  uid: string, 
  notif: Omit<AppNotification, 'id' | 'timeAgo' | 'read'>
): Promise<AppNotification> {
  const current = await getUserNotifications(uid);
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    timeAgo: 'Just now',
    read: false,
  };
  const updated = [newNotif, ...current];
  await saveUserNotifications(uid, updated);
  return newNotif;
}
