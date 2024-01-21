import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceSchema } from './schemas/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { CreateInvoicesCommand } from './commands/create-invoices.command';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]),
    AppointmentModule,
  ],
  providers: [InvoiceService, CreateInvoicesCommand],
  controllers: [InvoiceController],
  exports: [InvoiceService, CreateInvoicesCommand],
})
export class InvoiceModule {}
