import { Module } from '@nestjs/common';
import { EmployeeSalaryController } from './employee-salary.controller';
import { EmployeeSalaryService } from './employee-salary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSalarySchema } from './schema/employee-salary.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EmployeeSalary', schema: EmployeeSalarySchema },
    ]),
    UserModule,
  ],
  controllers: [EmployeeSalaryController],
  providers: [EmployeeSalaryService],
})
export class EmployeeSalaryModule {}
