import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from '../users/dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  // Define your authentication endpoints here
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: UserRegisterDto) {
    return this.authService.userRegister(userDto);
  }

  @Post('login')
  login(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }
}
