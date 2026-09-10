import confetti from 'canvas-confetti';

export const triggerConfetti = (originY = 0.6) => {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: originY },
      colors: ['#FF9933', '#F59E0B', '#FBBF24', '#06B6D4', '#FFFFFF'],
      disableForReducedMotion: true,
      zIndex: 99999,
    });
  } catch {
    // fallback if canvas not available
  }
};

export const triggerStarBurst = () => {
  try {
    confetti({
      shapes: ['star', 'circle'],
      particleCount: 40,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FF9933', '#FFD700', '#FBBF24', '#38BDF8'],
      zIndex: 99999,
    });
  } catch {
    // ignore
  }
};
