import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { GetSellerRecentBookingsDto } from './dto/get-seller-recent-bookings.dto';
import { SellerDashboardService } from './dashboard.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: string;
  };
};

@Controller('seller/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class SellerDashboardController {
  constructor(
    private readonly sellerDashboardService: SellerDashboardService,
  ) {}

  @Get('stats')
  async getStats(@Req() req: AuthenticatedRequest) {
    const stats = await this.sellerDashboardService.getStats(req.user.sub);

    return {
      data: stats,
      message: 'Seller dashboard stats retrieved successfully',
      meta: null,
    };
  }

  @Get('recent-bookings')
  async getRecentBookings(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetSellerRecentBookingsDto,
  ) {
    const bookings = await this.sellerDashboardService.getRecentBookings(
      req.user.sub,
      query,
    );

    return {
      data: bookings,
      message: 'Seller recent bookings retrieved successfully',
      meta: null,
    };
  }
}
