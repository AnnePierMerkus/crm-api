import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesAndPermissionSchema } from './schemas/roles-and-permission.schema';
import { RolesAndPermissionService } from './roles-and-permission.service';
import { RolesAndPermissionController } from './roles-and-permission.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RolesAndPermission', schema: RolesAndPermissionSchema },
    ]),
  ],
  controllers: [RolesAndPermissionController],
  providers: [RolesAndPermissionService],
})
export class RolesAndPermissionModule {}
