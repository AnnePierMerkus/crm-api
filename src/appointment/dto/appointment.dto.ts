import { Schema, Types } from 'mongoose';
import {
  CreateCustomerDto,
  UpdatedCustomerDto,
} from '../../customer/dto/customer.dto';
import { UserDto } from '../../user/dto/user.dto';

export interface CreateAppointmentDto {
  start: Date;
  end: Date;
  customer: Schema.Types.ObjectId | CreateCustomerDto;
  employee: Schema.Types.ObjectId;
  discount: number;
  canceled: boolean;
  type: Schema.Types.ObjectId;
}

export interface EmployeeAppointmentsDto {
  employee?: UserDto;
  appointments?: {
    _id: Types.ObjectId;
    start: Date;
    end: Date;
    customer?: UpdatedCustomerDto;
    type?: {
      name: string;
    };
  }[];
}

export interface PatchAppointmentDto {
  start?: Date;
  end?: Date;
  employee?: Schema.Types.ObjectId;
  discount?: number;
  type?: Schema.Types.ObjectId;
}

export interface CancelAppointementDto {
  canceled: boolean;
}
