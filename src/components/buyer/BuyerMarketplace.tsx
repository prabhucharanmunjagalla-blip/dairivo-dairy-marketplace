import React, { useState } from 'react';
import { DairyProduct, Order, ProductCategory, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Search, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Droplet, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Minus, 
  X, 
  Check, 
  AlertCircle,
  Truck,
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuyerMarketplaceProps {
  user: UserProfile;
  language: SupportedLanguage;
  products: DairyProduct[];
  onOrderPlaced: () => void;
  onNavigateToOrders: () => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  user,
  language,
  products,
  onOrderPlaced,
  onNavigateToOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<DairyProduct | null>(null);

  // Order modal state
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(user.village || '');
  const [deliverySlot, setDeliverySlot] = useState<string>('Early Morning (6:00 AM - 8:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'bank_transfer'>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState<Order | null>(null);

  // Filter products: active, in stock, matching category and search query
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchFarmer = p.farmerName.toLowerCase().includes(q);
      const matchLocation = p.farmerLocation.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      return matchName || matchFarmer || matchLocation || matchCategory;
    }
    return true;
  });

  const handleOpenOrderModal = (product: DairyProduct) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setDeliveryAddress(user.village || '');
    setErrorMsg('');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!deliveryAddress.trim()) {
      setErrorMsg(getTranslation(language, 'requiredField', 'Delivery Address is required'));
      return;
    }

    if (orderQuantity <= 0) {
      setErrorMsg('Quantity must be at least 1');
      return;
    }

    if (orderQuantity > selectedProduct.availableQuantity) {
      setErrorMsg(getTranslation(language, 'insufficientStock', 'Selected quantity exceeds available stock'));
      return;
    }

    setIsOrdering(true);
    setErrorMsg('');

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone,
      buyerLocation: user.village || 'Village',
      farmerId: selectedProduct.farmerId,
      farmerName: selectedProduct.farmerName,
      farmerPhone: selectedProduct.farmerPhone,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      productImageUrl: selectedProduct.imageUrl,
      quantity: orderQuantity,
      unit: selectedProduct.unit,
      pricePerUnit: selectedProduct.pricePerUnit,
      totalPrice: orderQuantity * selectedProduct.pricePerUnit,
      deliveryAddress: deliveryAddress.trim(),
      deliverySlot,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi' ? 'completed' : 'pending',
      status: 'pending',
      notes: orderNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const result = storage.createOrder(newOrder);
      setIsOrdering(false);

      if (result.success) {
        setSelectedProduct(null);
        setOrderSuccessModal(newOrder);
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
        onOrderPlaced();
      } else {
        setErrorMsg(result.error || 'Failed to place order');
      }
    }, 400);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-6">
      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getTranslation(language, 'searchPlaceholder', 'Search fresh milk, paneer, ghee, or farmer...')}
          className="w-full text-sm font-medium text-slate-800 outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Dairy 🥛' },
          { id: 'milk', label: 'Fresh Milk 🐄' },
          { id: 'curd', label: 'Curd / Dahi 🥣' },
          { id: 'paneer', label: 'Soft Paneer 🧀' },
          { id: 'butter', label: 'White Butter 🧈' },
          { id: 'ghee', label: 'Desi Ghee 🍯' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Nearby banner */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{getTranslation(language, 'nearbyFarmers', 'Nearby Farm Fresh Dairy')}</span>
        </span>
        <span className="text-emerald-700 font-bold">{filteredProducts.length} Available</span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
          <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">No products found</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try a different search term or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.availableQuantity <= 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition flex flex-col sm:flex-row group"
              >
                {/* Product Image with badges */}
                <div className="relative sm:w-44 h-44 shrink-0 bg-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Category badge */}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-emerald-900 shadow-2xs backdrop-blur-xs">
                    {product.category}
                  </span>

                  {/* Freshness tag */}
                  {product.milkingSession && (
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>{product.milkingSession === 'morning' ? 'Morning Fresh' : 'Fresh Daily'}</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{product.farmerLocation}</span>
                      </div>
                      {product.fatPercentage && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {product.fatPercentage}% Fat
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mt-1 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Farmer Credibility */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{product.farmerName}</span>
                      </span>

                      <span className="text-slate-400 text-[11px]">
                        Available: <strong className={isOutOfStock ? 'text-rose-600' : 'text-slate-700'}>
                          {product.availableQuantity} {product.unit}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Price & Order Action */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-2">
                    <div>
                      <span className="text-xl font-extrabold text-emerald-800">
                        ₹{product.pricePerUnit}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        /{product.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenOrderModal(product)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-95'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Out of Stock' : getTranslation(language, 'orderNow', 'Order Now')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Placement Modal Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {getTranslation(language, 'confirmOrder', 'Place Dairy Order')}
                  </h3>
                  <p className="text-[11px] text-slate-500">Directly from {selectedProduct.farmerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmOrder} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Product mini card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{selectedProduct.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    ₹{selectedProduct.pricePerUnit} per {selectedProduct.unit} • Max: {selectedProduct.availableQuantity} {selectedProduct.unit}
                  </div>
                </div>
              </div>

              {/* Quantity Counter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'quantityToOrder', 'Quantity to Order')} ({selectedProduct.unit}) *
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 text-center font-extrabold text-xl text-slate-900">
                    {orderQuantity} <span className="text-sm font-semibold text-slate-500">{selectedProduct.unit}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.min(selectedProduct.availableQuantity, orderQuantity + 1))}
                    disabled={orderQuantity >= selectedProduct.availableQuantity}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'deliveryAddress', 'Delivery Address')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={getTranslation(language, 'deliveryAddressPlaceholder', 'House/Flat No., Street, Landmark, Village/City')}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:border-emerald-500 text-xs font-medium outline-none"
                />
              </div>

              {/* Delivery Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'deliverySlot', 'Preferred Delivery Time')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Early Morning (6:00 AM - 8:00 AM)',
                    'Evening (5:00 PM - 7:00 PM)',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setDeliverySlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                        deliverySlot === slot
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'paymentMethod', 'Payment Method')}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'cod', label: getTranslation(language, 'cod', 'Cash on Delivery (Pay to Farmer)') },
                    { id: 'upi', label: getTranslation(language, 'upi', 'UPI (Google Pay / PhonePe / Paytm)') },
                    { id: 'bank_transfer', label: getTranslation(language, 'bankTransfer', 'Direct Bank Transfer') },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === pm.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="accent-emerald-600"
                      />
                      <span className="text-xs">{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Leave milk can near front gate"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>

              {/* Total Calculation */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-900 font-bold uppercase tracking-wider">
                    {getTranslation(language, 'orderTotal', 'Order Total')}
                  </span>
                  <div className="text-[11px] text-emerald-700">
                    {orderQuantity} {selectedProduct.unit} × ₹{selectedProduct.pricePerUnit}
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-900 font-serif">
                  ₹{orderQuantity * selectedProduct.pricePerUnit}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isOrdering}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-700/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                {isOrdering ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{getTranslation(language, 'placeOrder', 'Confirm & Place Order')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Celebratory Modal */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 font-serif">
              {getTranslation(language, 'orderPlacedSuccess', 'Order Placed Successfully!')}
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              {getTranslation(language, 'orderPlacedSub', 'The dairy farmer has been notified and will verify your order shortly.')}
            </p>

            <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">{orderSuccessModal.productName}</div>
              <div>Qty: {orderSuccessModal.quantity} {orderSuccessModal.unit} • Total: ₹{orderSuccessModal.totalPrice}</div>
              <div className="text-[11px] text-slate-500">Order ID: #{orderSuccessModal.id}</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setOrderSuccessModal(null);
                  onNavigateToOrders();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                {getTranslation(language, 'trackOrders', 'Track My Orders')}
              </button>

              <button
                onClick={() => setOrderSuccessModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                {getTranslation(language, 'continueShopping', 'Continue Shopping')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
