import React, { useState } from 'react';
import { DairyProduct, Order, PaymentTransaction, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Package, 
  TrendingUp, 
  IndianRupee, 
  Droplet, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';

interface FarmerHomeProps {
  user: UserProfile;
  language: SupportedLanguage;
  products: DairyProduct[];
  orders: Order[];
  transactions: PaymentTransaction[];
  onNavigateToPost: () => void;
  onRefreshData: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({
  user,
  language,
  products,
  orders,
  transactions,
  onNavigateToPost,
  onRefreshData,
}) => {
  // Filter products belonging to this farmer
  const farmerProducts = products.filter(
    (p) => p.farmerId === user.id || p.farmerPhone === user.phone
  );

  // Compute realistic statistics
  const farmerOrders = orders.filter(
    (o) => o.farmerId === user.id || o.farmerPhone === user.phone
  );

  const pendingOrdersCount = farmerOrders.filter((o) => o.status === 'pending').length;

  const totalDeliveredOrders = farmerOrders.filter((o) => o.status === 'delivered');

  const totalUnitsSold = totalDeliveredOrders.reduce((sum, o) => sum + o.quantity, 0);

  const totalEarnings = transactions
    .filter((t) => t.farmerId === user.id || t.farmerId === 'farmer-1')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleToggleStock = (product: DairyProduct) => {
    const updated = {
      ...product,
      isActive: !product.isActive,
    };
    storage.updateProduct(updated);
    onRefreshData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to remove this product listing?')) {
      storage.deleteProduct(productId);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Farmer Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 shadow-lg">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-300/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  {getTranslation(language, 'welcomeBack', 'Welcome back')}
                </span>
                {user.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                )}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white font-serif">{user.name}</h2>
              <div className="flex items-center gap-1 text-xs text-emerald-100 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{user.village || 'Anand, Gujarat'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPost}
            className="px-3.5 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>{getTranslation(language, 'quickPost', '+ Post Product')}</span>
          </button>
        </div>

        {/* Pending alerts pill if any */}
        {pendingOrdersCount > 0 && (
          <div className="mt-4 pt-3 border-t border-emerald-600/50 flex items-center justify-between text-xs font-medium text-emerald-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>You have <strong>{pendingOrdersCount} pending orders</strong> awaiting response!</span>
            </span>
          </div>
        )}
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {getTranslation(language, 'totalEarnings', 'Total Earnings')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% Verified Sales</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {getTranslation(language, 'litersSold', 'Units Sold')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalUnitsSold} <span className="text-sm font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <span>Delivered Fresh</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {getTranslation(language, 'activeListings', 'Active Listings')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {farmerProducts.filter((p) => p.isActive).length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            of {farmerProducts.length} total listed
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {getTranslation(language, 'orders', 'Total Orders')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {farmerOrders.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {pendingOrdersCount} pending action
          </div>
        </div>
      </div>

      {/* Farmer's Listed Dairy Products Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {getTranslation(language, 'dairyProducts', 'Your Dairy Listings')}
            </h3>
            <p className="text-xs text-slate-500">Live products visible to local buyers</p>
          </div>
          <button
            onClick={onNavigateToPost}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {farmerProducts.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Droplet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">
              {getTranslation(language, 'noProductsYet', 'No products listed yet')}
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Publish milk, curd, paneer, or ghee to start receiving buyer orders!
            </p>
            <button
              onClick={onNavigateToPost}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(language, 'postProductTitle', 'List Fresh Dairy Product')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {farmerProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 transition bg-slate-50/50"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {product.category}
                    </span>
                    {product.fatPercentage && (
                      <span className="text-[10px] font-semibold text-slate-500">
                        {product.fatPercentage}% Fat
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₹{product.pricePerUnit} <span className="text-[11px] font-normal text-slate-500">/{product.unit}</span>
                    </span>
                    <span className="text-slate-500">
                      Stock: <strong className={product.availableQuantity <= 5 ? 'text-rose-600' : 'text-slate-800'}>
                        {product.availableQuantity} {product.unit}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Stock toggle & actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleStock(product)}
                    className="flex items-center gap-1 text-xs font-semibold"
                    title="Toggle In-stock / Out-of-stock"
                  >
                    {product.isActive ? (
                      <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span className="text-[11px] font-bold">Active</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                        <ToggleLeft className="w-5 h-5" />
                        <span className="text-[11px]">Paused</span>
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
