import { Document } from 'mongoose';

export interface AppointmentTypeInterface extends Document {
  name: string;
  price: number;
  newPrice?: number | null;
  activationDate?: Date | null;
}
