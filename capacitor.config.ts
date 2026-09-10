import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'network.vandecoin.app',
  appName: 'VandeCoin',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#08090C',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#08090C',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;