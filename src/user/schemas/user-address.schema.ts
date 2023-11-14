import mongoose from 'mongoose';

export const UserAddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});
