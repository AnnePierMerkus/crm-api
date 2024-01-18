import { Injectable } from '@nestjs/common';
import { EmployeeSalaryInterface } from './interfaces/employee-salary.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateEmployeeSalaryDto,
  EmployeeSalaryDto,
  QueryEmployeeSalaryDto,
} from './dto/employee-salary.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmployeeSalaryService {
  constructor(
    @InjectModel('EmployeeSalary')
    private employeeSalaryModel: Model<EmployeeSalaryInterface>,
    private userService: UserService,
  ) {}

  async create(
    createEmployeeSalaryDto: CreateEmployeeSalaryDto,
  ): Promise<EmployeeSalaryDto> {
    const user = await this.userService.findById(
      createEmployeeSalaryDto.employee,
    );
    if (!user) {
      throw new Error('Employee not found');
    }

    const employeeSalary = await new this.employeeSalaryModel({
      employee: user._id,
      type: createEmployeeSalaryDto.type,
      amount: createEmployeeSalaryDto.amount,
      activeFrom: createEmployeeSalaryDto.activeFrom,
    }).save();

    return {
      ID: employeeSalary._id,
      type: employeeSalary.type,
      amount: employeeSalary.amount,
      activeFrom: employeeSalary.activeFrom,
      isActive: true,
    };
  }

  async findAllBy(query: QueryEmployeeSalaryDto): Promise<EmployeeSalaryDto[]> {
    const employeeSalaries = await this.employeeSalaryModel
      .find(query)
      .sort({ activeFrom: -1 })
      .exec();

    let activeSalaryFound = false;

    return employeeSalaries.map((employeeSalary) => {
      const isActive =
        !activeSalaryFound && employeeSalary.activeFrom <= new Date();
      if (isActive) {
        activeSalaryFound = true;
      }

      return {
        ID: employeeSalary._id,
        type: employeeSalary.type,
        amount: employeeSalary.amount,
        activeFrom: employeeSalary.activeFrom,
        isActive: isActive,
      };
    });
  }

  async findActive(query: QueryEmployeeSalaryDto): Promise<EmployeeSalaryDto> {
    const currentDate = new Date();

    const activeSalary = await this.employeeSalaryModel
      .findOne({
        ...query,
        activeFrom: { $lte: currentDate },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!activeSalary) {
      throw new Error('No active salary found');
    }

    return {
      ID: activeSalary._id,
      type: activeSalary.type,
      amount: activeSalary.amount,
      activeFrom: activeSalary.activeFrom,
      isActive: true,
    };
  }
}
