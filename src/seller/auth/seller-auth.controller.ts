import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { SellerLoginDto } from './dto/seller-login.dto';
import { SellerRegisterDto } from './dto/seller-register.dto';

@Controller('seller/auth')
export class SellerAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: SellerRegisterDto) {
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
