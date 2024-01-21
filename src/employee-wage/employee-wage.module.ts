import { Module } from '@nestjs/common';
import { EmployeeWageController } from './employee-wage.controller';
import { EmployeeWageService } from './employee-wage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeWageSchema } from './schema/employee-wage.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EmployeeWage', schema: EmployeeWageSchema },
    ]),
    UserModule,
  ],
  controllers: [EmployeeWageController],
  providers: [EmployeeWageService],
  exports: [EmployeeWageService],
})
export class EmployeeWageModule {}
