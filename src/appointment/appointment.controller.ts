import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentTypeDto } from './dto/appointment-type.dto';
import { CreateAppointmentDto } from './dto/appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post('/type/create')
  async createType(@Body() createAppointmentTypeDto: CreateAppointmentTypeDto) {
    const type = await this.appointmentService.createType(
      createAppointmentTypeDto,
    );
    return {
      success: true,
      createdAppointmentType: type,
    };
  }
  @Post('/create')
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const type = await this.appointmentService.create(createAppointmentDto);
    return {
      success: true,
      createdAppointment: type,
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      appointments: await this.appointmentService.findAll(),
    };
  }

  @Get('/employees')
  async employeesFindAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return {
      success: true,
      employees: await this.appointmentService.employeeFindBy({
        startDate,
        endDate,
      }),
    };
  }
}
