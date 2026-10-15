import React, { useState, useRef } from 'react';
import { SupportedLanguage, UserProfile, UserRole } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Camera, 
  Upload, 
  MapPin, 
  User, 
  Phone, 
  Tractor, 
  ShoppingBag, 
  Check, 
  AlertCircle,
  CreditCard,
  Building2
} from 'lucide-react';

interface ProfileSetupScreenProps {
  phone: string;
  initialRole: UserRole;
  language: SupportedLanguage;
  onProfileSaved: (user: UserProfile) => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  phone,
  initialRole,
  language,
  onProfileSaved,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [farmName, setFarmName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cattleCount, setCattleCount] = useState<number>(5);
  const [photoUrl, setPhotoUrl] = useState<string>(
    role === 'farmer'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(getTranslation(language, 'requiredField', 'Full Name is required'));
      return;
    }
    if (!village.trim()) {
      setErrorMsg(getTranslation(language, 'requiredField', 'Village or location is required'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone,
      role,
      village: village.trim(),
      photoUrl,
      upiId: upiId.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@upi`,
      farmName: farmName.trim() || (role === 'farmer' ? `${name.trim()} Dairy Farm` : undefined),
      cattleCount: role === 'farmer' ? cattleCount : undefined,
      joinedAt: new Date().toISOString(),
      isVerified: true,
    };

    // Save to Firestore & local storage
    setTimeout(() => {
      storage.setCurrentUser(newUser);
      setIsSubmitting(false);
      onProfileSaved(newUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-lg mx-auto shadow-xl border-x border-slate-100 p-6">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
            {getTranslation(language, 'profileSetupTitle', 'Complete Your Profile')}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {getTranslation(language, 'profileSetupSub', 'Help your village community recognize you')}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Photo Picker */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative group">
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md ring-4 ring-emerald-100"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white transition transform active:scale-95"
                title={getTranslation(language, 'uploadPhoto', 'Upload Photo')}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>{getTranslation(language, 'uploadPhoto', 'Upload / Take Photo')}</span>
              </button>
            </div>
          </div>

          {/* Account Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {getTranslation(language, 'accountType', 'Account Type')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition text-left ${
                  role === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Tractor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold">{getTranslation(language, 'farmer', 'Dairy Farmer')}</div>
                  <div className="text-[10px] text-slate-500">Sell Milk & Ghee</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition text-left ${
                  role === 'buyer'
                    ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'buyer' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold">{getTranslation(language, 'buyer', 'Dairy Buyer')}</div>
                  <div className="text-[10px] text-slate-500">Buy Fresh Products</div>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name / Dairy Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {getTranslation(language, 'fullName', 'Full Name / Business Name')} *
            </label>
            <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-500 bg-white px-3.5 py-2.5 shadow-2xs">
              <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getTranslation(language, 'fullNamePlaceholder', 'e.g. Ramesh Patel or Sri Lakshmi Dairy')}
                className="w-full text-sm font-medium text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Village / Town / Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {getTranslation(language, 'villageLocation', 'Village / Town / Location')} *
            </label>
            <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-500 bg-white px-3.5 py-2.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={getTranslation(language, 'villagePlaceholder', 'e.g. Anand, Vadodara Highway')}
                className="w-full text-sm font-medium text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Mobile Number (Read-only verified) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Verified Mobile Number
            </label>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-slate-600 text-sm font-semibold">
              <Phone className="w-4 h-4 text-emerald-600 mr-2" />
              <span>+91 {phone}</span>
              <span className="ml-auto text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          </div>

          {/* Extra Farmer Fields */}
          {role === 'farmer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dairy Farm Name (Optional)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-500 bg-white px-3.5 py-2.5 shadow-2xs">
                  <Building2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Krishna Gaushala & Dairy"
                    className="w-full text-sm font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'upiIdLabel', 'UPI ID (For Direct Payments)')}
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-500 bg-white px-3.5 py-2.5 shadow-2xs">
                  <CreditCard className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder={getTranslation(language, 'upiPlaceholder', 'e.g. farmer@okaxis')}
                    className="w-full text-sm font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cows / Buffaloes Count: <span className="text-emerald-700 font-extrabold">{cattleCount}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={cattleCount}
                  onChange={(e) => setCattleCount(parseInt(e.target.value) || 1)}
                  className="w-full accent-emerald-600"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-700/20 active:scale-98 transition flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>{getTranslation(language, 'saveAndContinue', 'Save & Continue')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
