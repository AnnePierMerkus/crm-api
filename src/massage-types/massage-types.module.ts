import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MassageTypeController } from './massage-types.controller';
import { MassageTypeSchema } from './schemas/massage-types.schema';
import { MassageTypeService } from './massage-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MassageType', schema: MassageTypeSchema }]),
  ],
  controllers: [MassageTypeController],
  providers: [MassageTypeService],
})
export class MassageTypeModule {}
