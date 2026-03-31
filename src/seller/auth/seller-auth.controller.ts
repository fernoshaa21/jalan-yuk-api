import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { SellerLoginDto } from './dto/seller-login.dto';
import { SellerRegisterDto } from './dto/seller-register.dto';

@Controller('seller/auth')
export class SellerAuthController {
  private readonly logger = new Logger(SellerAuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: SellerRegisterDto) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn(
        `Incoming POST /seller/auth/register for email=${registerDto.email?.trim().toLowerCase() ?? '<empty>'}`,
      );
    }

    const result = await this.authService.registerSeller(registerDto);

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
  async login(@Body() loginDto: SellerLoginDto) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn(
        `Incoming POST /seller/auth/login for email=${loginDto.email?.trim().toLowerCase() ?? '<empty>'}`,
      );
    }

    const result = await this.authService.loginSeller(loginDto);

    return {
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
      message: result.message,
      meta: null,
    };
  }
}
