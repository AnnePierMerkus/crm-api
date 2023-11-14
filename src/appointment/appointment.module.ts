import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import { AppointmentTypeSchema } from './schemas/appointment.type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AppointmentType', schema: AppointmentTypeSchema },
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
