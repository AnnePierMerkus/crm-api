import mongoose, { Schema } from 'mongoose';

export const AppointmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export const AppointmentTypePriceSchema = new mongoose.Schema({
  appointmentType: {
    type: Schema.Types.ObjectId,
    ref: 'AppointmentType',
    required: true,
  },
  price: { type: Number, required: true },
  activeFrom: { type: Date, required: true },
});
