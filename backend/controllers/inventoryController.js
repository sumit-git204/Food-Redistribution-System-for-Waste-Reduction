import InventoryItem from '../models/InventoryItem.js';
import Transaction from '../models/Transaction.js';
import Taxonomy from '../models/Taxonomy.js';
import csvParser from 'csv-parser';
import fs from 'fs';

// Helper to compute initial perishability & waste risk score
const calculateRiskScore = (expiryDate, perishabilityRisk, quantity) => {
  const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  let baseScore = 0;
  
  if (daysLeft <= 1) baseScore = 95;
  else if (daysLeft <= 3) baseScore = 75;
  else if (daysLeft <= 7) baseScore = 45;
  else baseScore = 15;

  if (perishabilityRisk === 'High') baseScore += 10;
  if (quantity > 50) baseScore += 5;

  return Math.min(100, Math.max(0, baseScore));
};

export const getInventory = async (req, res) => {
  try {
    const { category, status, search, perishabilityRisk } = req.query;
    let query = { orgId: req.orgId };

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (perishabilityRisk && perishabilityRisk !== 'All') query.perishabilityRisk = perishabilityRisk;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await InventoryItem.find(query).sort({ expiryDate: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const { name, barcode, category, quantity, unit, expiryDate, daysToExpiryThreshold, unitPrice } = req.body;

    // Lookup taxonomy default for perishability
    const tax = await Taxonomy.findOne({ category });
    const perishabilityRisk = tax ? tax.perishabilityRisk : 'Medium';
    const storageType = tax ? tax.storageType : 'Ambient';

    const wasteRiskScore = calculateRiskScore(expiryDate, perishabilityRisk, quantity);
    
    // Determine initial status
    const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    let status = 'fresh';
    if (daysLeft <= 0) status = 'expired';
    else if (daysLeft <= (daysToExpiryThreshold || 3)) status = 'near_expiry';

    const item = await InventoryItem.create({
      orgId: req.orgId,
      name,
      barcode: barcode || `BC-${Math.floor(100000 + Math.random() * 900000)}`,
      category,
      quantity,
      unit: unit || 'kg',
      expiryDate,
      daysToExpiryThreshold: daysToExpiryThreshold || 3,
      perishabilityRisk,
      storageType,
      unitPrice: unitPrice || 0,
      wasteRiskScore,
      status
    });

    // Log transaction
    await Transaction.create({
      orgId: req.orgId,
      itemId: item._id,
      itemName: item.name,
      type: 'stock_in',
      quantityChanged: quantity,
      notes: 'Initial inventory entry',
      performedBy: req.user ? req.user.name : 'System'
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await InventoryItem.findOne({ _id: id, orgId: req.orgId });

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    Object.assign(item, req.body);
    if (req.body.expiryDate || req.body.quantity) {
      item.wasteRiskScore = calculateRiskScore(item.expiryDate, item.perishabilityRisk, item.quantity);
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await InventoryItem.findOneAndDelete({ _id: id, orgId: req.orgId });
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpiryAlerts = async (req, res) => {
  try {
    const now = new Date();
    const items = await InventoryItem.find({
      orgId: req.orgId,
      status: { $in: ['near_expiry', 'expired'] }
    }).sort({ expiryDate: 1 });

    const summary = {
      criticalCount: items.filter(i => {
        const daysLeft = Math.ceil((new Date(i.expiryDate) - now) / (1000 * 60 * 60 * 24));
        return daysLeft <= 2 && i.status !== 'expired';
      }).length,
      warningCount: items.filter(i => {
        const daysLeft = Math.ceil((new Date(i.expiryDate) - now) / (1000 * 60 * 60 * 24));
        return daysLeft > 2 && daysLeft <= 5;
      }).length,
      expiredCount: items.filter(i => i.status === 'expired').length,
      items
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lookupBarcode = async (req, res) => {
  try {
    const { code } = req.params;
    const item = await InventoryItem.findOne({ orgId: req.orgId, barcode: code });
    if (!item) {
      return res.status(404).json({ message: 'No inventory item matching scanned barcode' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const quickStockUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta, notes } = req.body; // e.g. delta = +5 or -2

    const item = await InventoryItem.findOne({ _id: id, orgId: req.orgId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity = Math.max(0, item.quantity + (delta || 0));
    await item.save();

    await Transaction.create({
      orgId: req.orgId,
      itemId: item._id,
      itemName: item.name,
      type: delta > 0 ? 'stock_in' : 'stock_out',
      quantityChanged: delta,
      notes: notes || 'Quick QR/Scanner adjustment',
      performedBy: req.user ? req.user.name : 'System Scanner'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkUploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    let addedCount = 0;

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const name = (row.itemName || row.name || '').trim();
          const category = (row.category || '').trim();
          const expiryDate = row.expiryDate;

          if (name && category && expiryDate) {
            const expiry = new Date(expiryDate);
            const qty = parseFloat(row.currentStock || row.quantity) || 1;
            const minStock = parseFloat(row.minimumStock) || 5;
            const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
            let status = 'fresh';
            if (daysLeft <= 0) status = 'expired';
            else if (daysLeft <= 3) status = 'near_expiry';

            const perishabilityRisk = row.perishabilityRisk || (category.includes('Dairy') || category.includes('Produce') || category.includes('Meat') || category.includes('Seafood') || category.includes('Bakery') ? 'High' : 'Low');

            await InventoryItem.create({
              orgId: req.orgId,
              name,
              barcode: row.barcode || `BC-${Math.floor(100000 + Math.random() * 900000)}`,
              category,
              quantity: qty,
              minimumStock: minStock,
              unit: row.unit || 'items',
              supplier: row.supplier || '',
              manufactureDate: row.manufactureDate ? new Date(row.manufactureDate) : undefined,
              expiryDate: expiry,
              storageCondition: row.storageCondition || row.storageType || 'Room Temperature',
              storageType: row.storageCondition || row.storageType || 'Room Temperature',
              notes: row.notes || '',
              daysToExpiryThreshold: parseInt(row.daysToExpiryThreshold) || 3,
              perishabilityRisk,
              unitPrice: parseFloat(row.unitPrice) || 0,
              wasteRiskScore: calculateRiskScore(expiry, perishabilityRisk, qty),
              status
            });
            addedCount++;
          }
        }

        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.json({ message: `Successfully imported ${addedCount} items from CSV`, importedCount: addedCount });
      })
      .on('error', (error) => {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

export const posSyncWebhook = async (req, res) => {
  try {
    const { items } = req.body; // Array of { barcode, quantitySold }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid POS sync payload. Expected items array.' });
    }

    const updated = [];
    for (const posItem of items) {
      const item = await InventoryItem.findOne({ orgId: req.orgId, barcode: posItem.barcode });
      if (item) {
        item.quantity = Math.max(0, item.quantity - posItem.quantitySold);
        await item.save();
        updated.push(item._id);

        await Transaction.create({
          orgId: req.orgId,
          itemId: item._id,
          itemName: item.name,
          type: 'pos_sync',
          quantityChanged: -posItem.quantitySold,
          notes: `Automated POS sync reduction (-${posItem.quantitySold} ${item.unit})`
        });
      }
    }

    res.json({ message: `POS sync complete. ${updated.length} items updated.`, updatedItemsCount: updated.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
