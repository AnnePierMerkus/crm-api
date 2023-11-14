import { Document } from "mongoose";

export interface CustomerResponseDto {
  success: boolean;
  customer: Document;
}
