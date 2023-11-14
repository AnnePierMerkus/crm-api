import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdatedCustomerDto } from './dto/customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('/create')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.create(createCustomerDto);
    return { success: true, customer: customer };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedCustomerDto: UpdatedCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.update(id, updatedCustomerDto);
    return { success: true, customer: customer };
  }

  @Get()
  async findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CustomerResponseDto> {
    return { success: true, customer: await this.customerService.delete(id) };
  }
}
