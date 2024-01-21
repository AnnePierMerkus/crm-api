import { Command, CommandRunner } from 'nest-commander';
import { EmployeeSalaryService } from '../employee-salary.service';
import { UserService } from '../../user/user.service';

@Command({
  name: 'create-salaries',
  arguments: '',
  options: {}
})
export class CreateEmployeeSalariesCommand extends CommandRunner implements CommandRunner {
  constructor(private readonly employeeSalaryService: EmployeeSalaryService, private readonly userService: UserService) {
    super();
  }
  protected command;
  setCommand(command: any): this {
    this.command = command;
    return this;
  }
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const employees = await this.userService.findAll();
    for (const employee of employees) {
      try {
        const amount = await this.employeeSalaryService.createSalaryFromInvoices(employee._id);
        console.log(`Created ${amount} salary for ${employee.firstName} ${employee.lastName}`);
      } catch (error) {
        console.debug(`Error creating salary for ${employee.firstName} ${employee.lastName}`);
        console.log(error);
      }
    }
  }
}