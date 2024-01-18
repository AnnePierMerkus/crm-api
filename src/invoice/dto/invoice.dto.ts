import { Schema } from 'mongoose';

export interface InvoiceDto {
  number: string;
  appointment: Schema.Types.ObjectId;
  date: Date;
  time: string;
  price: number;
  customerName: string;
  employeeId: Schema.Types.ObjectId;
  employeeName: string;
}

export interface CreateInvoiceDto {
  appointment: string;
}

// Query parameters for finding invoices
export interface QueryInvoiceDto {
  start?: string;
  end?: string;
  employee?: string;
}
