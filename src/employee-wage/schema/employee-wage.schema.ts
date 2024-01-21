import mongoose from 'mongoose';

export const EmployeeWageSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  activeFrom: { type: Date, required: true },
});
