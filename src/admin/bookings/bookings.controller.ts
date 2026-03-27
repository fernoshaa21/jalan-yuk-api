import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { AdminBookingsService } from './bookings.service';
import { GetAdminBookingsDto } from './dto/get-admin-bookings.dto';

@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(private readonly bookingsService: AdminBookingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getBookings(@Query() query: GetAdminBookingsDto) {
    const result = await this.bookingsService.getBookings(query);

    return {
      data: result.data,
      message: 'Admin bookings retrieved successfully',
      meta: result.meta,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    const booking = await this.bookingsService.getBookingById(id);

    return {
      data: booking,
      message: 'Admin booking detail retrieved successfully',
      meta: null,
    };
  }
}
