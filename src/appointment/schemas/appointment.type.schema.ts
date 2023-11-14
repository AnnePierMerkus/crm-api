import mongoose from 'mongoose';

export const AppointmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
