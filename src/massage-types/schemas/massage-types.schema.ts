import { Schema } from 'mongoose';

export const MassageTypeSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  newPrice: { type: Number, required: false, default: null },
  activationDate: { type: Date, required: false, default: null },
});
