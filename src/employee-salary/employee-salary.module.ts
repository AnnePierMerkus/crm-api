import { Module } from '@nestjs/common';
import { EmployeeSalaryService } from './employee-salary.service';
import { EmployeeSalaryController } from './employee-salary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSalarySchema } from './schema/employee-salary.schema';
import { UserModule } from 'src/user/user.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { EmployeeWageModule } from 'src/employee-wage/employee-wage.module';
import { CreateEmployeeSalariesCommand } from './commands/create-employee-salary.command';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EmployeeSalary', schema: EmployeeSalarySchema },
    ]),
    UserModule,
    InvoiceModule,
    EmployeeWageModule
  ],
  providers: [EmployeeSalaryService, CreateEmployeeSalariesCommand],
  controllers: [EmployeeSalaryController],
  exports: [CreateEmployeeSalariesCommand],
})
export class EmployeeSalaryModule {}
