import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { GetRecentBookingsDto } from './dto/get-recent-bookings.dto';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('stats')
  async getStats() {
    const stats = await this.dashboardService.getStats();

    return {
      data: stats,
      message: 'Dashboard stats retrieved successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('recent-bookings')
  async getRecentBookings(@Query() query: GetRecentBookingsDto) {
    const bookings = await this.dashboardService.getRecentBookings(query);

    return {
      data: bookings,
      message: 'Recent bookings retrieved successfully',
      meta: null,
    };
  }
}
