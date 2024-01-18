import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmployeeSalaryService } from './employee-salary.service';
import {
  CreateEmployeeSalaryDto,
  QueryEmployeeSalaryDto,
} from './dto/employee-salary.dto';

@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(private employeeSalaryService: EmployeeSalaryService) {}

  @Post()
  async create(@Body() createEmployeeSalaryDto: CreateEmployeeSalaryDto) {
    const employeeSalary = await this.employeeSalaryService.create(
      createEmployeeSalaryDto,
    );
    return { success: true, employeeSalary: employeeSalary };
  }

  @Get()
  async findAllBy(@Query() query: QueryEmployeeSalaryDto) {
    const employeeSalaries = await this.employeeSalaryService.findAllBy(query);
    return { success: true, employeeSalaries: employeeSalaries };
  }

  @Get('active')
  async findActive(@Query() query: QueryEmployeeSalaryDto) {
    const employeeSalaries = await this.employeeSalaryService.findActive(query);
    return { success: true, employeeSalaries: employeeSalaries };
  }
}
