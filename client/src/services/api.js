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

// Seed mock fallback dataset for seamless UI experience if backend DB is not connected
export const MOCK_INVENTORY = [
  {
    _id: '1',
    name: 'Organic Whole Milk 1L',
    barcode: '890123456701',
    category: 'Dairy & Eggs',
    quantity: 45,
    unit: 'liters',
    expiryDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day
    daysToExpiryThreshold: 3,
    perishabilityRisk: 'High',
    storageType: 'Refrigerated',
    unitPrice: 3.50,
    wasteRiskScore: 92,
    status: 'near_expiry'
  },
  {
    _id: '2',
    name: 'Artisan Sourdough Bread',
    barcode: '890123456702',
    category: 'Bakery & Pastry',
    quantity: 28,
    unit: 'units',
    expiryDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days
    daysToExpiryThreshold: 2,
    perishabilityRisk: 'High',
    storageType: 'Ambient',
    unitPrice: 4.20,
    wasteRiskScore: 85,
    status: 'near_expiry'
  },
  {
    _id: '3',
    name: 'Fresh Strawberries (500g)',
    barcode: '890123456703',
    category: 'Fresh Produce',
    quantity: 60,
    unit: 'boxes',
    expiryDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
    daysToExpiryThreshold: 3,
    perishabilityRisk: 'High',
    storageType: 'Ambient',
    unitPrice: 5.00,
    wasteRiskScore: 70,
    status: 'near_expiry'
  },
  {
    _id: '4',
    name: 'Greek Yogurt Vanilla 500g',
    barcode: '890123456704',
    category: 'Dairy & Eggs',
    quantity: 30,
    unit: 'units',
    expiryDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Expired
    daysToExpiryThreshold: 3,
    perishabilityRisk: 'High',
    storageType: 'Refrigerated',
    unitPrice: 2.80,
    wasteRiskScore: 99,
    status: 'expired'
  },
  {
    _id: '5',
    name: 'Boneless Chicken Breast',
    barcode: '890123456705',
    category: 'Meat & Poultry',
    quantity: 25,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 86400000 * 6).toISOString(), // Fresh
    daysToExpiryThreshold: 2,
    perishabilityRisk: 'High',
    storageType: 'Refrigerated',
    unitPrice: 8.90,
    wasteRiskScore: 40,
    status: 'fresh'
  },
  {
    _id: '6',
    name: 'Canned Black Beans 400g',
    barcode: '890123456706',
    category: 'Pantry & Dry Goods',
    quantity: 150,
    unit: 'units',
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(), // Long
    daysToExpiryThreshold: 30,
    perishabilityRisk: 'Low',
    storageType: 'Dry Storage',
    unitPrice: 1.20,
    wasteRiskScore: 10,
    status: 'fresh'
  }
];

export const MOCK_TAXONOMY = [
  { category: 'Dairy & Eggs', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated', description: 'Milk, cheese, yogurt, butter, eggs' },
  { category: 'Fresh Produce', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient', description: 'Fruits, vegetables, herbs, leafy greens' },
  { category: 'Bakery & Pastry', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient', description: 'Fresh breads, bagels, rolls, pastries' },
  { category: 'Meat & Poultry', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated', description: 'Chicken, beef, turkey, pork' },
  { category: 'Seafood', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated', description: 'Salmon, shrimp, tuna, shellfish' },
  { category: 'Prepared Foods', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated', description: 'Salads, deli sandwiches, heat-and-eat meals' },
  { category: 'Frozen Foods', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 14, storageType: 'Frozen', description: 'Frozen veggies, frozen meals, ice cream' },
  { category: 'Pantry & Dry Goods', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage', description: 'Canned goods, pasta, rice, flour, spices' }
];

export default API;
