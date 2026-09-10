import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { App } from '@capacitor/app';

export const isNativePlatform = Capacitor.isNativePlatform();

/**
 * Initialize native hardware settings (Status Bar, Splash Screen)
 */
export async function initNativeApp() {
  if (!isNativePlatform) return;

  try {
    // 1. Status Bar Setup
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#08090C' });
  } catch (err) {
    console.warn('Native StatusBar init error:', err);
  }

  try {
    // 2. Hide Splash Screen smoothly once app is loaded
    await SplashScreen.hide({ fadeOutDuration: 400 });
  } catch (err) {
    console.warn('Native SplashScreen hide error:', err);
  }
}

/**
 * Trigger native physical haptic vibration
 */
export async function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'
) {
  if (isNativePlatform) {
    try {
      if (type === 'light') {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (type === 'medium') {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (type === 'heavy') {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'error') {
        await Haptics.notification({ type: NotificationType.Error });
      }
    } catch {
      // Ignore if device does not support haptics
    }
  } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    // Web fallback for mobile browsers
    try {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(25);
      else if (type === 'heavy') navigator.vibrate(45);
      else if (type === 'success') navigator.vibrate([15, 30, 25]);
    } catch {
      // Ignore
    }
  }
}

/**
 * Handle Android Hardware / Gesture Back Button
 */
export function setupHardwareBackHandler(
  onBack: () => boolean
) {
  if (!isNativePlatform) return () => {};

  const listener = App.addListener('backButton', ({ canGoBack }) => {
    const handled = onBack();
    if (!handled && !canGoBack) {
      App.exitApp();
    }
  });

  return () => {
    listener.then(l => l.remove()).catch(() => {});
  };
}