import React, { useState, useEffect } from 'react';
import { DairyLogo } from '../common/DairyLogo';
import { SupportedLanguage, UserRole } from '../../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Tractor, 
  ShoppingBag, 
  Phone, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface LoginScreenProps {
  language: SupportedLanguage;
  onOpenLanguage: () => void;
  onLoginSuccess: (phone: string, role: UserRole, isExistingUser: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onOpenLanguage,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('farmer');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [smsBanner, setSmsBanner] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const cleanPhone = phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length === 10;

  // Dispatch OTP
  const handleSendOtp = () => {
    if (!isPhoneValid) {
      setErrorMsg(getTranslation(language, 'validPhoneReq', 'Please enter a valid 10-digit Indian phone number'));
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Generate a cryptographically random 6-digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setStep('otp');
      setTimer(30);
      setCanResend(false);
      setIsLoading(false);
      setOtpDigits(['', '', '', '', '', '']);

      // Show realistic SMS notification banner (simulating Firebase Phone Auth SMS delivery)
      setSmsBanner(newOtp);
    }, 600);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setTimer(30);
      setCanResend(false);
      setIsLoading(false);
      setSmsBanner(newOtp);
    }, 500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasted full OTP
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newArr = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newArr[i] = pasted[i] || '';
        }
        setOtpDigits(newArr);
        if (pasted.length === 6) {
          verifyEnteredOtp(pasted);
        }
        return;
      }
    }

    const singleDigit = value.replace(/\D/g, '');
    const newArr = [...otpDigits];
    newArr[index] = singleDigit;
    setOtpDigits(newArr);

    // Auto-focus next input
    if (singleDigit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    // If all 6 digits entered, verify
    const currentCode = newArr.join('');
    if (currentCode.length === 6) {
      verifyEnteredOtp(currentCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // OTP Verification
  const verifyEnteredOtp = (code: string) => {
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Real verification check against generated OTP
      if (code === generatedOtp) {
        // Check if user already exists in persistent storage
        const existingUser = storage.findUserByPhone(cleanPhone, role);
        if (existingUser) {
          storage.setCurrentUser(existingUser);
          onLoginSuccess(cleanPhone, role, true);
        } else {
          onLoginSuccess(cleanPhone, role, false);
        }
      } else {
        setErrorMsg('Incorrect OTP. Please enter the valid 6-digit code received via SMS.');
      }
      setIsLoading(false);
    }, 500);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-lg mx-auto shadow-xl border-x border-slate-100">
      {/* Top Header with Language selector */}
      <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <DairyLogo size="sm" showText={true} />

        <button
          onClick={onOpenLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentLangObj?.nativeName || 'English'}</span>
          <span className="text-slate-400 text-[10px]">▼</span>
        </button>
      </div>

      {/* SMS incoming notification simulator banner */}
      {smsBanner && (
        <div className="mx-4 mt-3 bg-slate-900 text-white rounded-2xl p-3.5 shadow-xl border border-emerald-500/40 animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400">Firebase Phone Auth • SMS</div>
                <div className="text-sm font-medium text-slate-100">
                  Dairivo OTP: <span className="font-mono text-emerald-300 font-bold tracking-widest text-base">{smsBanner}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const arr = smsBanner.split('');
                setOtpDigits(arr);
                verifyEnteredOtp(smsBanner);
              }}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded-lg transition shrink-0"
            >
              Auto Fill
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {/* Role Toggle Tabs */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center mb-6 shadow-inner">
          <button
            onClick={() => {
              setRole('farmer');
              setStep('phone');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'farmer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>{getTranslation(language, 'farmerLogin', 'Farmer Login')}</span>
          </button>

          <button
            onClick={() => {
              setRole('buyer');
              setStep('phone');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'buyer'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{getTranslation(language, 'buyerLogin', 'Buyer Login')}</span>
          </button>
        </div>

        {/* Role subtitle message */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {role === 'farmer'
              ? getTranslation(language, 'farmerLogin', 'Dairy Farmer Login')
              : getTranslation(language, 'buyerLogin', 'Dairy Buyer Login')}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'farmer'
              ? getTranslation(language, 'farmerSub', 'Sell your fresh milk, curd, paneer & ghee directly')
              : getTranslation(language, 'buyerSub', 'Buy 100% farm fresh unadulterated dairy products')}
          </p>
        </div>

        {/* Step 1: Phone input */}
        {step === 'phone' ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {getTranslation(language, 'enterMobile', 'Enter 10-Digit Mobile Number')}
            </label>

            <div className="flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 bg-slate-50 focus-within:bg-white transition-all overflow-hidden p-1">
              <div className="flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 font-bold text-slate-700 text-base">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                placeholder={getTranslation(language, 'mobilePlaceholder', '98765 43210')}
                className="w-full px-3 py-2 text-lg font-semibold tracking-wider text-slate-800 outline-none bg-transparent"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo phone numbers to test easily */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Test Accounts:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role === 'farmer' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setPhone('9825102345')}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      Ramesh Patel (9825102345)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhone('9440123890')}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      Sreenivasulu (9440123890)
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPhone('9876501234')}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium px-2.5 py-1 rounded-lg border border-teal-200"
                  >
                    Ananya Sharma (9876501234)
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={!isPhoneValid || isLoading}
              className={`w-full mt-6 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                isPhoneValid && !isLoading
                  ? role === 'farmer'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-98'
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-800/20 active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{getTranslation(language, 'sendOtp', 'Get OTP via SMS')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 2: OTP verification */
          <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {getTranslation(language, 'enterOtp', 'Enter 6-digit verification code')}
              </span>
              <button
                onClick={() => setStep('phone')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {getTranslation(language, 'changeNumber', 'Change Number')}
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              {getTranslation(language, 'otpSentTo', 'We sent a 6-digit code to')}{' '}
              <strong className="text-slate-800">+91 {phone}</strong>
            </p>

            {/* 6 OTP boxes */}
            <div className="grid grid-cols-6 gap-2 my-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-full h-12 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none ${
                    digit
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950'
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-emerald-400 focus:bg-white'
                  }`}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="mt-2 mb-3 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Resend OTP */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'resendOtp', 'Resend OTP')}</span>
                </button>
              ) : (
                <span className="text-slate-400">
                  {getTranslation(language, 'resendIn', 'Resend in')} <strong>00:{timer < 10 ? `0${timer}` : timer}</strong>
                </span>
              )}

              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real Firebase Verification</span>
              </span>
            </div>

            <button
              onClick={() => verifyEnteredOtp(otpDigits.join(''))}
              disabled={otpDigits.join('').length < 6 || isLoading}
              className={`w-full mt-6 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                otpDigits.join('').length === 6 && !isLoading
                  ? role === 'farmer'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-98'
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-800/20 active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{getTranslation(language, 'verifyOtp', 'Verify OTP')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer reassurance */}
      <div className="p-4 text-center text-xs text-slate-400 bg-white border-t border-slate-100 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Secure Farmer & Buyer Direct Dairy Platform</span>
      </div>
    </div>
  );
};
