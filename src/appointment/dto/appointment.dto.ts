import { Schema } from 'mongoose';
import { UpdatedCustomerDto } from '../../customer/dto/customer.dto';
import { UserDto } from '../../user/dto/user.dto';

export interface CreateAppointmentDto {
  start: Date;
  end: Date;
  customer: Schema.Types.ObjectId;
  employee: Schema.Types.ObjectId;
  discount: number;
  canceled: boolean;
  type: Schema.Types.ObjectId;
}

export interface EmployeeAppointmentsDto {
  employee?: UserDto;
  appointments?: {
    start: Date;
    end: Date;
    customer?: UpdatedCustomerDto;
    type?: {
      name: string;
    };
  }[];
}
