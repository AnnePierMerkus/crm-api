import { Document, Schema } from 'mongoose';

export interface UserInterface extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: Schema.Types.ObjectId;
}
