import { Document } from 'mongoose';
export interface RolesAndPermissionInterface extends Document {
  readonly name: string;
  readonly bookings: string;
  readonly employees: string;
  readonly customers: string;
  readonly massageTypes: string;
  readonly salaries: string;
  readonly bookingHistory: string;
  readonly roles: string;
}
