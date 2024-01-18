import { Document } from 'mongoose';
import { AppointmentInterface } from 'src/appointment/interfaces/appointment.interface';
import { UserInterface } from 'src/user/interfaces/user.interface';

export interface InvoiceInterface extends Document {
  readonly number: string;
  readonly appointment: AppointmentInterface;
  readonly employee: UserInterface;
  readonly start: Date;
  readonly end: Date;
  readonly customerName: string;
  readonly price: number;
}
