import { Module } from '@nestjs/common';
import { EmployeeIncomeService } from './employee-income.service';
import { EmployeeIncomeController } from './employee-income.controller';

@Module({
  providers: [EmployeeIncomeService],
  controllers: [EmployeeIncomeController]
})
export class EmployeeIncomeModule {}
