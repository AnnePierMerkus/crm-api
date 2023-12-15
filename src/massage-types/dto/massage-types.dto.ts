import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateMassageTypeDto {
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

export class UpdateMassageTypeDto extends PartialType(CreateMassageTypeDto) {}
