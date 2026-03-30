import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { SellerBookingsQueryDto } from './dto/seller-bookings-query.dto';
import { SellerBookingsService } from './bookings.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: string;
  };
};

@Controller('seller/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class SellerBookingsController {
  constructor(private readonly sellerBookingsService: SellerBookingsService) {}

  @Get()
  async getBookings(
    @Req() req: AuthenticatedRequest,
    @Query() query: SellerBookingsQueryDto,
  ) {
    const result = await this.sellerBookingsService.getBookings(
      req.user.sub,
      query,
    );

    return {
      data: result.data,
      message: 'Seller bookings retrieved successfully',
      meta: result.meta,
    };
  }

  @Get(':id')
  async getBookingById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const booking = await this.sellerBookingsService.getBookingById(
      req.user.sub,
      id,
    );

    return {
      data: booking,
      message: 'Seller booking detail retrieved successfully',
      meta: null,
    };
  }
}
