import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('eco_user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Seed dataset strictly matching sample_inventory.csv
export const MOCK_INVENTORY = [
  {
    _id: '1',
    name: 'Fresh Mozzarella Cheese 250g',
    barcode: '8901234567990',
    category: 'Dairy & Eggs',
    quantity: 20,
    minimumStock: 5,
    unit: 'packs',
    supplier: 'Valley Dairy',
    manufactureDate: '2026-07-20',
    expiryDate: '2026-08-05',
    storageCondition: 'Refrigerated',
    storageType: 'Refrigerated',
    notes: 'Keep chilled at 4C',
    daysToExpiryThreshold: 3,
    perishabilityRisk: 'High',
    unitPrice: 4.50,
    wasteRiskScore: 35,
    status: 'fresh'
  },
  {
    _id: '2',
    name: 'Artisan Baguette',
    barcode: '8901234567991',
    category: 'Bakery & Bread',
    quantity: 15,
    minimumStock: 8,
    unit: 'items',
    supplier: 'Sunrise Bakery',
    manufactureDate: '2026-07-27',
    expiryDate: '2026-07-31',
    storageCondition: 'Room Temperature',
    storageType: 'Room Temperature',
    notes: 'Freshly baked daily',
    daysToExpiryThreshold: 2,
    perishabilityRisk: 'High',
    unitPrice: 3.20,
    wasteRiskScore: 90,
    status: 'near_expiry'
  },
  {
    _id: '3',
    name: 'Organic Spinach Leaves 500g',
    barcode: '8901234567992',
    category: 'Fresh Produce',
    quantity: 10,
    minimumStock: 12,
    unit: 'packs',
    supplier: 'Green Leaf Farms',
    manufactureDate: '2026-07-25',
    expiryDate: '2026-07-30',
    storageCondition: 'Refrigerated',
    storageType: 'Refrigerated',
    notes: 'Wash before prep',
    daysToExpiryThreshold: 2,
    perishabilityRisk: 'High',
    unitPrice: 3.80,
    wasteRiskScore: 95,
    status: 'near_expiry'
  },
  {
    _id: '4',
    name: 'Wild Caught Salmon Fillet',
    barcode: '8901234567993',
    category: 'Meat & Seafood',
    quantity: 8,
    minimumStock: 5,
    unit: 'kg',
    supplier: 'Ocean Harvest',
    manufactureDate: '2026-07-26',
    expiryDate: '2026-07-29',
    storageCondition: 'Refrigerated',
    storageType: 'Refrigerated',
    notes: 'Store on crushed ice',
    daysToExpiryThreshold: 1,
    perishabilityRisk: 'High',
    unitPrice: 16.50,
    wasteRiskScore: 98,
    status: 'near_expiry'
  },
  {
    _id: '5',
    name: 'Extra Virgin Olive Oil 1L',
    barcode: '8901234567994',
    category: 'Pantry & Canned Goods',
    quantity: 30,
    minimumStock: 10,
    unit: 'items',
    supplier: 'Mediterranean Gourmet',
    manufactureDate: '2026-01-10',
    expiryDate: '2027-01-10',
    storageCondition: 'Dry Storage',
    storageType: 'Dry Storage',
    notes: 'Keep away from heat',
    daysToExpiryThreshold: 30,
    perishabilityRisk: 'Low',
    unitPrice: 12.00,
    wasteRiskScore: 10,
    status: 'fresh'
  },
  {
    _id: '6',
    name: 'Greek Style Feta Cheese 200g',
    barcode: '8901234567995',
    category: 'Dairy & Eggs',
    quantity: 4,
    minimumStock: 8,
    unit: 'packs',
    supplier: 'Olympus Foods',
    manufactureDate: '2026-07-15',
    expiryDate: '2026-08-02',
    storageCondition: 'Refrigerated',
    storageType: 'Refrigerated',
    notes: 'Low stock warning',
    daysToExpiryThreshold: 3,
    perishabilityRisk: 'High',
    unitPrice: 3.90,
    wasteRiskScore: 80,
    status: 'near_expiry'
  }
];

export const MOCK_TAXONOMY = [
  { category: 'Dairy & Eggs', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated', description: 'Fresh Mozzarella, Greek Style Feta, Milk, Yogurt' },
  { category: 'Bakery & Bread', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Room Temperature', description: 'Artisan Baguette, Freshly baked breads, Rolls' },
  { category: 'Fresh Produce', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated', description: 'Organic Spinach Leaves, Leafy greens, Vegetables' },
  { category: 'Meat & Seafood', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated', description: 'Wild Caught Salmon Fillet, Fresh seafood, Meat cuts' },
  { category: 'Pantry & Canned Goods', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage', description: 'Extra Virgin Olive Oil, Canned items, Dry condiments' }
];

export default API;
