import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

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

export class UpdateAppointmentTypeDto extends PartialType(CreateAppointmentTypeDto) {}
