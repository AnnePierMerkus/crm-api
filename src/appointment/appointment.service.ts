import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AppointmentTypeInterface } from './interfaces/appointment.type.interface';
import { AppointmentInterface } from './interfaces/appointment.interface';
import {
  CreateAppointmentDto,
  EmployeeAppointmentsDto,
} from './dto/appointment.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel('AppointmentType')
    private appointmentTypeModel: Model<AppointmentTypeInterface>,
    @InjectModel('Appointment')
    private appointmentModel: Model<AppointmentInterface>,
    private customerService: CustomerService,
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

  async findByEmployeeId(id: string, invoice: boolean = false) {
    const currentDate = new Date();
    const appointments = await this.appointmentModel
      .find({
        employee: id,
        end: invoice ? { $lt: currentDate } : { $gt: currentDate },
      })
      .populate('customer')
      .populate('type')
      .exec();

    if (!appointments) {
      throw new HttpException('No appointments found', HttpStatus.BAD_REQUEST);
    }

    return appointments;
  }

  async employeeFindBy({
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  }) {
    const employees: EmployeeAppointmentsDto[] = [];

    const currentDate = new Date();
    const appointments = await this.appointmentModel
      .find({
        start: { $gte: startDate, $lt: endDate },
        end: { $gte: currentDate },
        canceled: { $ne: true },
      })
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
        employee.appointments.push({
          _id: appointment.id,
          start,
          end,
          customer,
          type,
        });
      } else {
        const { firstName, lastName, email, phoneNumber } =
          appointment.employee;

        employees.push({
          employee: {
            _id: appointment.employee.id,
            firstName,
            lastName,
            email,
            phoneNumber,
          },
          appointments: [{ _id: appointment.id, start, end, customer, type }],
        });
      }
    });
    return employees;
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid appointment ID: ${id}`);
    }

    const appointment = await this.appointmentModel
      .findById(id)
      .populate('employee')
      .populate('customer')
      .populate('type')
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  async findPastAppointments() {
    const currentDate = new Date();
    const appointments = await this.appointmentModel
      .find({ end: { $lt: currentDate }, canceled: false })
      .exec();
    return appointments;
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    if (
      typeof createAppointmentDto.customer === 'object' &&
      'firstName' in createAppointmentDto.customer
    ) {
      const createdCustomer = await this.customerService.create(
        createAppointmentDto.customer,
      );
      createAppointmentDto.customer = createdCustomer._id;
    }
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async patchAppointment(id: string, patchAppointmentDto: any) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      patchAppointmentDto,
    );

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    return appointment;
  }

  async cancelAppointment(id: string) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { canceled: true },
      { new: true },
    );

    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    return appointment;
  }
}
