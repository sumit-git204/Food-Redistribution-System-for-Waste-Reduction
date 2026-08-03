import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['business', 'ngo', 'community_kitchen'], 
      default: 'business' 
    },
    businessType: { type: String, default: 'Supermarket' }, // Supermarket, Restaurant, Bakery, Hotel
    address: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, default: '' },
    capacityKg: { type: Number, default: 500 }, // Max storage capacity
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Organization', organizationSchema);
