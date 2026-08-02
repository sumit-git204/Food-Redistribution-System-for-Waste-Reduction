import Taxonomy from '../models/Taxonomy.js';

export const getTaxonomy = async (req, res) => {
  try {
    const categories = await Taxonomy.find().sort({ category: 1 });
    if (categories.length === 0) {
      // Return standard default taxonomy if empty
      return res.json([
        { category: 'Dairy & Eggs', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated' },
        { category: 'Fresh Produce', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
        { category: 'Bakery & Pastry', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
        { category: 'Meat & Poultry', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
        { category: 'Seafood', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated' },
        { category: 'Prepared Foods', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
        { category: 'Frozen Foods', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 14, storageType: 'Frozen' },
        { category: 'Pantry & Dry Goods', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage' }
      ]);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedTaxonomy = async (req, res) => {
  try {
    const defaultData = [
      { category: 'Dairy & Eggs', description: 'Milk, cheese, butter, yogurt, eggs', perishabilityRisk: 'High', defaultExpiryThresholdDays: 3, storageType: 'Refrigerated' },
      { category: 'Fresh Produce', description: 'Fruits, vegetables, herbs, leafy greens', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
      { category: 'Bakery & Pastry', description: 'Bread, rolls, cakes, pastries', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Ambient' },
      { category: 'Meat & Poultry', description: 'Beef, chicken, pork, turkey', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
      { category: 'Seafood', description: 'Fish, shellfish, seafood meals', perishabilityRisk: 'High', defaultExpiryThresholdDays: 1, storageType: 'Refrigerated' },
      { category: 'Prepared Foods', description: 'Ready-to-eat salads, sandwiches, deli items', perishabilityRisk: 'High', defaultExpiryThresholdDays: 2, storageType: 'Refrigerated' },
      { category: 'Frozen Foods', description: 'Frozen vegetables, meals, ice cream', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 14, storageType: 'Frozen' },
      { category: 'Pantry & Dry Goods', description: 'Rice, pasta, canned goods, flour, sugar', perishabilityRisk: 'Low', defaultExpiryThresholdDays: 30, storageType: 'Dry Storage' }
    ];

    await Taxonomy.deleteMany({});
    const created = await Taxonomy.insertMany(defaultData);
    res.json({ message: 'Taxonomy seeded successfully', count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
