import { Document } from 'mongoose';

export interface MassageType extends Document {
  name: string;
  price: number;
  newPrice?: number | null;
  activationDate?: Date | null;
}
