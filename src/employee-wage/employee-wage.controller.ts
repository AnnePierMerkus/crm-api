import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmployeeWageService } from './employee-wage.service';
import {
  CreateEmployeeWageDto,
  QueryEmployeeWageDto,
} from './dto/employee-wage.dto';

@Controller('employee-wage')
export class EmployeeWageController {
  constructor(private EmployeeWageService: EmployeeWageService) {}

  @Post()
  async create(@Body() createEmployeeWageDto: CreateEmployeeWageDto) {
    const EmployeeWage = await this.EmployeeWageService.create(
      createEmployeeWageDto,
    );
    return { success: true, EmployeeWage: EmployeeWage };
  }

  @Get()
  async findAllBy(@Query() query: QueryEmployeeWageDto) {
    const employeeWages = await this.EmployeeWageService.findAllBy(query);
    return { success: true, employeeWages: employeeWages };
  }

  @Get('active')
  async findActive(@Query() query: QueryEmployeeWageDto) {
    const employeeWages = await this.EmployeeWageService.findActive(query);
    return { success: true, employeeWages: employeeWages };
  }
}
