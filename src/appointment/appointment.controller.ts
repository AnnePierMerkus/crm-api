import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentTypeDto,
  AppointmentTypeResponseDTO,
  UpdateAppointmentTypeDto,
} from './dto/appointment-type.dto';
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

  @Put('type/:id')
  async updateType(
    @Param('id') id: string,
    @Body() updatedAppointmentTypeDTO: UpdateAppointmentTypeDto,
  ): Promise<AppointmentTypeResponseDTO> {
    const appointmentType = await this.appointmentService.updateType(
      id,
      updatedAppointmentTypeDTO,
    );
    return { success: true, appointmentType: appointmentType };
  }

  @Delete('/type/:id')
  async deleteType(@Param('id') id: string): Promise<AppointmentTypeResponseDTO> {
    return { success: true, appointmentType: await this.appointmentService.deleteType(id) };

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

  @Get('/type')
  async findAllTypes() {
    return {
      success: true,
      types: await this.appointmentService.findAllTypes(),
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
