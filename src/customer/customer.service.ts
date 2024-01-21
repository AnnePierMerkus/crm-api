import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CustomerInterface } from './interfaces/customer.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto, UpdatedCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: Model<CustomerInterface>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = new this.customerModel(createCustomerDto);
    return customer.save();
  }

  async update(id: string, updatedCustomerDto: UpdatedCustomerDto) {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      updatedCustomerDto,
    );

    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return this.findById(id);
  }

  async findAll() {
    const customerData = await this.customerModel.find().exec();
    if (!customerData || customerData.length == 0) {
      throw new NotFoundException('No customers not found!');
    }
    return customerData;
  }

  async findById(id: string) {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async delete(id: string) {
    const customer = await this.customerModel.findByIdAndRemove(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }
}
