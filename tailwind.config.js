/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vdc: {
          bg: '#08090C',
          surface: '#0F1118',
          card: '#141722',
          cardElevated: '#1A1E2E',
          cardHover: '#202538',
          gold: '#FF9933',
          goldHover: '#E88523',
          goldLight: '#FFB86C',
          amber: '#F59E0B',
          yellow: '#FBBF24',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#8B5CF6',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGold: 'rgba(255, 153, 51, 0.28)',
          borderGlow: 'rgba(255, 153, 51, 0.45)',
          muted: '#8E98AB',
          dim: '#5A6376',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin-reverse 16s linear infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        glowPulse: {
          '0%': { opacity: 0.4, transform: 'scale(0.98)' },
          '100%': { opacity: 0.8, transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'gold-glow': '0 0 25px -3px rgba(255, 153, 51, 0.35)',
        'gold-glow-lg': '0 0 45px -5px rgba(255, 153, 51, 0.45)',
        'cyan-glow': '0 0 20px -3px rgba(6, 182, 212, 0.3)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
