import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetMyBookingsDto } from './dto/get-my-bookings.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(
    @Request() req: { user?: Record<string, unknown> },
    @Body() dto: CreateBookingDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.bookingsService.createBooking(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyBookings(
    @Request() req: { user?: Record<string, unknown> },
    @Query() query: GetMyBookingsDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.bookingsService.getMyBookings(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBookingById(
    @Request() req: { user?: Record<string, unknown> },
    @Param('id') id: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.bookingsService.getBookingById(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelBooking(
    @Request() req: { user?: Record<string, unknown> },
    @Param('id') id: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.bookingsService.cancelBooking(userId, id);
  }

  private getUserIdFromRequest(req: {
    user?: Record<string, unknown>;
  }): number {
    const rawUserId = req.user?.sub ?? req.user?.id ?? req.user?.userId;

    if (
      typeof rawUserId !== 'number' ||
      !Number.isInteger(rawUserId) ||
      rawUserId <= 0
    ) {
      throw new ForbiddenException('Invalid authenticated user context');
    }

    return rawUserId;
  }
}
