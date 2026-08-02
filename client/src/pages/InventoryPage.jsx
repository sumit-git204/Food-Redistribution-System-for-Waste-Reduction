import React, { useState, useEffect } from 'react';
import API, { MOCK_INVENTORY, MOCK_TAXONOMY } from '../services/api';
import { Package, Plus, Search, Filter, QrCode, UploadCloud, Trash2, Calendar, Edit3, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const InventoryPage = ({ onOpenQRScanner, onOpenCSVModal }) => {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State for Manual Add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    barcode: '',
    category: 'Dairy & Eggs',
    quantity: 10,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    daysToExpiryThreshold: 3,
    unitPrice: 2.50
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inventory');
      if (res.data && res.data.length > 0) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn('Using demo mock inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/inventory', newItem);
      setItems([res.data, ...items]);
    } catch (err) {
      // Fallback local append
      const mockCreated = {
        ...newItem,
        _id: String(Date.now()),
        perishabilityRisk: 'High',
        wasteRiskScore: 45,
        status: 'fresh'
      };
      setItems([mockCreated, ...items]);
    } finally {
      setIsAddModalOpen(false);
      setNewItem({
        name: '',
        barcode: '',
        category: 'Dairy & Eggs',
        quantity: 10,
        unit: 'kg',
        expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        daysToExpiryThreshold: 3,
        unitPrice: 2.50
      });
    }
  };

  const handleStockAdjust = async (id, delta) => {
    try {
      await API.patch(`/inventory/${id}/stock`, { delta });
      setItems(items.map(item => {
        if (item._id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }));
    } catch (err) {
      setItems(items.map(item => {
        if (item._id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }));
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Remove this inventory record?')) return;
    try {
      await API.delete(`/inventory/${id}`);
    } catch (err) {
      // Ignored
    }
    setItems(items.filter(i => i._id !== id));
  };

  // Filtered dataset
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.barcode && item.barcode.includes(search));
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Inventory Management & Expiry Tracking</h2>
          <p className="text-xs text-slate-500 font-medium">Multi-tenant stock input, barcode indexing & status controls</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCSVModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>CSV Upload</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="eco-btn-primary flex items-center space-x-1.5 text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="eco-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search item name or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="All">All Categories</option>
            {MOCK_TAXONOMY.map(t => (
              <option key={t.category} value={t.category}>{t.category}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1 text-xs font-bold text-slate-600 pl-2">
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="fresh">Fresh</option>
            <option value="near_expiry">Near Expiry</option>
            <option value="expired">Expired</option>
          </select>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="eco-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/70 border-b border-emerald-100 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Item & Barcode</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={item._id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        <div>{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.barcode || 'BC-GENERIC'}</div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-800">
                        {item.quantity} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-extrabold ${item.wasteRiskScore > 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {item.wasteRiskScore}/100
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.status === 'expired' && (
                          <span className="px-2.5 py-1 rounded-full badge-critical text-[11px] font-bold">Expired</span>
                        )}
                        {item.status === 'near_expiry' && (
                          <span className="px-2.5 py-1 rounded-full badge-warning text-[11px] font-bold">Near Expiry ({daysLeft}d)</span>
                        )}
                        {item.status === 'fresh' && (
                          <span className="px-2.5 py-1 rounded-full badge-safe text-[11px] font-bold">Fresh</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleStockAdjust(item._id, -1)}
                          title="Reduce stock by 1"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-lg text-xs"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockAdjust(item._id, 1)}
                          title="Add stock by 1"
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold rounded-lg text-xs"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          title="Delete item"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
            
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800">Add Inventory Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Organic Almond Milk 1L"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Barcode / SKU</label>
                  <input
                    type="text"
                    value={newItem.barcode}
                    onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
                    placeholder="8901234..."
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {MOCK_TAXONOMY.map(t => (
                      <option key={t.category} value={t.category}>{t.category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="units">units</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="eco-btn-primary px-5 py-2">
                  Save Item
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
