import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  PatchAppointmentDto,
} from './dto/appointment.dto';
import { AppointmentTypeService } from './appointment-type.service';
import {
  CreateAppointmentTypeDTO,
  UpdateNameAppointmentTypeDTO,
  UpdatePriceAppointmentTypeDTO,
} from './dto/appointment-type.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private appointmentService: AppointmentService,
    private appointmentTypeService: AppointmentTypeService,
  ) {}

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

  @Patch('/:id')
  async editAppointent(
    @Param('id') id: string,
    @Body() patchAppointementDto: PatchAppointmentDto,
  ) {
    return {
      success: true,
      appointment: await this.appointmentService.patchAppointment(
        id,
        patchAppointementDto,
      ),
    };
  }

  @Delete('/:id')
  async cancelAppointment(@Param('id') id: string) {
    return {
      success: true,
      appointment: await this.appointmentService.cancelAppointment(id),
    };
  }

  @Get('/type')
  async findAllTypes() {
    return {
      success: true,
      types: await this.appointmentTypeService.findAll(),
    };
  }

  @Get('/type/:id/prices')
  async findAllTypePrices(@Param('id') id: string) {
    return {
      success: true,
      prices: await this.appointmentTypeService.findAllPrices(id),
    };
  }

  @Post('/type/create')
  async createType(@Body() createAppointmentTypeDto: CreateAppointmentTypeDTO) {
    const type = await this.appointmentTypeService.create(
      createAppointmentTypeDto,
    );
    return {
      success: true,
      createdAppointmentType: type,
    };
  }

  @Patch('type/:id/price')
  async updateTypePrice(
    @Param('id') id: string,
    @Body() updatePriceAppointmentTypeDTO: UpdatePriceAppointmentTypeDTO,
  ) {
    const type = await this.appointmentTypeService.updatePrice(
      id,
      updatePriceAppointmentTypeDTO,
    );
    return {
      success: true,
      updatedAppointmentType: type,
    };
  }

  @Patch('type/:id/name')
  async updateTypeName(
    @Param('id') id: string,
    @Body() updateNameAppointmentTypeDTO: UpdateNameAppointmentTypeDTO,
  ) {
    const type = await this.appointmentTypeService.updateName(
      id,
      updateNameAppointmentTypeDTO.name,
    );
    return {
      success: true,
      updatedAppointmentType: type,
    };
  }

  // @Put('type/:id')
  // async updateType(
  //   @Param('id') id: string,
  //   @Body() updatedAppointmentTypeDTO: UpdateAppointmentTypeDto,
  // ): Promise<AppointmentTypeResponseDTO> {
  //   const appointmentType = await this.appointmentService.updateType(
  //     id,
  //     updatedAppointmentTypeDTO,
  //   );
  //   return { success: true, appointmentType: appointmentType };
  // }

  // @Delete('/type/:id')
  // async deleteType(
  //   @Param('id') id: string,
  // ): Promise<AppointmentTypeResponseDTO> {
  //   return {
  //     success: true,
  //     appointmentType: await this.appointmentService.deleteType(id),
  //   };
  // }
}
