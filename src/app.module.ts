import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { AppointmentModule } from './appointment/appointment.module';
import { RolesAndPermissionModule } from './roles-and-permission/roles-and-permission.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    UserModule,
    AuthModule,
    CustomerModule,
    AppointmentModule,
    RolesAndPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
