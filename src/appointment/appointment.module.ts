import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import {
  AppointmentTypePriceSchema,
  AppointmentTypeSchema,
} from './schemas/appointment.type.schema';
import { CustomerModule } from 'src/customer/customer.module';
import { AppointmentTypeService } from './appointment-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AppointmentType', schema: AppointmentTypeSchema },
      { name: 'AppointmentTypePrice', schema: AppointmentTypePriceSchema },
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
    CustomerModule,
  ],
  providers: [AppointmentService, AppointmentTypeService],
  controllers: [AppointmentController],
  exports: [AppointmentService, AppointmentTypeService],
})
export class AppointmentModule {}
