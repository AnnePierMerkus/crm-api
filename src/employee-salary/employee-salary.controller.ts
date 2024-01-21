import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EmployeeSalaryService } from './employee-salary.service';
import { CreateEmployeeSalaryDto, QueryEmployeeSalaryDto } from './dto/employee-salary.dto';

@Controller('employee-salary')
export class EmployeeSalaryController {
    constructor(private EmployeeSalaryService: EmployeeSalaryService) {}

    @Post()
    async create(@Body() createEmployeeSalaryDto: CreateEmployeeSalaryDto) {
        const EmployeeSalary = await this.EmployeeSalaryService.create(
            createEmployeeSalaryDto,
        );
        return { success: true, EmployeeSalary: EmployeeSalary };
    }
    
    @Get()
    async findAllBy(@Query() query: QueryEmployeeSalaryDto) {
        const employeeSalaries = await this.EmployeeSalaryService.findAllBy(
            query,
        );
        return { success: true, employeeSalaries };
    }
}
