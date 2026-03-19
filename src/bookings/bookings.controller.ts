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
  async createBooking(
    @Request() req: { user?: Record<string, unknown> },
    @Body() dto: CreateBookingDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const booking = await this.bookingsService.createBooking(userId, dto);
    return {
      data: booking,
      message: 'Booking created successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyBookings(
    @Request() req: { user?: Record<string, unknown> },
    @Query() query: GetMyBookingsDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const result = await this.bookingsService.getMyBookings(userId, query);
    return {
      data: result.data,
      message: 'My bookings retrieved successfully',
      meta: result.meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBookingById(
    @Request() req: { user?: Record<string, unknown> },
    @Param('id') id: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const booking = await this.bookingsService.getBookingById(userId, id);
    return {
      data: booking,
      message: 'Booking detail retrieved successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelBooking(
    @Request() req: { user?: Record<string, unknown> },
    @Param('id') id: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const result = await this.bookingsService.cancelBooking(userId, id);
    return {
      data: {
        bookingId: result.bookingId,
        bookingStatus: result.bookingStatus,
        paymentStatus: result.paymentStatus,
      },
      message: result.message,
      meta: null,
    };
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
