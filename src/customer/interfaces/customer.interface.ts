import { Document } from 'mongoose';

export interface CustomerInterface extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
}
