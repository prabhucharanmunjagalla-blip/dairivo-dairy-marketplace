import React from 'react';
import { Order, OrderStatus, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Truck, 
  Check, 
  XCircle, 
  ShoppingBag,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface BuyerOrdersProps {
  user: UserProfile;
  language: SupportedLanguage;
  orders: Order[];
  onOrderUpdated: () => void;
  onNavigateToMarketplace: () => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({
  user,
  language,
  orders,
  onOrderUpdated,
  onNavigateToMarketplace,
}) => {
  // Filter orders placed by this buyer
  const buyerOrders = orders.filter(
    (o) => o.buyerId === user.id || o.buyerPhone === user.phone
  );

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? Stock will be returned to the farmer.')) {
      storage.updateOrderStatus(orderId, 'cancelled');
      onOrderUpdated();
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-6">
      {/* Title */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            {getTranslation(language, 'myOrders', 'My Dairy Orders')}
          </h3>
          <p className="text-xs text-slate-500">Live order tracking & delivery history</p>
        </div>
        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          {buyerOrders.length} Orders
        </span>
      </div>

      {buyerOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">
            {getTranslation(language, 'noOrdersYet', 'No orders placed yet')}
          </h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Explore fresh milk, paneer, and ghee from local village farmers.
          </p>
          <button
            onClick={onNavigateToMarketplace}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{getTranslation(language, 'marketplace', 'Browse Marketplace')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map((order) => {
            const step = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-600">
                      #{order.id}
                    </span>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {isCancelled ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancelled</span>
                    </span>
                  ) : order.status === 'delivered' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivered</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                    </span>
                  )}
                </div>

                {/* Product info */}
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'}
                    alt={order.productName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{order.productName}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Qty: <strong className="text-slate-800">{order.quantity} {order.unit}</strong> • ₹{order.pricePerUnit}/{order.unit}
                    </div>
                    <div className="text-sm font-extrabold text-emerald-700 mt-1">
                      Total: ₹{order.totalPrice} ({order.paymentMethod.toUpperCase()})
                    </div>
                  </div>
                </div>

                {/* Live Progress Timeline (if not cancelled) */}
                {!isCancelled && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Live Delivery Tracker
                    </div>

                    <div className="relative flex items-center justify-between text-center">
                      {/* Line connector */}
                      <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                      <div
                        className="absolute top-3.5 left-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                        style={{ width: `${Math.max(0, (step - 1) / 3) * 100}%` }}
                      />

                      {/* 4 Steps */}
                      {[
                        { title: 'Placed', icon: Clock },
                        { title: 'Accepted', icon: CheckCircle2 },
                        { title: 'On The Way', icon: Truck },
                        { title: 'Delivered', icon: Check },
                      ].map((s, idx) => {
                        const stepNum = idx + 1;
                        const isDone = step >= stepNum;
                        const isCurrent = step === stepNum;
                        const Icon = s.icon;

                        return (
                          <div key={s.title} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 ring-offset-1' : ''}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[10px] mt-1 font-semibold ${isDone ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                              {s.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Farmer Contact & Address */}
                <div className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Farmer: {order.farmerName}</span>
                    <a
                      href={`tel:${order.farmerPhone}`}
                      className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{getTranslation(language, 'callFarmer', 'Call Farmer')}</span>
                    </a>
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>Deliver to: {order.deliveryAddress}</span>
                  </div>

                  {order.deliverySlot && (
                    <div className="text-[11px] text-slate-500">
                      Slot: <strong>{order.deliverySlot}</strong>
                    </div>
                  )}
                </div>

                {/* Cancel action if pending */}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
