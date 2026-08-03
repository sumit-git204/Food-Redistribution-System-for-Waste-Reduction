import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' },
    itemName: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['stock_in', 'stock_out', 'manual_adjustment', 'expiry_waste', 'surplus_donation', 'pos_sync'], 
      required: true 
    },
    quantityChanged: { type: Number, required: true },
    notes: { type: String, default: '' },
    performedBy: { type: String, default: 'System' }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
