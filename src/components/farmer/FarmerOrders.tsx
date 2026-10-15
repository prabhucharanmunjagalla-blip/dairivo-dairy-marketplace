import React, { useState } from 'react';
import { Order, OrderStatus, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { storage } from '../../data/storage';
import { 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  IndianRupee, 
  Check, 
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarmerOrdersProps {
  user: UserProfile;
  language: SupportedLanguage;
  orders: Order[];
  onOrderUpdated: () => void;
}

export const FarmerOrders: React.FC<FarmerOrdersProps> = ({
  user,
  language,
  orders,
  onOrderUpdated,
}) => {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  // Filter orders for this farmer
  const farmerOrders = orders.filter(
    (o) => o.farmerId === user.id || o.farmerPhone === user.phone
  );

  const displayedOrders = farmerOrders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    storage.updateOrderStatus(orderId, newStatus);
    if (newStatus === 'delivered') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
    onOrderUpdated();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{getTranslation(language, 'pending', 'Pending')}</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>{getTranslation(language, 'confirmed', 'Confirmed')}</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-600" />
            <span>{getTranslation(language, 'outForDelivery', 'Out for Delivery')}</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{getTranslation(language, 'delivered', 'Delivered')}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>{getTranslation(language, 'cancelled', 'Cancelled')}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-6">
      {/* Top Title & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {getTranslation(language, 'orders', 'Orders Management')}
            </h3>
            <p className="text-xs text-slate-500">Live incoming buyer requests</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            {farmerOrders.length} Total
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filter === item.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">
            {getTranslation(language, 'noOrdersYet', 'No orders in this category')}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            New orders from buyers will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-200 transition"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    #{order.id}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {getStatusBadge(order.status)}
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-3 py-3 border-b border-slate-100">
                <img
                  src={order.productImageUrl || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'}
                  alt={order.productName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {order.productName}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Qty: <strong className="text-slate-800">{order.quantity} {order.unit}</strong> • ₹{order.pricePerUnit}/{order.unit}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                    Total: ₹{order.totalPrice} ({order.paymentMethod.toUpperCase()})
                  </div>
                </div>
              </div>

              {/* Buyer & Delivery Details */}
              <div className="py-2.5 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl my-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{order.buyerName}</span>
                  <a
                    href={`tel:${order.buyerPhone}`}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{order.buyerPhone}</span>
                  </a>
                </div>

                <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{order.deliveryAddress}</span>
                </div>

                {order.deliverySlot && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Slot: <strong>{order.deliverySlot}</strong></span>
                  </div>
                )}

                {order.notes && (
                  <div className="flex items-start gap-1.5 text-amber-700 text-[11px] bg-amber-50/70 p-1.5 rounded-lg border border-amber-100">
                    <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>Note: {order.notes}</span>
                  </div>
                )}
              </div>

              {/* Real Action Buttons per status */}
              <div className="pt-1">
                {order.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      className="py-2.5 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{getTranslation(language, 'rejectOrder', 'Reject')}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>{getTranslation(language, 'acceptOrder', 'Accept Order')}</span>
                    </button>
                  </div>
                )}

                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-98 transition flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{getTranslation(language, 'markOutForDelivery', 'Send Out for Delivery')}</span>
                  </button>
                )}

                {order.status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-98 transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{getTranslation(language, 'markDelivered', 'Mark Delivered & Collect Cash')}</span>
                  </button>
                )}

                {order.status === 'delivered' && (
                  <div className="text-center text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivered & Payment Confirmed</span>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="text-center text-xs text-slate-400 font-medium py-1">
                    Order was cancelled. Inventory restored.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
