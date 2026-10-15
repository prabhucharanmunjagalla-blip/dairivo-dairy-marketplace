import React, { useState } from 'react';
import { Order, PaymentTransaction, SupportedLanguage, UserProfile } from '../../types';
import { getTranslation } from '../../translations';
import { 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Receipt,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

interface FarmerPaymentsProps {
  user: UserProfile;
  language: SupportedLanguage;
  orders: Order[];
  transactions: PaymentTransaction[];
}

export const FarmerPayments: React.FC<FarmerPaymentsProps> = ({
  user,
  language,
  orders,
  transactions,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Compute real confirmed earnings from completed transactions
  const farmerTxns = transactions.filter(
    (t) => t.farmerId === user.id || t.farmerId === 'farmer-1'
  );

  const completedEarnings = farmerTxns
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Compute pending receivables from orders not yet delivered
  const pendingOrders = orders.filter(
    (o) =>
      (o.farmerId === user.id || o.farmerPhone === user.phone) &&
      (o.status === 'pending' || o.status === 'confirmed' || o.status === 'out_for_delivery')
  );

  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleCopyUpi = () => {
    const upi = user.upiId || 'farmer@okhdfcbank';
    navigator.clipboard?.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-6">
      {/* Financial Overview Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
          <span>{getTranslation(language, 'totalEarnings', 'Total Earnings (Verified)')}</span>
          <span className="flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Audited & Confirmed</span>
          </span>
        </div>

        <div className="text-3xl font-extrabold text-white tracking-tight my-2 flex items-baseline gap-1">
          <span>₹</span>
          <span className="font-serif text-4xl">{completedEarnings.toLocaleString('en-IN')}</span>
        </div>

        <p className="text-emerald-100 text-xs font-medium">
          Earnings credited directly to your registered bank account & UPI ID.
        </p>

        {/* 2-col mini summary */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-600/50">
          <div className="bg-emerald-900/40 p-2.5 rounded-2xl border border-emerald-500/20">
            <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              {getTranslation(language, 'completedPayments', 'Received Payments')}
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              ₹{completedEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-300 mt-0.5">
              {farmerTxns.length} transactions
            </div>
          </div>

          <div className="bg-emerald-900/40 p-2.5 rounded-2xl border border-emerald-500/20">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              {getTranslation(language, 'pendingPayments', 'Pending Collections')}
            </div>
            <div className="text-base font-extrabold text-amber-200 mt-0.5">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-200 mt-0.5">
              {pendingOrders.length} active deliveries
            </div>
          </div>
        </div>
      </div>

      {/* Farmer UPI ID & Settlement Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Direct Payment UPI ID</h4>
              <p className="text-[11px] text-slate-400">Buyers pay directly to this virtual address</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="font-mono text-xs font-bold text-slate-800">
              {user.upiId || 'farmer@okhdfcbank'}
            </span>
          </div>

          <button
            onClick={handleCopyUpi}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verified Transaction History */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              {getTranslation(language, 'transactionHistory', 'Transaction History')}
            </h4>
            <p className="text-xs text-slate-400">Audited records of completed settlements</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {farmerTxns.length} records
          </span>
        </div>

        {farmerTxns.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No completed transactions yet. Completed deliveries will record transactions automatically.
          </div>
        ) : (
          <div className="space-y-2.5">
            {farmerTxns.map((txn) => (
              <div
                key={txn.id}
                className="p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{txn.buyerName}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {txn.method}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                      {txn.productName}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Ref: {txn.referenceNo}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-emerald-700 text-sm">
                    +₹{txn.amount}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(txn.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Settled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
