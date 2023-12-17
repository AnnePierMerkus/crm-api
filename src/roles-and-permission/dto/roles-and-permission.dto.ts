import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Document } from "mongoose";

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly bookings: string;

  @IsString()
  @IsNotEmpty()
  readonly employees: string;

  @IsString()
  @IsNotEmpty()
  readonly customers: string;

  @IsString()
  @IsNotEmpty()
  readonly massageTypes: string;

  @IsString()
  @IsNotEmpty()
  readonly salaries: string;

  @IsString()
  @IsNotEmpty()
  readonly bookingHistory: string;

  @IsString()
  @IsNotEmpty()
  readonly roles: string;
}

export class UpdatedRoleDTO extends PartialType(CreateRoleDTO) {}

export interface RolesAndPermissionResponseDto {
  success: boolean;
  rolesAndPermission: Document;
}