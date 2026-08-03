import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    orgId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Organization', 
      required: true,
      index: true 
    },
    name: { type: String, required: true, trim: true },
    barcode: { type: String, index: true, default: '' },
    category: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'kg' }, // kg, units, liters, boxes
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true, index: true },
    daysToExpiryThreshold: { type: Number, default: 3 },
    perishabilityRisk: { 
      type: String, 
      enum: ['High', 'Medium', 'Low'], 
      default: 'Medium' 
    },
    storageType: { type: String, default: 'Room Temperature' },
    storageCondition: { type: String, default: 'Room Temperature' },
    minimumStock: { type: Number, default: 5 },
    supplier: { type: String, default: '' },
    manufactureDate: { type: Date },
    notes: { type: String, default: '' },
    unitPrice: { type: Number, default: 0 },
    wasteRiskScore: { type: Number, default: 0 }, // 0 to 100 risk score
    recommendedReorder: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['fresh', 'near_expiry', 'expired', 'donated', 'reordered'], 
      default: 'fresh',
      index: true 
    }
  },
  { timestamps: true }
);

// Compound index for fast queries by org and expiry date
inventoryItemSchema.index({ orgId: 1, expiryDate: 1 });
inventoryItemSchema.index({ orgId: 1, status: 1 });

export default mongoose.model('InventoryItem', inventoryItemSchema);
