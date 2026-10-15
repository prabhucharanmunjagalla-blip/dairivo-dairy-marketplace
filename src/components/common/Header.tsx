import React from 'react';
import { DairyLogo } from './DairyLogo';
import { SupportedLanguage, UserRole } from '../../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../translations';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  FileCode, 
  Tractor, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  language: SupportedLanguage;
  role: UserRole;
  isPhoneFrame: boolean;
  onOpenLanguage: () => void;
  onTogglePhoneFrame: () => void;
  onSwitchRole: () => void;
  onOpenFlutterExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  role,
  isPhoneFrame,
  onOpenLanguage,
  onTogglePhoneFrame,
  onSwitchRole,
  onOpenFlutterExport,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left Brand */}
        <DairyLogo size="sm" showText={true} />

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Role badge with instant switch button */}
          <button
            onClick={onSwitchRole}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs border ${
              role === 'farmer'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
            }`}
            title="Switch between Farmer Mode and Buyer Mode"
          >
            {role === 'farmer' ? <Tractor className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />}
            <span>{role === 'farmer' ? 'Farmer View' : 'Buyer View'}</span>
            <RefreshCw className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Language Selector */}
          <button
            onClick={onOpenLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            title="Change Language"
          >
            <span className="text-sm">{currentLangObj?.flag || '🇮🇳'}</span>
            <span className="hidden xs:inline font-bold">{currentLangObj?.nativeName || 'English'}</span>
          </button>

          {/* Flutter Source & APK button */}
          <button
            onClick={onOpenFlutterExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            title="Inspect Flutter Dart code, rules, and build APK"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Flutter Code & APK</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={onTogglePhoneFrame}
            className={`p-2 rounded-xl border text-xs font-semibold transition ${
              isPhoneFrame
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isPhoneFrame ? 'Switch to Fullscreen View' : 'Switch to Mobile Phone View'}
          >
            {isPhoneFrame ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
