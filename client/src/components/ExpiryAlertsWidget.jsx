import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ExpiryAlertsWidget = ({ items, onQuickStockUpdate }) => {
  const getDaysLeft = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getUrgencyBadge = (daysLeft) => {
    if (daysLeft <= 0) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-critical flex items-center gap-1">❌ Expired</span>;
    }
    if (daysLeft <= 2) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-critical flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Critical ({daysLeft}d left)</span>;
    }
    if (daysLeft <= 5) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-warning flex items-center gap-1"><Clock className="w-3 h-3" /> Warning ({daysLeft}d left)</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-safe flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Notice ({daysLeft}d left)</span>;
  };

  const nearExpiryItems = items.filter(i => i.status === 'near_expiry' || i.status === 'expired');

  return (
    <div className="eco-card p-5 bg-white space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">Expiry Tracking & Risk Engine</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time inventory perishability monitor</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
          {nearExpiryItems.length} Action Items
        </span>
      </div>

      {nearExpiryItems.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl">
            🌱
          </div>
          <p className="text-xs font-bold text-slate-700">All Items Fresh & Safe!</p>
          <p className="text-[11px] text-slate-400">No immediate expiry risks detected in current inventory.</p>
        </div>
      ) : (
        <div className="divide-y divide-emerald-50 max-h-72 overflow-y-auto pr-1">
          {nearExpiryItems.map((item) => {
            const daysLeft = getDaysLeft(item.expiryDate);
            return (
              <div key={item._id} className="py-3 flex items-center justify-between hover:bg-emerald-50/50 px-2 rounded-lg transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.barcode || 'NO-BARCODE'})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                    <span>Category: <strong className="text-slate-700">{item.category}</strong></span>
                    <span>Stock: <strong className="text-emerald-700">{item.quantity} {item.unit}</strong></span>
                    <span>Risk Score: <strong className="text-rose-600">{item.wasteRiskScore}/100</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getUrgencyBadge(daysLeft)}
                  <button
                    onClick={() => onQuickStockUpdate(item._id, -item.quantity, 'Actioned from Expiry Alert')}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Clear Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
