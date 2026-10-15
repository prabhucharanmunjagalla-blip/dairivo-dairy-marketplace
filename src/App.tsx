/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DairyProduct, 
  Order, 
  PaymentTransaction, 
  SupportedLanguage, 
  UserProfile, 
  UserRole 
} from './types';
import { storage } from './data/storage';
import { getTranslation } from './translations';

import { SplashScreen } from './components/auth/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { ProfileSetupScreen } from './components/auth/ProfileSetupScreen';
import { Header } from './components/common/Header';
import { LanguageModal } from './components/common/LanguageModal';
import { FarmerHome } from './components/farmer/FarmerHome';
import { FarmerOrders } from './components/farmer/FarmerOrders';
import { PostProductScreen } from './components/farmer/PostProductScreen';
import { FarmerPayments } from './components/farmer/FarmerPayments';
import { BuyerMarketplace } from './components/buyer/BuyerMarketplace';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { UserProfileView } from './components/profile/UserProfileView';
import { FlutterProjectViewer } from './components/flutter_export/FlutterProjectViewer';

import { 
  Home, 
  Package, 
  PlusCircle, 
  IndianRupee, 
  User as UserIcon, 
  ShoppingBag, 
  ClipboardList, 
  Smartphone,
  RefreshCw,
  Tractor,
  Layers
} from 'lucide-react';

export default function App() {
  // App lifecycle state
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => storage.getCurrentUser());
  const [setupUserPhone, setSetupUserPhone] = useState<string | null>(null);
  const [setupInitialRole, setSetupInitialRole] = useState<UserRole>('farmer');
  
  // App Language
  const [language, setLanguage] = useState<SupportedLanguage>(() => storage.getLanguage());
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // App Navigation Tabs
  // For Farmer: 'home' | 'orders' | 'post' | 'payments' | 'profile'
  // For Buyer: 'marketplace' | 'orders' | 'profile'
  const [farmerTab, setFarmerTab] = useState<'home' | 'orders' | 'post' | 'payments' | 'profile'>('home');
  const [buyerTab, setBuyerTab] = useState<'marketplace' | 'orders' | 'profile'>('marketplace');

  // Device layout: Phone frame view vs Responsive fullscreen
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Flutter source code explorer modal
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  // App Data (synced from storage)
  const [products, setProducts] = useState<DairyProduct[]>(() => storage.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => storage.getTransactions());

  const refreshAppData = () => {
    setProducts(storage.getProducts());
    setOrders(storage.getOrders());
    setTransactions(storage.getTransactions());
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    storage.setLanguage(lang);
  };

  const handleLoginSuccess = (phone: string, role: UserRole, isExistingUser: boolean) => {
    if (isExistingUser) {
      const user = storage.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setFarmerTab('home');
        setBuyerTab('marketplace');
      }
    } else {
      setSetupUserPhone(phone);
      setSetupInitialRole(role);
    }
  };

  const handleProfileSaved = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    setSetupUserPhone(null);
    setFarmerTab('home');
    setBuyerTab('marketplace');
    refreshAppData();
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setSetupUserPhone(null);
    setShowSplash(false);
  };

  const handleSwitchRole = (forcedRole?: UserRole) => {
    if (!currentUser) return;
    const targetRole = forcedRole || (currentUser.role === 'farmer' ? 'buyer' : 'farmer');
    
    // Look up existing matching profile or toggle role
    const updated: UserProfile = {
      ...currentUser,
      role: targetRole,
    };
    storage.setCurrentUser(updated);
    setCurrentUser(updated);
    if (targetRole === 'farmer') {
      setFarmerTab('home');
    } else {
      setBuyerTab('marketplace');
    }
  };

  // 1. Splash Screen
  if (showSplash) {
    return (
      <SplashScreen
        language={language}
        onComplete={() => setShowSplash(false)}
      />
    );
  }

  // 2. Profile Setup Screen for new users
  if (!currentUser && setupUserPhone) {
    return (
      <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-2 flex flex-col justify-center">
        <ProfileSetupScreen
          phone={setupUserPhone}
          initialRole={setupInitialRole}
          language={language}
          onProfileSaved={handleProfileSaved}
        />
        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          currentLanguage={language}
          onSelectLanguage={handleLanguageChange}
        />
      </div>
    );
  }

  // 3. Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center sm:py-6 px-2">
        <LoginScreen
          language={language}
          onOpenLanguage={() => setIsLanguageModalOpen(true)}
          onLoginSuccess={handleLoginSuccess}
        />
        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          currentLanguage={language}
          onSelectLanguage={handleLanguageChange}
        />
        <FlutterProjectViewer
          isOpen={isFlutterModalOpen}
          onClose={() => setIsFlutterModalOpen(false)}
        />
      </div>
    );
  }

  // Active user's role
  const isFarmer = currentUser.role === 'farmer';

  // Compute pending badge counts
  const farmerPendingOrders = orders.filter(
    (o) => (o.farmerId === currentUser.id || o.farmerPhone === currentUser.phone) && o.status === 'pending'
  ).length;

  const buyerActiveOrders = orders.filter(
    (o) => (o.buyerId === currentUser.id || o.buyerPhone === currentUser.phone) && o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Universal Top Header */}
      <Header
        language={language}
        role={currentUser.role}
        isPhoneFrame={isPhoneFrame}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onSwitchRole={() => handleSwitchRole()}
        onOpenFlutterExport={() => setIsFlutterModalOpen(true)}
      />

      {/* Main Container: Mobile Frame vs Full Screen */}
      <main className="flex-1 flex justify-center py-0 sm:py-6 px-0 sm:px-4">
        <div
          className={`w-full transition-all duration-300 flex flex-col ${
            isPhoneFrame
              ? 'max-w-[440px] bg-slate-50 min-h-[840px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden relative'
              : 'max-w-4xl bg-slate-50 min-h-screen sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative'
          }`}
        >
          {/* Simulated Mobile Status Notch (shown when in phone frame) */}
          {isPhoneFrame && (
            <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-white text-slate-800 text-[11px] font-semibold select-none border-b border-slate-100">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Role test quick switcher pill */}
          <div className="bg-emerald-900/90 text-white px-4 py-1.5 flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                Testing as: <strong>{currentUser.name}</strong> ({isFarmer ? 'Dairy Farmer' : 'Dairy Buyer'})
              </span>
            </span>

            <button
              onClick={() => handleSwitchRole()}
              className="text-[11px] font-bold bg-white text-emerald-950 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Switch to {isFarmer ? 'Buyer' : 'Farmer'}</span>
            </button>
          </div>

          {/* Dynamic Screen Body */}
          <div className="flex-1 p-4 overflow-y-auto pb-24">
            {isFarmer ? (
              // FARMER TABS
              <>
                {farmerTab === 'home' && (
                  <FarmerHome
                    user={currentUser}
                    language={language}
                    products={products}
                    orders={orders}
                    transactions={transactions}
                    onNavigateToPost={() => setFarmerTab('post')}
                    onRefreshData={refreshAppData}
                  />
                )}
                {farmerTab === 'orders' && (
                  <FarmerOrders
                    user={currentUser}
                    language={language}
                    orders={orders}
                    onOrderUpdated={refreshAppData}
                  />
                )}
                {farmerTab === 'post' && (
                  <PostProductScreen
                    user={currentUser}
                    language={language}
                    onProductCreated={() => {
                      refreshAppData();
                      setFarmerTab('home');
                    }}
                  />
                )}
                {farmerTab === 'payments' && (
                  <FarmerPayments
                    user={currentUser}
                    language={language}
                    orders={orders}
                    transactions={transactions}
                  />
                )}
                {farmerTab === 'profile' && (
                  <UserProfileView
                    user={currentUser}
                    language={language}
                    onOpenLanguage={() => setIsLanguageModalOpen(true)}
                    onProfileUpdated={(updated) => setCurrentUser(updated)}
                    onLogout={handleLogout}
                    onSwitchRole={handleSwitchRole}
                    onOpenFlutterExport={() => setIsFlutterModalOpen(true)}
                  />
                )}
              </>
            ) : (
              // BUYER TABS
              <>
                {buyerTab === 'marketplace' && (
                  <BuyerMarketplace
                    user={currentUser}
                    language={language}
                    products={products}
                    onOrderPlaced={refreshAppData}
                    onNavigateToOrders={() => setBuyerTab('orders')}
                  />
                )}
                {buyerTab === 'orders' && (
                  <BuyerOrders
                    user={currentUser}
                    language={language}
                    orders={orders}
                    onOrderUpdated={refreshAppData}
                    onNavigateToMarketplace={() => setBuyerTab('marketplace')}
                  />
                )}
                {buyerTab === 'profile' && (
                  <UserProfileView
                    user={currentUser}
                    language={language}
                    onOpenLanguage={() => setIsLanguageModalOpen(true)}
                    onProfileUpdated={(updated) => setCurrentUser(updated)}
                    onLogout={handleLogout}
                    onSwitchRole={handleSwitchRole}
                    onOpenFlutterExport={() => setIsFlutterModalOpen(true)}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom Navigation Bar */}
          <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-20 shadow-lg">
            {isFarmer ? (
              // 5 Farmer Bottom Navigation Tabs
              <>
                <button
                  onClick={() => setFarmerTab('home')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                    farmerTab === 'home'
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home className={`w-5 h-5 ${farmerTab === 'home' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-1">{getTranslation(language, 'home', 'Home')}</span>
                </button>

                <button
                  onClick={() => setFarmerTab('orders')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl relative transition ${
                    farmerTab === 'orders'
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Package className={`w-5 h-5 ${farmerTab === 'orders' ? 'stroke-[2.5]' : ''}`} />
                  {farmerPendingOrders > 0 && (
                    <span className="absolute top-0 right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                      {farmerPendingOrders}
                    </span>
                  )}
                  <span className="text-[10px] mt-1">{getTranslation(language, 'orders', 'Orders')}</span>
                </button>

                {/* Central Post Product Tab */}
                <button
                  onClick={() => setFarmerTab('post')}
                  className="flex flex-col items-center -mt-5"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition active:scale-95 ${
                    farmerTab === 'post' ? 'bg-emerald-700 ring-4 ring-emerald-200' : 'bg-emerald-600'
                  }`}>
                    <PlusCircle className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] mt-1 font-bold ${farmerTab === 'post' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {getTranslation(language, 'postProduct', 'Post')}
                  </span>
                </button>

                <button
                  onClick={() => setFarmerTab('payments')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                    farmerTab === 'payments'
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <IndianRupee className={`w-5 h-5 ${farmerTab === 'payments' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-1">{getTranslation(language, 'payments', 'Payments')}</span>
                </button>

                <button
                  onClick={() => setFarmerTab('profile')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                    farmerTab === 'profile'
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <UserIcon className={`w-5 h-5 ${farmerTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-1">{getTranslation(language, 'profile', 'Profile')}</span>
                </button>
              </>
            ) : (
              // 3 Buyer Bottom Navigation Tabs
              <>
                <button
                  onClick={() => setBuyerTab('marketplace')}
                  className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${
                    buyerTab === 'marketplace'
                      ? 'text-teal-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 ${buyerTab === 'marketplace' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-1">{getTranslation(language, 'marketplace', 'Marketplace')}</span>
                </button>

                <button
                  onClick={() => setBuyerTab('orders')}
                  className={`flex flex-col items-center py-1 px-4 rounded-xl relative transition ${
                    buyerTab === 'orders'
                      ? 'text-teal-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ClipboardList className={`w-5 h-5 ${buyerTab === 'orders' ? 'stroke-[2.5]' : ''}`} />
                  {buyerActiveOrders > 0 && (
                    <span className="absolute top-0 right-3 w-4 h-4 bg-teal-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                      {buyerActiveOrders}
                    </span>
                  )}
                  <span className="text-[10px] mt-1">{getTranslation(language, 'myOrders', 'My Orders')}</span>
                </button>

                <button
                  onClick={() => setBuyerTab('profile')}
                  className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${
                    buyerTab === 'profile'
                      ? 'text-teal-700 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <UserIcon className={`w-5 h-5 ${buyerTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-1">{getTranslation(language, 'profile', 'Profile')}</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </main>

      {/* Global Modals */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={handleLanguageChange}
      />

      <FlutterProjectViewer
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
    </div>
  );
}
