export interface CreateAppointmentTypeDTO {
  name: string;
  price: number;
}

export interface UpdatePriceAppointmentTypeDTO {
  price: number;
  activeFrom: Date;
}

export interface UpdateNameAppointmentTypeDTO {
  name: string;
}

export interface AppointmentTypeDTO {
  _id: string;
  name: string;
  price: number;
}

// export class CreateAppointmentTypeDto {
//   @IsString()
//   @IsNotEmpty()
//   readonly name: string;

//   @IsNumber()
//   @IsNotEmpty()
//   readonly price: number;

//   @IsNumber()
//   @IsOptional()
//   readonly newPrice?: number;

//   @IsDate()
//   @IsOptional()
//   readonly activationDate?: Date;
// }

// export class UpdateAppointmentTypeDto extends PartialType(
//   CreateAppointmentTypeDto,
// ) {}
