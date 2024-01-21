import { Injectable } from '@nestjs/common';
import { EmployeeWageInterface } from './interfaces/employee-wage.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateEmployeeWageDto,
  EmployeeWageDto,
  QueryEmployeeWageDto,
} from './dto/employee-wage.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmployeeWageService {
  constructor(
    @InjectModel('EmployeeWage')
    private EmployeeWageModel: Model<EmployeeWageInterface>,
    private userService: UserService,
  ) { }

  async create(
    createEmployeeWageDto: CreateEmployeeWageDto,
  ): Promise<EmployeeWageDto> {
    const user = await this.userService.findById(
      createEmployeeWageDto.employee,
    );
    if (!user) {
      throw new Error('Employee not found');
    }

    const EmployeeWage = await new this.EmployeeWageModel({
      employee: user._id,
      type: createEmployeeWageDto.type,
      amount: createEmployeeWageDto.amount,
      activeFrom: createEmployeeWageDto.activeFrom,
    }).save();

    return {
      ID: EmployeeWage._id,
      type: EmployeeWage.type,
      amount: EmployeeWage.amount,
      activeFrom: EmployeeWage.activeFrom,
      isActive: true,
    };
  }

  async findAllBy(query: QueryEmployeeWageDto): Promise<EmployeeWageDto[]> {
    const employeeWages = await this.EmployeeWageModel
      .find(query)
      .sort({ activeFrom: -1 })
      .exec();

    let activeWageFound = false;

    return employeeWages.map((EmployeeWage) => {
      const isActive =
        !activeWageFound && EmployeeWage.activeFrom <= new Date();
      if (isActive) {
        activeWageFound = true;
      }

      return {
        ID: EmployeeWage._id,
        type: EmployeeWage.type,
        amount: EmployeeWage.amount,
        activeFrom: EmployeeWage.activeFrom,
        isActive: isActive,
      };
    });
  }

  async findActive(query: QueryEmployeeWageDto): Promise<EmployeeWageDto> {
    const currentDate = new Date();

    const activeWage = await this.EmployeeWageModel
      .findOne({
        ...query,
        activeFrom: { $lte: currentDate },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!activeWage) {
      throw new Error('No active wage found');
    }

    return {
      ID: activeWage._id,
      type: activeWage.type,
      amount: activeWage.amount,
      activeFrom: activeWage.activeFrom,
      isActive: true,
    };
  }

  async findActiveByDate(query: QueryEmployeeWageDto, date: Date): Promise<EmployeeWageDto> {
    let activeWage = await this.EmployeeWageModel
      .findOne({
        ...query,
        activeFrom: { $lte: date },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!activeWage) {
      activeWage = await this.EmployeeWageModel
        .findOne(query)
        .sort({ activeFrom: 1 })
        .exec();

      if (!activeWage) {
        throw new Error('No active wage found');
      }
    }

    return {
      ID: activeWage._id,
      type: activeWage.type,
      amount: activeWage.amount,
      activeFrom: activeWage.activeFrom,
      isActive: true,
    };
  }

  async findFirst(query: QueryEmployeeWageDto): Promise<EmployeeWageDto> {
    const employeeWage = await this.EmployeeWageModel
      .findOne(query)
      .sort({ activeFrom: 1 })
      .exec();

    if (!employeeWage) {
      throw new Error('No wage found');
    }

    return {
      ID: employeeWage._id,
      type: employeeWage.type,
      amount: employeeWage.amount,
      activeFrom: employeeWage.activeFrom,
      isActive: false,
    };
  }
}
