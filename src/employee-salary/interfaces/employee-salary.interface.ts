import { Document } from 'mongoose';
import { InvoiceInterface } from 'src/invoice/interfaces/invoice.interface';
import { UserInterface } from 'src/user/interfaces/user.interface';

export interface EmployeeSalaryInterface extends Document {
  readonly invoice?: InvoiceInterface;
  readonly employee: UserInterface;
  readonly amount: number;
  readonly description: string;
  readonly date: Date;
}
