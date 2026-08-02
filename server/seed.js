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

    // 3. Seed Taxonomy
    const taxonomies = await Taxonomy.insertMany([
      { category: 'Dairy & Eggs', description: 'Milk, cheese, butter, yogurt', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated' },
      { category: 'Fresh Produce', description: 'Fruits, vegetables, leafy greens', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
      { category: 'Bakery & Pastry', description: 'Fresh bread, muffins, cakes', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
      { category: 'Meat & Poultry', description: 'Chicken breast, ground beef, steaks', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
      { category: 'Seafood', description: 'Salmon fillets, shrimp', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated' },
      { category: 'Prepared Foods', description: 'Salads, pre-cooked meals', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
      { category: 'Frozen Foods', description: 'Frozen veggies, ice cream', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 14, storageType: 'Frozen' },
      { category: 'Pantry & Dry Goods', description: 'Canned beans, pasta, cereal', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage' }
    ]);

    // 4. Helper dates
    const today = new Date();
    const addDays = (d) => new Date(today.getTime() + d * 86400000);

    // 5. Seed Inventory Items
    await InventoryItem.insertMany([
      {
        orgId: org._id,
        name: 'Organic Whole Milk 1L',
        barcode: '890123456701',
        category: 'Dairy & Eggs',
        quantity: 45,
        unit: 'liters',
        expiryDate: addDays(1), // Critical Near Expiry
        daysToExpiryThreshold: 3,
        perishabilityRisk: 'High',
        storageType: 'Refrigerated',
        unitPrice: 3.50,
        wasteRiskScore: 92,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Artisan Sourdough Bread',
        barcode: '890123456702',
        category: 'Bakery & Pastry',
        quantity: 28,
        unit: 'units',
        expiryDate: addDays(2), // Near Expiry
        daysToExpiryThreshold: 2,
        perishabilityRisk: 'High',
        storageType: 'Ambient',
        unitPrice: 4.20,
        wasteRiskScore: 85,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Fresh Strawberries (500g)',
        barcode: '890123456703',
        category: 'Fresh Produce',
        quantity: 60,
        unit: 'boxes',
        expiryDate: addDays(3), // Warning
        daysToExpiryThreshold: 3,
        perishabilityRisk: 'High',
        storageType: 'Ambient',
        unitPrice: 5.00,
        wasteRiskScore: 70,
        status: 'near_expiry'
      },
      {
        orgId: org._id,
        name: 'Greek Yogurt Vanilla 500g',
        barcode: '890123456704',
        category: 'Dairy & Eggs',
        quantity: 30,
        unit: 'units',
        expiryDate: addDays(-1), // Expired yesterday
        daysToExpiryThreshold: 3,
        perishabilityRisk: 'High',
        storageType: 'Refrigerated',
        unitPrice: 2.80,
        wasteRiskScore: 99,
        status: 'expired'
      },
      {
        orgId: org._id,
        name: 'Boneless Chicken Breast',
        barcode: '890123456705',
        category: 'Meat & Poultry',
        quantity: 25,
        unit: 'kg',
        expiryDate: addDays(5), // Fresh
        daysToExpiryThreshold: 2,
        perishabilityRisk: 'High',
        storageType: 'Refrigerated',
        unitPrice: 8.90,
        wasteRiskScore: 40,
        status: 'fresh'
      },
      {
        orgId: org._id,
        name: 'Canned Black Beans 400g',
        barcode: '890123456706',
        category: 'Pantry & Dry Goods',
        quantity: 150,
        unit: 'units',
        expiryDate: addDays(180), // Long shelf life
        daysToExpiryThreshold: 30,
        perishabilityRisk: 'Low',
        storageType: 'Dry Storage',
        unitPrice: 1.20,
        wasteRiskScore: 10,
        status: 'fresh'
      }
    ]);

    console.log('[Seed] Database successfully seeded with eco-friendly demo dataset!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
