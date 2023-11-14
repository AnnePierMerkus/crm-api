import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { Payload } from 'src/types/payload';
import { UserDto } from './dto/user.dto';
import { UserAddressInterface } from './interfaces/user-address.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserInterface>,
    @InjectModel('UserAddress')
    private userAddressModel: Model<UserAddressInterface>,
  ) {}

  async newCreate(createUserDto: UserDto) {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const address = new this.userAddressModel(createUserDto.address);
    await address.save();

    const newUser = new this.userModel(createUserDto);
    newUser.address = address._id;
    await newUser.save();
    return {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      address: address,
    };
  }

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(RegisterDTO);

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  sanitizeUser(user: UserInterface) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findAll() {
    const users = await this.userModel.find().exec();

    if (!users) {
      throw new HttpException('No users found', HttpStatus.BAD_REQUEST);
    }

    const userData: UserDto[] = await Promise.all(
      users.map(async (user) => {
        const address = await this.userAddressModel
          .findById(user.address)
          .exec();
        return {
          ...this.sanitizeUser(user),
          address: address,
        };
      }),
    );

    return userData;
  }
}
