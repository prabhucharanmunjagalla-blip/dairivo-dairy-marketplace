import React, { useEffect, useState } from 'react';
import { DairyLogo } from '../common/DairyLogo';
import { SupportedLanguage } from '../../types';
import { getTranslation } from '../../translations';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  language: SupportedLanguage;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds navigation requirement

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 text-white p-6 overflow-hidden select-none">
      {/* Decorative background dairy elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      {/* Subtle organic milk wave pattern */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full fill-white preserve-3d">
          <path d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,122.7C672,128,768,192,864,213.3C960,235,1056,213,1152,181.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Top Tag */}
      <div className="pt-8 flex items-center gap-2 bg-emerald-900/40 px-4 py-1.5 rounded-full border border-emerald-500/30 text-emerald-200 text-xs font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>India's Pure Dairy Marketplace</span>
      </div>

      {/* Center Branding & Logo */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="transform transition-transform duration-700 scale-110 mb-6 drop-shadow-2xl">
          <DairyLogo size="xl" showText={false} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 font-serif">
          {getTranslation(language, 'appName', 'Dairivo')}
        </h1>

        <p className="text-emerald-100 font-medium text-base sm:text-lg max-w-xs mx-auto leading-snug">
          {getTranslation(language, 'appTagline', 'Pure Dairy From Village Farmers')}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-300 font-semibold tracking-wider uppercase">
          <span>Milk</span> • <span>Curd</span> • <span>Paneer</span> • <span>Ghee</span> • <span>Butter</span>
        </div>
      </div>

      {/* Bottom Progress & Skip button */}
      <div className="w-full max-w-xs pb-8 flex flex-col items-center gap-3">
        {/* Progress bar */}
        <div className="w-full bg-emerald-950/60 rounded-full h-1.5 overflow-hidden p-0.5 border border-emerald-600/30">
          <div
            className="bg-gradient-to-r from-emerald-300 to-yellow-300 h-full rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onComplete}
          className="text-xs text-emerald-200/80 hover:text-white flex items-center gap-1.5 transition py-1 px-3 rounded-lg hover:bg-emerald-800/40"
        >
          <span>Skip to Login</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
