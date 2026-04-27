/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTPayloadType } from '../utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from '../utils/enums';
import { AuthProvider } from './auth.provider';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   * create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
  async register(registerDto: RegisterDto) {
    return this.authProvider.register(registerDto);
  }

  /**
   * Log in user
   * @param loginDto  data for log in to account
   * @returns JWT (access token)
   */

  async login(loginDto: LoginDto) {
    return this.authProvider.login(loginDto);
  }

  /**
   * Get current user (logged in user)
   * @param id id of the logged in user
   * @returns the user from the database
   */
  async getCurrentUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  /**
   * Get all users from the database
   * @returns collection of users
   */
  getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Update user
   * @param id  id of the logged in user
   * @param updateUserDto data for updating the user
   * @returns updated user from the database
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username } = updateUserDto;
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with Id ${id} not found`);

    user.username = username ?? user.username;

    if (password) {
      user.password = await this.authProvider.hashPassword(password);
    }

    return this.usersRepository.save(user);
  }

  /**
   * Delte User
   * @param userId id of the user
   * @param payload JWTPayload
   * @returns a success message
   */
  async delete(userId: number, payload: JWTPayloadType) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload?.id || payload.userType === UserType.ADMIN) {
      await this.usersRepository.remove(user);
      return { message: 'User has been deleted' };
    }
    throw new ForbiddenException('access denied, you are not allowed');
  }
  // /**
  //  * Hashing password
  //  * @param password plain text password
  //  * @returns hashed password
  //  */
  // private async hashPassword(password: string): Promise<string> {
  //   const salt = await bcrypt.genSalt(10);
  //   return bcrypt.hash(password, salt);
  // }

  /**
   * set profile image for user
   * @param userId id of the logged in user
   * @param newProfileImage profile image url
   * @returns the user with the new profile image
   */
  async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage === '') {
      user.profileImage = newProfileImage;
    } else {
      await this.removeProfileImage(userId);
      user.profileImage = newProfileImage;
    }
    return this.usersRepository.save(user);
  }

  /**
   * Remove Profile Image
   * @param userId id of the logged in user
   * @returns the user from the database
   */
  async removeProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage === '') {
      throw new BadRequestException('there is no profile image');
    }
    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profileImage}`,
    );
    unlinkSync(imagePath);
    user.profileImage = '';
    return this.usersRepository.save(user);
  }

  /**
   * Verfiy Email
   * @param userId id of the user from the link
   * @param verificationToken verification token from the link
   * @returns success message
   */
  async verifyEmail(userId: number, verificationToken: string) {
    const user = await this.getCurrentUser(userId);
    if (user.verificationToken === null)
      throw new NotFoundException('there is no verification token');
    if (user.verificationToken !== verificationToken)
      throw new BadRequestException('invalid link');
    user.isAccountVerified = true;
    user.verificationToken = null;

    await this.usersRepository.save(user);
    return {
      message: 'Your email has been verified, please log in to your account',
    };
  }

  /**
   * Sending reset password template
   * @param email email of the user
   * @returns a success message
   */
  sendResetPassword(email: string) {
    return this.authProvider.sendResetPasswordLink(email);
  }

  /**
   * Get reset password link
   * @param userId user id from the link
   * @param resetPasswordToken reset password token from the link
   * @returns a success message
   */
  getResetPassword(userId: number, resetPasswordToken: string) {
    return this.authProvider.getResetPasswordLink(userId, resetPasswordToken);
  }

  /**
   * Reset the password
   * @param dto data for reset the password
   * @returns a success message
   */
  resetPassword(dto: ResetPasswordDto) {
    return this.authProvider.resetPassword(dto);
  }
}
