import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
      message: result.message,
      meta: null,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
      message: result.message,
      meta: null,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.sub as number;
    const profile = await this.authService.validateUser(userId);
    return {
      data: profile,
      message: 'Profile retrieved successfully',
      meta: null,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return {
      data: null,
      message: 'Logout successful',
      meta: null,
    };
  }
}
