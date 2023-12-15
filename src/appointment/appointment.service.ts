import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentTypeInterface } from './interfaces/appointment.type.interface';
import { AppointmentInterface } from './interfaces/appointment.interface';
import { CreateAppointmentTypeDto } from './dto/appointment-type.dto';
import {
  CreateAppointmentDto,
  EmployeeAppointmentsDto,
} from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel('AppointmentType')
    private appointmentTypeModel: Model<AppointmentTypeInterface>,
    @InjectModel('Appointment')
    private appointmentModel: Model<AppointmentInterface>,
  ) {}

  async findAll() {
    const appointments = await this.appointmentModel
      .find()
      .populate('employee')
      .populate('customer')
      .populate('type')
      .exec();

    if (!appointments) {
      throw new HttpException('No appointments found', HttpStatus.BAD_REQUEST);
    }

    return appointments.map((appointment) => {
      if (appointment.employee && appointment.employee.password) {
        const sanitized = appointment.employee.toObject();
        delete sanitized['password'];
        appointment.employee = sanitized;
      }

      return appointment;
    });
  }

  async findAllTypes() {
    const types = await this.appointmentTypeModel.find().exec();

    if (!types) {
      throw new HttpException('No types found', HttpStatus.BAD_REQUEST);
    }

    return types;
  }

  async employeeFindBy({
                         startDate,
                         endDate,
                       }: {
    startDate?: string;
    endDate?: string;
  }) {
    const employees: EmployeeAppointmentsDto[] = [];

    const appointments = await this.appointmentModel
      .find({ start: { $gte: startDate, $lt: endDate } })
      .populate('employee')
      .populate('customer')
      .populate('type')
      .exec();

    if (!appointments) {
      throw new HttpException('No appointments found', HttpStatus.BAD_REQUEST);
    }

    appointments.forEach((appointment) => {
      const { start, end, customer, type } = appointment;
      const employee = employees.find(
        (e) => e.employee.email == appointment.employee.email,
      );
      if (employee) {
        employee.appointments.push({ start, end, customer, type });
      } else {
        const { firstName, lastName, email, phoneNumber } =
          appointment.employee;

        employees.push({
          employee: { firstName, lastName, email, phoneNumber },
          appointments: [{ start, end, customer, type }],
        });
      }
    });

    return employees;
  }

  async createType(createAppointmentTypeDto: CreateAppointmentTypeDto) {
    const createdType = new this.appointmentTypeModel(createAppointmentTypeDto);
    console.log(createdType);

    return await createdType.save();
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }
}
