import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AppointmentTypeInterface,
  AppointmentTypePriceInterface,
} from './interfaces/appointment.type.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  AppointmentTypeDTO,
  CreateAppointmentTypeDTO,
  UpdatePriceAppointmentTypeDTO,
} from './dto/appointment-type.dto';

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectModel('AppointmentType')
    private appointmentTypeModel: Model<AppointmentTypeInterface>,
    @InjectModel('AppointmentTypePrice')
    private appointmentTypePriceModel: Model<AppointmentTypePriceInterface>,
  ) {}

  async findAll(): Promise<AppointmentTypeDTO[]> {
    const types = await this.appointmentTypeModel.find().exec();

    if (!types) {
      throw new HttpException('No types found', HttpStatus.BAD_REQUEST);
    }

    const typesWithPrice = await Promise.all(
      types.map(async (type) => {
        const price = await this.appointmentTypePriceModel
          .findOne({
            appointmentType: type._id,
            activeFrom: {
              $lte: new Date(),
            },
          })
          .sort({ activeFrom: -1 })
          .exec();

        return {
          ...type.toObject(),
          price: price?.price,
        };
      }),
    );

    return typesWithPrice;
  }

  async create(
    createAppointmentTypeDto: CreateAppointmentTypeDTO,
  ): Promise<AppointmentTypeDTO> {
    const createdType = await new this.appointmentTypeModel({
      name: createAppointmentTypeDto.name,
    }).save();

    if (!createdType) {
      throw new HttpException(
        'Could not create appointment type',
        HttpStatus.BAD_REQUEST,
      );
    }
    await new this.appointmentTypePriceModel({
      price: createAppointmentTypeDto.price,
      activeFrom: new Date(),
      appointmentType: createdType,
    }).save();

    return {
      ...createdType.toObject(),
      price: createAppointmentTypeDto.price,
    };
  }

  async updatePrice(
    id: string,
    updatePriceAppointmentTypeDTO: UpdatePriceAppointmentTypeDTO,
  ) {
    const type = await this.appointmentTypeModel.findById(id).exec();

    if (!type) {
      throw new HttpException(
        'No appointment type found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedType = await new this.appointmentTypePriceModel({
      price: updatePriceAppointmentTypeDTO.price,
      activeFrom: updatePriceAppointmentTypeDTO.activeFrom,
      appointmentType: type,
    }).save();

    if (!updatedType) {
      throw new HttpException(
        'Could not update appointment type',
        HttpStatus.BAD_REQUEST,
      );
    }

    const appointmentTypePrice = await this.appointmentTypePriceModel
      .findOne({
        appointmentType: type._id,
        activeFrom: {
          $lte: new Date(),
        },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!appointmentTypePrice) {
      throw new HttpException(
        'No appointment type price found',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...type.toObject(),
      price: appointmentTypePrice.price,
    };
  }

  async updateName(id: string, name: string) {
    const type = await this.appointmentTypeModel.findById(id).exec();

    if (!type) {
      throw new HttpException(
        'No appointment type found',
        HttpStatus.BAD_REQUEST,
      );
    }

    type.name = name;
    await type.save();

    const appointmentTypePrice = await this.appointmentTypePriceModel
      .findOne({
        appointmentType: type._id,
        activeFrom: {
          $lte: new Date(),
        },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!appointmentTypePrice) {
      throw new HttpException(
        'No appointment type price found',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...type.toObject(),
      price: appointmentTypePrice.price,
    };
  }

  async findAllPrices(id: string) {
    const type = await this.appointmentTypeModel.findById(id).exec();

    if (!type) {
      throw new HttpException(
        'No appointment type found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const prices = await this.appointmentTypePriceModel
      .find({ appointmentType: type._id })
      .exec();

    if (!prices) {
      throw new HttpException(
        'No appointment type prices found',
        HttpStatus.BAD_REQUEST,
      );
    }

    return prices;
  }

  async getPrice(id: string, date: Date) {
    const type = await this.appointmentTypeModel.findById(id).exec();

    if (!type) {
      throw new HttpException(
        'No appointment type found',
        HttpStatus.BAD_REQUEST,
      );
    }

    let price = await this.appointmentTypePriceModel
      .findOne({
        appointmentType: type._id,
        activeFrom: {
          $lte: date,
        },
      })
      .sort({ activeFrom: -1 })
      .exec();

    if (!price) {
      price = await this.appointmentTypePriceModel
        .findOne({
          appointmentType: type._id,
        })
        .sort({
          activeFrom: 1,
        })
        .exec();

      if (!price) {
        throw new HttpException(
          'No appointment type price found',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return price.price;
  }
}
