import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateInvoiceDto, QueryInvoiceDto } from './dto/invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    return { success: true, invoice: invoice };
  }

  @Get()
  async findAllBy(@Query() query: QueryInvoiceDto) {
    const newInvoices =
      await this.invoiceService.createInvoicesForPastAppointments();
    const invoices = await this.invoiceService.findAllBy(query);
    return { success: true, invoices: invoices, newInvoices: newInvoices };
  }
}
