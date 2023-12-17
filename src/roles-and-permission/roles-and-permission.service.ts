import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesAndPermissionInterface } from './interfaces/roles-and-permission.interface';
import { CreateRoleDTO, UpdatedRoleDTO } from "./dto/roles-and-permission.dto";

@Injectable()
export class RolesAndPermissionService {
  constructor(
    @InjectModel('RolesAndPermission')
    private rolesAndPermissionModel: Model<RolesAndPermissionInterface>,
  ) {}

  async create(createRolesAndPermissionDTO: CreateRoleDTO) {
    const role = new this.rolesAndPermissionModel(createRolesAndPermissionDTO);
    return role.save();
  }

  async update(id: string, updateRoleDto: UpdatedRoleDTO) {
    const role = await this.rolesAndPermissionModel.findByIdAndUpdate(
      id,
      updateRoleDto,
    );

    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }

    return this.findById(id);
  }

  async findAll() {
    const roleData = await this.rolesAndPermissionModel.find().exec();
    if (!roleData || roleData.length == 0) {
      throw new NotFoundException('No roles not found!');
    }
    return roleData;
  }

  async findById(id: string) {
    const role = await this.rolesAndPermissionModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }

  async delete(id: string) {
    const role = await this.rolesAndPermissionModel.findByIdAndDelete(id);
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }
}

