import mongoose from 'mongoose';

const taxonomySchema = new mongoose.Schema(
  {
    category: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    perishabilityRisk: { 
      type: String, 
      enum: ['High', 'Medium', 'Low'], 
      default: 'Medium' 
    },
    defaultExpiryThresholdDays: { type: Number, default: 3 },
    storageType: { 
      type: String, 
      enum: ['Refrigerated', 'Frozen', 'Dry Storage', 'Ambient'], 
      default: 'Ambient' 
    },
    icon: { type: String, default: 'Package' }
  },
  { timestamps: true }
);

export default mongoose.model('Taxonomy', taxonomySchema);
