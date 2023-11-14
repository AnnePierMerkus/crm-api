import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserAddressSchema } from './schemas/user-address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserAddress', schema: UserAddressSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
