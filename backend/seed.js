import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Organization from './models/Organization.js';
import User from './models/User.js';
import Taxonomy from './models/Taxonomy.js';
import InventoryItem from './models/InventoryItem.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food_redistribution');
    console.log('[Seed] Connected to MongoDB');

    // Clean existing collections
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Taxonomy.deleteMany({});
    await InventoryItem.deleteMany({});

    // 1. Create Organization
    const org = await Organization.create({
      _id: new mongoose.Types.ObjectId('66abbc112233445566778899'),
      name: 'Fresh Harvest Eco Supermarket',
      type: 'business',
      businessType: 'Supermarket',
      address: '100 Green Way, Metro City',
      contactEmail: 'admin@freshharvest.com',
      contactPhone: '+1 800-555-FOOD',
      capacityKg: 1500
    });

    // 2. Create Admin User
    await User.create({
      _id: new mongoose.Types.ObjectId('66abbc112233445566778890'),
      name: 'Sarah Jenkins',
      email: 'admin@freshharvest.com',
      password: 'password123',
      role: 'business_admin',
      orgId: org._id
    });

    // 3. Seed Taxonomy matching categories in sample_inventory.csv
    await Taxonomy.insertMany([
      { category: 'Dairy & Eggs', description: 'Mozzarella, Feta, Milk, Yogurt', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated' },
      { category: 'Bakery & Bread', description: 'Artisan Baguette, Bread, Pastries', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
      { category: 'Fresh Produce', description: 'Organic Spinach, Vegetables, Greens', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
      { category: 'Meat & Seafood', description: 'Wild Caught Salmon, Fish, Poultry', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated' },
      { category: 'Pantry & Canned Goods', description: 'Extra Virgin Olive Oil, Rice, Pasta', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage' }
    ]);

    // 4. Helper risk calculation
    const getRiskAndStatus = (expiryStr, cat) => {
      const exp = new Date(expiryStr);
      const now = new Date();
      const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      
      let status = 'fresh';
      if (daysLeft <= 0) status = 'expired';
      else if (daysLeft <= 3) status = 'near_expiry';

      let risk = 20;
      if (daysLeft <= 1) risk = 95;
      else if (daysLeft <= 3) risk = 75;
      else if (daysLeft <= 7) risk = 50;

      if (cat === 'Dairy & Eggs' || cat === 'Fresh Produce' || cat === 'Bakery & Bread' || cat === 'Meat & Seafood') {
        risk = Math.min(100, risk + 15);
      }

      return { status, risk, daysLeft };
    };

    // 5. Seed Inventory Items directly from sample_inventory.csv
    const sampleItems = [
      {
        orgId: org._id,
        name: 'Fresh Mozzarella Cheese 250g',
        barcode: '8901234567990',
        category: 'Dairy & Eggs',
        quantity: 20,
        minimumStock: 5,
        unit: 'packs',
        supplier: 'Valley Dairy',
        manufactureDate: new Date('2026-07-20'),
        expiryDate: new Date('2026-08-05'),
        storageCondition: 'Refrigerated',
        storageType: 'Refrigerated',
        notes: 'Keep chilled at 4C',
        perishabilityRisk: 'High',
        daysToExpiryThreshold: 3,
        ...getRiskAndStatus('2026-08-05', 'Dairy & Eggs')
      },
      {
        orgId: org._id,
        name: 'Artisan Baguette',
        barcode: '8901234567991',
        category: 'Bakery & Bread',
        quantity: 15,
        minimumStock: 8,
        unit: 'items',
        supplier: 'Sunrise Bakery',
        manufactureDate: new Date('2026-07-27'),
        expiryDate: new Date('2026-07-31'),
        storageCondition: 'Room Temperature',
        storageType: 'Room Temperature',
        notes: 'Freshly baked daily',
        perishabilityRisk: 'High',
        daysToExpiryThreshold: 2,
        wasteRiskScore: 90,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Organic Spinach Leaves 500g',
        barcode: '8901234567992',
        category: 'Fresh Produce',
        quantity: 10,
        minimumStock: 12,
        unit: 'packs',
        supplier: 'Green Leaf Farms',
        manufactureDate: new Date('2026-07-25'),
        expiryDate: new Date('2026-07-30'),
        storageCondition: 'Refrigerated',
        storageType: 'Refrigerated',
        notes: 'Wash before prep',
        perishabilityRisk: 'High',
        daysToExpiryThreshold: 2,
        wasteRiskScore: 95,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Wild Caught Salmon Fillet',
        barcode: '8901234567993',
        category: 'Meat & Seafood',
        quantity: 8,
        minimumStock: 5,
        unit: 'kg',
        supplier: 'Ocean Harvest',
        manufactureDate: new Date('2026-07-26'),
        expiryDate: new Date('2026-07-29'),
        storageCondition: 'Refrigerated',
        storageType: 'Refrigerated',
        notes: 'Store on crushed ice',
        perishabilityRisk: 'High',
        daysToExpiryThreshold: 1,
        wasteRiskScore: 98,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Extra Virgin Olive Oil 1L',
        barcode: '8901234567994',
        category: 'Pantry & Canned Goods',
        quantity: 30,
        minimumStock: 10,
        unit: 'items',
        supplier: 'Mediterranean Gourmet',
        manufactureDate: new Date('2026-01-10'),
        expiryDate: new Date('2027-01-10'),
        storageCondition: 'Dry Storage',
        storageType: 'Dry Storage',
        notes: 'Keep away from heat',
        perishabilityRisk: 'Low',
        daysToExpiryThreshold: 30,
        wasteRiskScore: 10,
        status: 'fresh'
      },
      {
        orgId: org._id,
        name: 'Greek Style Feta Cheese 200g',
        barcode: '8901234567995',
        category: 'Dairy & Eggs',
        quantity: 4,
        minimumStock: 8,
        unit: 'packs',
        supplier: 'Olympus Foods',
        manufactureDate: new Date('2026-07-15'),
        expiryDate: new Date('2026-08-02'),
        storageCondition: 'Refrigerated',
        storageType: 'Refrigerated',
        notes: 'Low stock warning',
        perishabilityRisk: 'High',
        daysToExpiryThreshold: 3,
        wasteRiskScore: 80,
        status: 'near_expiry'
      }
    ];

    await InventoryItem.insertMany(sampleItems);

    console.log('[Seed] Database successfully seeded with sample_inventory.csv dataset!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
