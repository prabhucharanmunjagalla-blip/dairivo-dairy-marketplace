import React, { useState, useRef } from 'react';
import { DairyProduct, ProductCategory, ProductUnit, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Camera, 
  Upload, 
  IndianRupee, 
  Check, 
  AlertCircle, 
  Droplet, 
  Sparkles, 
  ShieldCheck,
  Milk,
  Layers
} from 'lucide-react';

interface PostProductScreenProps {
  user: UserProfile;
  language: SupportedLanguage;
  onProductCreated: () => void;
}

const CATEGORY_PRESETS: { category: ProductCategory; labelKey: string; defaultUnit: ProductUnit; defaultPrice: number; sampleImage: string }[] = [
  { 
    category: 'milk', 
    labelKey: 'milk', 
    defaultUnit: 'L', 
    defaultPrice: 65,
    sampleImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
  },
  { 
    category: 'curd', 
    labelKey: 'curd', 
    defaultUnit: 'kg', 
    defaultPrice: 80,
    sampleImage: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80'
  },
  { 
    category: 'paneer', 
    labelKey: 'paneer', 
    defaultUnit: 'kg', 
    defaultPrice: 350,
    sampleImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  { 
    category: 'butter', 
    labelKey: 'butter', 
    defaultUnit: 'kg', 
    defaultPrice: 420,
    sampleImage: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    category: 'ghee', 
    labelKey: 'ghee', 
    defaultUnit: 'kg', 
    defaultPrice: 1200,
    sampleImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
  },
  { 
    category: 'other', 
    labelKey: 'other', 
    defaultUnit: 'L', 
    defaultPrice: 100,
    sampleImage: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80'
  },
];

export const PostProductScreen: React.FC<PostProductScreenProps> = ({
  user,
  language,
  onProductCreated,
}) => {
  const [category, setCategory] = useState<ProductCategory>('milk');
  const [name, setName] = useState('Pure Farm Fresh Cow Milk');
  const [pricePerUnit, setPricePerUnit] = useState<number>(65);
  const [unit, setUnit] = useState<ProductUnit>('L');
  const [availableQuantity, setAvailableQuantity] = useState<number>(30);
  const [description, setDescription] = useState('Fresh morning milking, 100% pure, unadulterated, tested high fat and density.');
  const [fatPercentage, setFatPercentage] = useState<string>('6.5');
  const [snfPercentage, setSnfPercentage] = useState<string>('8.8');
  const [milkingSession, setMilkingSession] = useState<'morning' | 'evening' | 'both'>('morning');
  const [imageUrl, setImageUrl] = useState<string>(CATEGORY_PRESETS[0].sampleImage);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectCategory = (cat: ProductCategory) => {
    setCategory(cat);
    const preset = CATEGORY_PRESETS.find((p) => p.category === cat);
    if (preset) {
      setUnit(preset.defaultUnit);
      setPricePerUnit(preset.defaultPrice);
      setImageUrl(preset.sampleImage);
      if (cat === 'milk') setName('Pure Fresh Desi Milk');
      else if (cat === 'curd') setName('Fresh Clay Matka Curd (Dahi)');
      else if (cat === 'paneer') setName('Fresh Soft Farm Malai Paneer');
      else if (cat === 'butter') setName('Desi White Farm Butter (Makkhan)');
      else if (cat === 'ghee') setName('Pure A2 Desi Bilona Cow Ghee');
      else setName('Farm Special Dairy Item');
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(getTranslation(language, 'requiredField', 'Product Name is required'));
      return;
    }
    if (!pricePerUnit || pricePerUnit <= 0) {
      setErrorMsg('Price must be greater than zero');
      return;
    }
    if (!availableQuantity || availableQuantity <= 0) {
      setErrorMsg('Available quantity must be greater than zero');
      return;
    }
    if (!imageUrl) {
      setErrorMsg('Please upload a product photo');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const newProduct: DairyProduct = {
      id: `prod-${Date.now()}`,
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      farmerLocation: user.village || 'Anand, Gujarat',
      name: name.trim(),
      category,
      description: description.trim(),
      pricePerUnit: Number(pricePerUnit),
      unit,
      availableQuantity: Number(availableQuantity),
      totalQuantity: Number(availableQuantity),
      imageUrl,
      fatPercentage: fatPercentage ? parseFloat(fatPercentage) : undefined,
      snfPercentage: snfPercentage ? parseFloat(snfPercentage) : undefined,
      milkingSession,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // Save to Firestore / local storage
    setTimeout(() => {
      storage.addProduct(newProduct);
      setIsSubmitting(false);
      onProductCreated();
    }, 400);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-slate-900 font-serif">
          {getTranslation(language, 'postProductTitle', 'List Fresh Dairy Product')}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {getTranslation(language, 'postProductSubtitle', 'Reach local buyers within minutes')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {getTranslation(language, 'category', 'Category')} *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_PRESETS.map((item) => {
              const isSelected = category === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => handleSelectCategory(item.category)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{getTranslation(language, item.labelKey, item.category)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Photo Upload with Camera / Gallery */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {getTranslation(language, 'productPhoto', 'Product Photo')} *
          </label>
          <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-2 flex flex-col items-center justify-center group">
            {imageUrl ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Change Photo</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-8 flex flex-col items-center cursor-pointer text-slate-400 hover:text-emerald-600"
              >
                <Camera className="w-10 h-10 mb-2" />
                <span className="text-xs font-bold text-slate-700">Take Photo or Upload Image</span>
                <span className="text-[10px] text-slate-400">JPG, PNG supported</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFile}
            />

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Device Camera / Gallery</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {getTranslation(language, 'productName', 'Product Name')} *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pure Buffalo Milk (Morning)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm font-medium outline-none"
          />
        </div>

        {/* Price, Unit & Available Quantity */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {getTranslation(language, 'pricePerUnit', 'Price (₹)')} *
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-emerald-500 px-2.5 py-2 bg-white">
              <span className="text-slate-400 text-sm font-bold mr-1">₹</span>
              <input
                type="number"
                min={1}
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full text-sm font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {getTranslation(language, 'unit', 'Unit')}
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as ProductUnit)}
              className="w-full py-2.5 px-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none"
            >
              <option value="L">Liter (L)</option>
              <option value="kg">Kilogram (Kg)</option>
              <option value="packet">Packet</option>
              <option value="ml">Milliliter (ml)</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min={1}
              required
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm font-bold outline-none"
            />
          </div>
        </div>

        {/* Quality: Fat % & SNF % (Crucial for Indian Dairy standards) */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fat % (Cream)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={fatPercentage}
              onChange={(e) => setFatPercentage(e.target.value)}
              placeholder="e.g. 6.5"
              className="w-full px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>SNF % (Solids)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={snfPercentage}
              onChange={(e) => setSnfPercentage(e.target.value)}
              placeholder="e.g. 9.0"
              className="w-full px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs font-bold text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Milking Session */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {getTranslation(language, 'milkingSession', 'Milking Session')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'morning', label: 'Morning Fresh 🌅' },
              { id: 'evening', label: 'Evening Fresh 🌇' },
              { id: 'both', label: 'All Day Fresh 🥛' },
            ].map((sess) => (
              <button
                key={sess.id}
                type="button"
                onClick={() => setMilkingSession(sess.id as any)}
                className={`py-2 px-2 rounded-xl border text-xs font-medium transition ${
                  milkingSession === sess.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {sess.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {getTranslation(language, 'description', 'Description & Purity Note')}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={getTranslation(language, 'descPlaceholder', 'e.g. Pure Desi Murrah Buffalo milk, fresh morning milking')}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs font-medium outline-none"
          />
        </div>

        {/* Farmer Info Auto-Fill Confirmation */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-800">Listed by: {user.name}</div>
            <div className="text-[11px] text-slate-500">Location: {user.village || 'Anand, Gujarat'}</div>
          </div>
          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
            Verified Farmer
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-700/20 active:scale-98 transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>{getTranslation(language, 'publishProduct', 'Publish Product Now')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
