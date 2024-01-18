import { Document } from 'mongoose';

export interface AppointmentTypeInterface extends Document {
  name: string;
}
export interface AppointmentTypePriceInterface extends Document {
  price: number;
  activeFrom: Date;
  appointmentType: AppointmentTypeInterface;
}
