
import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ['House', 'Apartment', 'Villa', 'Land'] },
    status: { type: String, required: true, enum: ['For Sale', 'For Rent'] },
    imageUrl: { type: String, required: true },
    gallery: [{ type: String }],
    agent: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    features: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
