import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateInvoiceDto, QueryInvoiceDto } from './dto/invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) { }

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

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    return {
      success: true,
      invoice: {
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
      },
    };
  }

  @Get()
  async findAllBy(@Query() query: QueryInvoiceDto) {
    const invoices = await this.invoiceService.findAllBy(query);
    return {
      success: true,
      invoices: invoices.map((invoice) => {
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
      }),
      newInvoices: 0,
    };
  }
}
