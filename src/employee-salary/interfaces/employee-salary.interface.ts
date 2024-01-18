import { Document } from 'mongoose';

export interface EmployeeSalaryInterface extends Document {
  readonly employee: string;
  readonly type: string;
  readonly amount: number;
  readonly activeFrom: Date;
}
