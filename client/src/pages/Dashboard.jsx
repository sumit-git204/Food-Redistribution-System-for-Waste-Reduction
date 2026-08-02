import React, { useState, useEffect } from 'react';
import { ExpiryAlertsWidget } from '../components/ExpiryAlertsWidget';
import API, { MOCK_INVENTORY } from '../services/api';
import { Package, Clock, AlertTriangle, ShieldCheck, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';

export const Dashboard = ({ onQuickStockUpdate }) => {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inventory');
      if (res.data && res.data.length > 0) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn('Using demo mock inventory dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Stats calculation
  const totalItems = items.length;
  const freshItems = items.filter(i => i.status === 'fresh').length;
  const nearExpiryItems = items.filter(i => i.status === 'near_expiry').length;
  const expiredItems = items.filter(i => i.status === 'expired').length;
  const avgRiskScore = totalItems > 0
    ? Math.round(items.reduce((acc, i) => acc + (i.wasteRiskScore || 0), 0) / totalItems)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white shadow-lg shadow-emerald-600/15">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight">Executive Dashboard & Waste Monitor</h2>
          <p className="text-xs text-emerald-100 font-medium">Real-time inventory perishability, risk scoring & automated expiry alerts</p>
        </div>
        <button
          onClick={fetchInventory}
          className="self-start md:self-auto flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Items */}
        <div className="eco-card p-4 flex items-center space-x-4 bg-white border border-emerald-100">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <Package className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total SKUs</p>
            <h3 className="text-xl font-extrabold text-slate-800">{totalItems} <span className="text-xs font-normal text-slate-500">items</span></h3>
          </div>
        </div>

        {/* Fresh Items */}
        <div className="eco-card p-4 flex items-center space-x-4 bg-white border border-emerald-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fresh Stock</p>
            <h3 className="text-xl font-extrabold text-emerald-600">{freshItems}</h3>
          </div>
        </div>

        {/* Near Expiry Items */}
        <div className="eco-card p-4 flex items-center space-x-4 bg-white border border-amber-100">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Near Expiry</p>
            <h3 className="text-xl font-extrabold text-amber-600">{nearExpiryItems}</h3>
          </div>
        </div>

        {/* Average Waste Risk Score */}
        <div className="eco-card p-4 flex items-center space-x-4 bg-white border border-rose-100">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Waste Risk</p>
            <h3 className="text-xl font-extrabold text-rose-600">{avgRiskScore} <span className="text-xs font-bold text-slate-400">/ 100</span></h3>
          </div>
        </div>

      </div>

      {/* Main Expiry Alerts Widget */}
      <ExpiryAlertsWidget items={items} onQuickStockUpdate={onQuickStockUpdate} />

      {/* Category Breakdown & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Share */}
        <div className="eco-card p-5 bg-white space-y-4">
          <div className="flex items-center space-x-2 border-b border-emerald-100 pb-3">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-800">Taxonomy Distribution</h3>
          </div>
          <div className="space-y-3">
            {['Dairy & Eggs', 'Fresh Produce', 'Bakery & Pastry', 'Meat & Poultry', 'Pantry & Dry Goods'].map(cat => {
              const count = items.filter(i => i.category === cat).length;
              const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-emerald-700">{count} items ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Expiry Engine Note */}
        <div className="eco-card p-5 bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-800">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-extrabold text-sm">Automated Expiry Scheduler (node-cron)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The backend engine scans all inventory records daily against defined category perishability thresholds. 
            Items entering the risk window are automatically updated to <span className="font-bold text-amber-700">near_expiry</span> or <span className="font-bold text-rose-700">expired</span>, triggering automated alerts to prevent waste.
          </p>
          <div className="pt-2 flex items-center space-x-2 text-[11px] font-bold text-emerald-700">
            <span>✅ Status: Active</span>
            <span>•</span>
            <span>Scan Schedule: Midnight Daily</span>
          </div>
        </div>

      </div>

    </div>
  );
};
