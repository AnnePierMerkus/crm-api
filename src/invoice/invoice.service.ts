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
    private appointmentTypeService: AppointmentTypeService,
  ) {}

  generateUnique6CharInt(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTimeDifference(date1, date2) {
    const diffInMilliseconds = Math.abs(date2 - date1);
    const hours = Math.floor(diffInMilliseconds / 3600000); // 1 Hour = 36000 Milliseconds
    const minutes = Math.floor((diffInMilliseconds % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    const formattedTime =
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0');
    return formattedTime;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
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
        appointment.customer.firstName + ' ' + appointment.customer.lastName,
      price: price,
    }).save();

    if (!invoice) {
      throw new NotFoundException('Invoice not created');
    }

    const invoiceDto: InvoiceDto = {
      number: invoice.number,
      appointment: invoice.appointment._id,
      date: invoice.start,
      time: this.getTimeDifference(invoice.start, invoice.end),
      price: invoice.price,
      customerName: invoice.customerName,
      employeeId: invoice.appointment.employee._id,
      employeeName:
        invoice.appointment.employee.firstName +
        ' ' +
        invoice.appointment.employee.lastName,
    };

    return invoiceDto;
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

  async findAllBy(query: QueryInvoiceDto): Promise<InvoiceDto[]> {
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

    const invoiceDtos: InvoiceDto[] = invoices.map((invoice) => {
      return {
        number: invoice.number,
        appointment: invoice.appointment._id,
        date: invoice.start,
        time: this.getTimeDifference(invoice.start, invoice.end),
        price: invoice.price,
        customerName: invoice.customerName,
        employeeId: invoice.appointment.employee._id,
        employeeName:
          invoice.employee.firstName + ' ' + invoice.employee.lastName,
      };
    });

    return invoiceDtos;
  }
}
