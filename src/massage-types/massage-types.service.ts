// massage-type.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MassageType } from './interfaces/massage-types.interface';
import { CreateMassageTypeDto, UpdateMassageTypeDto } from './dto/massage-types.dto';

@Injectable()
export class MassageTypeService {
  constructor(
    @InjectModel('MassageType') private readonly massageTypeModel: Model<MassageType>,
  ) {}

  async create(createMassageTypeDto: CreateMassageTypeDto): Promise<MassageType> {
    const createdMassageType = new this.massageTypeModel(createMassageTypeDto);
    return await createdMassageType.save();
  }

  async findAll(): Promise<MassageType[]> {
    return await this.massageTypeModel.find().exec();
  }

  async update(id: string, updateMassageTypeDto: UpdateMassageTypeDto): Promise<MassageType> {
    return await this.massageTypeModel.findByIdAndUpdate(id, updateMassageTypeDto, { new: true });
  }

  // Implement other CRUD methods as needed
}
