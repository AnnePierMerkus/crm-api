import { Command, CommandRunner } from 'nest-commander';
import { InvoiceService } from '../invoice.service';

@Command({
  name: 'create-invoices',
  arguments: '',
  options: {}
})
export class CreateInvoicesCommand extends CommandRunner implements CommandRunner {
  constructor(private readonly invoiceService: InvoiceService) {
    super();
  }
  protected command;
  setCommand(command: any): this {
    this.command = command;
    return this;
  }
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const amount = await this.invoiceService.createInvoicesForPastAppointments();
    console.log(`Created ${amount} invoices`);
  }
}