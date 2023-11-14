import { Document } from 'mongoose';

export interface UserAddressInterface extends Document {
  line1: string;
  city: string;
  zip: string;
  country: string;
}
