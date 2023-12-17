import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { Document } from 'mongoose';

export class CreateAppointmentTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @IsOptional()
  readonly newPrice?: number;

  @IsDate()
  @IsOptional()
  readonly activationDate?: Date;
}

export class UpdateAppointmentTypeDto extends PartialType(
  CreateAppointmentTypeDto,
) {}

export interface AppointmentTypeResponseDTO {
  success: boolean;
  appointmentType: Document;
}
