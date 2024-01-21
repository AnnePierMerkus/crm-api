import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InvoiceInterface } from './interfaces/invoice.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateInvoiceDto,
  InvoiceDto,
  QueryInvoiceDto,
} from './dto/invoice.dto';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentTypeService } from 'src/appointment/appointment-type.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private invoiceModel: Model<InvoiceInterface>,
    private appointmentService: AppointmentService,
    private appointmentTypeService: AppointmentTypeService
  ) {}

  generateUnique6CharInt(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceInterface> {
    const appointment = await this.appointmentService.findById(
      createInvoiceDto.appointment,
    );

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const existingInvoice = await this.invoiceModel
      .findOne({ appointment: appointment._id })
      .exec();
    if (existingInvoice) {
      throw new NotFoundException('Appointment already has an invoice');
    }

    const price = await this.appointmentTypeService.getPrice(
      appointment.type._id,
      appointment.start,
    );

    const invoice = await new this.invoiceModel({
      number: this.generateUnique6CharInt(),
      appointment: appointment,
      employee: appointment.employee,
      start: appointment.start,
      end: appointment.end,
      customerName:
      appointment.customer ? appointment.customer.firstName + ' ' + appointment.customer.lastName : "Anonymous",
      price: price,
    }).save();

    if (!invoice) {
      throw new NotFoundException('Invoice not created');
    }

    return invoice;
  }

  async createInvoicesForPastAppointments(): Promise<number> {
    const pastAppointments =
      await this.appointmentService.findPastAppointments();

    if (!pastAppointments) {
      return;
    }

    let invoicesCreated = 0;
    for (const appointment of pastAppointments) {
      const existingInvoice = await this.invoiceModel
        .findOne({ appointment: appointment._id })
        .exec();
      if (existingInvoice) {
        continue;
      }

      await this.create({
        appointment: appointment._id,
      });

      invoicesCreated++;
    }
    return invoicesCreated;
  }

  async findAllBy(query: QueryInvoiceDto): Promise<InvoiceInterface[]> {
    const findQuery = {};
    if (query.start) {
      findQuery['start'] = { $gte: query.start };
    }

    if (query.end) {
      findQuery['start'] = { ...findQuery['start'], $lte: query.end };
    }

    if (query.employee) {
      findQuery['employee'] = query.employee;
    }

    const invoices = await this.invoiceModel
      .find(findQuery)
      .populate('appointment')
      .populate('employee')
      .exec();

    if (!invoices) {
      throw new NotFoundException('Invoices not found');
    }

return invoices;
  }

  async findById(id: string): Promise<InvoiceInterface> {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('appointment')
      .populate('employee')
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }
}
