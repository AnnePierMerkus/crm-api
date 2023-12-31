import mongoose from 'mongoose';

export const AppointmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  newPrice: { type: Number, required: false, default: null },
  activationDate: { type: Date, required: false, default: null },
});
