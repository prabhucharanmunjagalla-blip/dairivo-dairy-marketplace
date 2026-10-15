import React from 'react';

interface DairyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const DairyLogo: React.FC<DairyLogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-md shadow-emerald-700/20 p-2 text-white overflow-hidden ring-2 ring-emerald-200/50`}>
        {/* Glow & shape accents */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-400/30 blur-sm pointer-events-none" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-teal-300/30 blur-sm pointer-events-none" />

        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
          {/* Milk Can / Pitcher Base */}
          <path
            d="M17 14C17 12.8954 17.8954 12 19 12H29C30.1046 12 31 12.8954 31 14V17H17V14Z"
            fill="#FFFFFF"
          />
          <path
            d="M15 17H33L36 24V40C36 41.1046 35.1046 42 34 42H14C12.8954 42 12 41.1046 12 40V24L15 17Z"
            fill="#FFFFFF"
          />
          {/* Green pasture leaf curve */}
          <path
            d="M16 28C20 28 22 36 32 35C28 39 18 40 16 28Z"
            fill="#10B981"
          />
          {/* Golden milk drop */}
          <path
            d="M24 20C24 20 20 26 20 28.5C20 30.7 21.8 32.5 24 32.5C26.2 32.5 28 30.7 28 28.5C28 26 24 20 24 20Z"
            fill="#FBBF24"
          />
          {/* Milk droplet splashes */}
          <circle cx="24" cy="7" r="2.5" fill="#FFFFFF" />
          <path
            d="M21 7C21 8.5 24 11 24 11C24 11 27 8.5 27 7C27 5.34315 25.6569 4 24 4C22.3431 4 21 5.34315 21 7Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight text-emerald-950 font-serif ${textSizes[size]}`}>
            Dairivo
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
            Pure Dairy Direct
          </span>
        </div>
      )}
    </div>
  );
};
