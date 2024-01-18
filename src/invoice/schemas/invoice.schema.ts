import mongoose from 'mongoose';

export const InvoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    customerName: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);
