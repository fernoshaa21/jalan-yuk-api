import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { SellerProfileService } from './profile.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: string;
  };
};

@Controller('seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class SellerProfileController {
  constructor(private readonly sellerProfileService: SellerProfileService) {}

  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const profile = await this.sellerProfileService.getProfile(req.user.sub);

    return {
      data: profile,
      message: 'Seller profile retrieved successfully',
      meta: null,
    };
  }

  @Patch('me')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    const profile = await this.sellerProfileService.updateProfile(
      req.user.sub,
      dto,
    );

    return {
      data: profile,
      message: 'Seller profile updated successfully',
      meta: null,
    };
  }
}
