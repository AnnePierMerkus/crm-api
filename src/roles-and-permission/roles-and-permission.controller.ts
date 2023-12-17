import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RolesAndPermissionService } from './roles-and-permission.service';
import { CreateRoleDTO, RolesAndPermissionResponseDto, UpdatedRoleDTO } from "./dto/roles-and-permission.dto";

@Controller('roles')
export class RolesAndPermissionController {
  constructor(private rolesAndPermissionService: RolesAndPermissionService) {}

  @Post('/create')
  async create(
    @Body() createRolesAndPermissionDto: CreateRoleDTO,
  ): Promise<RolesAndPermissionResponseDto> {
    const role = await this.rolesAndPermissionService.create(
      createRolesAndPermissionDto,
    );
    return { success: true, rolesAndPermission: role };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedRoleDTO: UpdatedRoleDTO,
  ): Promise<RolesAndPermissionResponseDto> {
    const role = await this.rolesAndPermissionService.update(
      id,
      updatedRoleDTO,
    );
    return { success: true, rolesAndPermission: role };
  }

  @Get()
  async findAll() {
    return this.rolesAndPermissionService.findAll();
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<RolesAndPermissionResponseDto> {
    return {
      success: true,
      rolesAndPermission: await this.rolesAndPermissionService.delete(id),
    };
  }
}
