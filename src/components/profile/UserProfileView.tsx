import React, { useState, useRef } from 'react';
import { SupportedLanguage, UserProfile, UserRole } from '../../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Camera, 
  MapPin, 
  Phone, 
  User, 
  Globe, 
  LogOut, 
  Edit3, 
  Check, 
  CreditCard, 
  RefreshCw, 
  Tractor, 
  ShoppingBag,
  ShieldCheck,
  Building2,
  FileCode2
} from 'lucide-react';

interface UserProfileViewProps {
  user: UserProfile;
  language: SupportedLanguage;
  onOpenLanguage: () => void;
  onProfileUpdated: (user: UserProfile) => void;
  onLogout: () => void;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenFlutterExport: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  language,
  onOpenLanguage,
  onProfileUpdated,
  onLogout,
  onSwitchRole,
  onOpenFlutterExport,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [village, setVillage] = useState(user.village);
  const [upiId, setUpiId] = useState(user.upiId || '');
  const [farmName, setFarmName] = useState(user.farmName || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedUser: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      village: village.trim() || user.village,
      upiId: upiId.trim() || user.upiId,
      farmName: farmName.trim() || user.farmName,
      photoUrl,
    };

    setTimeout(() => {
      storage.setCurrentUser(updatedUser);
      setIsSaving(false);
      setIsEditing(false);
      onProfileUpdated(updatedUser);
    }, 300);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-emerald-600 to-teal-700" />

        {/* Profile Avatar */}
        <div className="relative z-10 mx-auto w-24 h-24 mt-6 mb-3">
          <img
            src={photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
          />
          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-emerald-700 transition"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-extrabold text-slate-900 font-serif">{user.name}</h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user.village || 'Anand, Gujarat'}</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            {user.role === 'farmer' ? <Tractor className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />}
            <span>{user.role === 'farmer' ? getTranslation(language, 'farmer', 'Dairy Farmer') : getTranslation(language, 'buyer', 'Dairy Buyer')}</span>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-5 w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{getTranslation(language, 'editProfile', 'Edit Profile Details')}</span>
          </button>
        ) : (
          <form onSubmit={handleSaveProfile} className="mt-5 text-left space-y-3 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {getTranslation(language, 'fullName', 'Full Name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {getTranslation(language, 'villageLocation', 'Village / Location')}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
              />
            </div>

            {user.role === 'farmer' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Dairy Farm Name
                  </label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Info List */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Mobile Number</div>
              <div className="text-xs font-extrabold text-slate-800">+91 {user.phone}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Verified
          </span>
        </div>

        {user.upiId && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">UPI Payment ID</div>
                <div className="text-xs font-bold font-mono text-slate-800">{user.upiId}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings & Actions */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2">
        {/* Language selector item */}
        <button
          onClick={onOpenLanguage}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {getTranslation(language, 'selectLanguage', 'App Language')}
              </div>
              <div className="text-[11px] text-slate-500">
                {currentLangObj?.nativeName} ({currentLangObj?.name})
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Change
          </span>
        </button>

        {/* Switch Role Mode */}
        <button
          onClick={() => onSwitchRole(user.role === 'farmer' ? 'buyer' : 'farmer')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {user.role === 'farmer'
                  ? getTranslation(language, 'switchToBuyer', 'Switch to Buyer View')
                  : getTranslation(language, 'switchToFarmer', 'Switch to Farmer View')}
              </div>
              <div className="text-[11px] text-slate-500">
                Instant test mode for marketplace
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            Switch
          </span>
        </button>

        {/* Flutter Source Code & APK Guide */}
        <button
          onClick={onOpenFlutterExport}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 transition border border-emerald-100 bg-emerald-50/40 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">
                {getTranslation(language, 'flutterExport', 'Android Flutter Code & APK')}
              </div>
              <div className="text-[11px] text-emerald-700">
                Browse complete Dart project, schemas, rules & build steps
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
            Open
          </span>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>{getTranslation(language, 'logout', 'Log Out Securely')}</span>
      </button>
    </div>
  );
};
