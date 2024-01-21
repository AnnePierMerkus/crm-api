import mongoose from 'mongoose';

export const EmployeeSalarySchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: false,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
  }
);
