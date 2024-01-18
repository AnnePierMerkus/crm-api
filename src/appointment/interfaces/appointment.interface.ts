import { Document } from 'mongoose';
import { CustomerInterface } from '../../customer/interfaces/customer.interface';
import { UserInterface } from '../../user/interfaces/user.interface';
import { AppointmentTypeInterface } from './appointment.type.interface';

export interface AppointmentInterface extends Document {
  start: Date;
  end: Date;
  customer: CustomerInterface;
  employee: UserInterface;
  discount: number;
  canceled: boolean;
  type: AppointmentTypeInterface;
}
