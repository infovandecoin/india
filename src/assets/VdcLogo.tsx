import React from 'react';

export interface VdcLogoProps {
  className?: string;
  size?: number;
  variant?: 'mark' | 'full' | 'dark' | 'coin' | 'badge';
  animated?: boolean;
  showSubtitle?: boolean;
}

export const VdcLogo: React.FC<VdcLogoProps> = ({
  className = '',
  size = 32,
  variant = 'mark',
  animated = false,
  showSubtitle = true,
}) => {
  // Official Tri-Color Mark (Saffron wing + Radiant Golden Chakra torch + Emerald wing)
  if (variant === 'mark') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/images/vdc-mark.png"
          alt="VandeCoin Mark"
          width={size}
          height={size}
          className={`w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,153,51,0.25)] transition-transform duration-300 ${
            animated ? 'animate-pulse-slow scale-105 drop-shadow-[0_0_12px_rgba(255,153,51,0.6)]' : ''
          }`}
          loading="eager"
        />
      </div>
    );
  }

  // 3D Physical Embossed Gold Coin with Circuitry & Rim Inscription
  if (variant === 'coin') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/images/vdc-coin.png"
          alt="VandeCoin 3D Minted Coin"
          width={size}
          height={size}
          className={`w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(255,184,108,0.35)] transition-all duration-300 ${
            animated ? 'animate-spin-slow hover:scale-105' : ''
          }`}
          loading="eager"
        />
      </div>
    );
  }

  // Dark 3D Emblem with Slogan
  if (variant === 'dark') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/images/vdc-dark.png"
          alt="VandeCoin Dark Emblem"
          className="w-full h-full object-contain rounded-2xl"
          loading="eager"
        />
      </div>
    );
  }

  // Glassmorphic Golden Badge Tile
  if (variant === 'badge') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center p-2 rounded-2xl bg-[#141824]/90 border border-[#FF9933]/30 shadow-gold-glow backdrop-blur-md ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/images/vdc-mark.png"
          alt="VandeCoin Badge"
          className={`w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,153,51,0.4)] ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      </div>
    );
  }

  // Default 'full' variant: Mark + Typography Lockup
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src="/images/vdc-mark.png"
          alt="VandeCoin"
          width={size}
          height={size}
          className={`w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,153,51,0.3)] ${
            animated ? 'animate-pulse' : ''
          }`}
        />
      </div>
      <div className="flex flex-col leading-none text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-wider text-white text-base font-sans">
            VANDE<span className="text-[#FF9933]">COIN</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30">
            VDC
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[8px] font-mono font-semibold tracking-widest text-[#009944] uppercase mt-1">
            BUILT FOR A BRIGHTER INDIA
          </span>
        )}
      </div>
    </div>
  );
};

// Standalone 3D Coin Component with tactile lighting and dynamic states
interface VdcCoinProps {
  size?: number;
  className?: string;
  glow?: boolean;
  spin?: boolean;
  float?: boolean;
}

export const VdcCoin: React.FC<VdcCoinProps> = ({
  size = 120,
  className = '',
  glow = true,
  spin = false,
  float = false,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div className="absolute inset-0 rounded-full bg-[#FF9933]/20 blur-xl scale-110 pointer-events-none animate-pulse-slow" />
      )}
      <img
        src="/images/vdc-coin.png"
        alt="VandeCoin 3D Physical Coin"
        width={size}
        height={size}
        className={`w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] ${
          spin ? 'animate-spin-slow' : ''
        } ${float ? 'animate-float' : ''}`}
        loading="eager"
      />
    </div>
  );
};
