import mongoose, { Schema } from 'mongoose';

export const AppointmentSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  discount: { type: Number },
  canceled: { type: Boolean, default: false },
  type: { type: Schema.Types.ObjectId, ref: 'AppointmentType', required: true },
});
