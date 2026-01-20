import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UserRegisterDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userRegister(user: UserRegisterDto) {
    const hashPass = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.addNewUser({
      name: user.name,
      email: user.email,
      password: hashPass,
    });

    return this.generateToken({ sub: newUser.id, email: newUser.email });
  }

  async userLogin(user: UserLoginDto) {
    const existingUser = await this.userService.findByEmail(user.email);
    const isValidPassword = await bcrypt.compare(
      user.password,
      existingUser?.password || '',
    );

    if (!existingUser || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken({
      sub: existingUser.id,
      email: existingUser.email,
    });
  }

  private async generateToken(payload: JwtPayload) {
    const payloadData: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
    };
    return {
      accessToken: this.jwtService.sign(payloadData),
    };
  }
}
