import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { Payload } from '../types/payload';
import { InjectModel } from '@nestjs/mongoose';
import { ForgottenPassword } from './interfaces/forgottenpassword.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectModel('ForgottenPassword')
    private readonly forgottenPasswordModel: Model<ForgottenPassword>,
  ) {}

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }
  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async createForgottenPasswordToken(email: string) {
    const forgottenPassword = await this.forgottenPasswordModel.findOne({
      email,
    });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'Token already sent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const forgottenPasswordModel =
        await this.forgottenPasswordModel.findOneAndUpdate(
          { email: email },
          {
            email: email,
            newPasswordToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(), //Generate 7 digits number,
            timestamp: new Date(),
          },
          { upsert: true, new: true },
        );
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        throw new HttpException(
          'Error sending token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByPayload({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const createForgottenPasswordToken =
      await this.createForgottenPasswordToken(email);

    if (
      createForgottenPasswordToken &&
      createForgottenPasswordToken.newPasswordToken
    ) {
      // todo send mail

      return createForgottenPasswordToken;
    } else {
      throw new HttpException(
        'Error sending token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createForgottenPasswordToken;
  }

  async getForgottenPasswordModel(
    newPasswordToken: string,
  ): Promise<ForgottenPassword> {
    return await this.forgottenPasswordModel.findOne({
      newPasswordToken: newPasswordToken,
    });
  }

  async deleteForgottenPasswordModel(
    email: string,
  ): Promise<ForgottenPassword> {
    return await this.forgottenPasswordModel.findOneAndRemove({
      email: email,
    });
  }
}
