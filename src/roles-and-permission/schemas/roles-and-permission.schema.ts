import mongoose from 'mongoose';

export const RolesAndPermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bookings: { type: String, required: true },
  employees: { type: String, required: true },
  customers: { type: String, required: true },
  massageTypes: { type: String, required: true },
  salaries: { type: String, required: true },
  bookingHistory: { type: String, required: true },
  roles: { type: String, required: true },
});
