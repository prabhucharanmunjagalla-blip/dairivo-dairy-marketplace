export type UserRole = 'farmer' | 'buyer';

export type SupportedLanguage = 
  | 'en' // English
  | 'te' // Telugu (తెలుగు)
  | 'hi' // Hindi (हिन्दी)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'bn' // Bengali (বাংলা)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'mr' // Marathi (मराठी)
  | 'pa'; // Punjabi (ਪੰਜਾਬੀ)

export type ProductCategory = 'milk' | 'curd' | 'paneer' | 'butter' | 'ghee' | 'other';

export type ProductUnit = 'L' | 'kg' | 'packet' | 'ml';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  village: string;
  district?: string;
  state?: string;
  photoUrl: string;
  upiId?: string;
  farmName?: string;
  cattleCount?: number;
  joinedAt: string;
  isVerified?: boolean;
}

export interface DairyProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  name: string;
  category: ProductCategory;
  description: string;
  pricePerUnit: number;
  unit: ProductUnit;
  availableQuantity: number;
  totalQuantity: number;
  imageUrl: string;
  fatPercentage?: number;
  snfPercentage?: number;
  milkingSession?: 'morning' | 'evening' | 'both';
  createdAt: string;
  isActive: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  productImageUrl: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  totalPrice: number;
  deliveryAddress: string;
  deliverySlot?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  farmerId: string;
  buyerName: string;
  productName: string;
  amount: number;
  status: 'completed' | 'pending';
  method: PaymentMethod;
  date: string;
  referenceNo: string;
}

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}
