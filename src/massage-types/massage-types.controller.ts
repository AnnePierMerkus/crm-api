// massage-type.controller.ts
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { MassageTypeService } from './massage-types.service';
import { CreateMassageTypeDto, UpdateMassageTypeDto } from './dto/massage-types.dto';

@Controller('massage-types')
export class MassageTypeController {
  constructor(private readonly massageTypeService: MassageTypeService) {}

  @Post()
  async create(@Body() createMassageTypeDto: CreateMassageTypeDto) {
    return await this.massageTypeService.create(createMassageTypeDto);
  }

  @Get()
  async findAll() {
    return await this.massageTypeService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMassageTypeDto: UpdateMassageTypeDto) {
    return await this.massageTypeService.update(id, updateMassageTypeDto);
  }
}
