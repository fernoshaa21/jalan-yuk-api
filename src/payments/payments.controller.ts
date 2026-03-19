import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(
    @Request() req: { user?: Record<string, unknown> },
    @Body() dto: CreatePaymentDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const result = await this.paymentsService.createPayment(userId, dto);
    return {
      data: {
        bookingId: result.bookingId,
        paymentId: result.paymentId,
        method: result.method,
        paymentStatus: result.paymentStatus,
        amount: result.amount,
        paidAt: result.paidAt,
      },
      message: result.message,
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':bookingId/pay')
  async payBooking(
    @Request() req: { user?: Record<string, unknown> },
    @Param('bookingId') bookingId: string,
    @Body() body: { method?: CreatePaymentDto['method'] },
  ) {
    if (!body?.method) {
      throw new BadRequestException('Payment method is required');
    }

    const userId = this.getUserIdFromRequest(req);
    const result = await this.paymentsService.payBooking(
      userId,
      bookingId,
      body.method,
    );
    return {
      data: {
        bookingId: result.bookingId,
        paymentId: result.paymentId,
        method: result.method,
        paymentStatus: result.paymentStatus,
        amount: result.amount,
        paidAt: result.paidAt,
      },
      message: result.message,
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':bookingId/cancel')
  async cancelPayment(
    @Request() req: { user?: Record<string, unknown> },
    @Param('bookingId') bookingId: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const result = await this.paymentsService.cancelPayment(userId, bookingId);
    return {
      data: {
        bookingId: result.bookingId,
        paymentId: result.paymentId,
        method: result.method,
        paymentStatus: result.paymentStatus,
        amount: result.amount,
        paidAt: result.paidAt,
      },
      message: result.message,
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bookingId')
  async getPaymentByBookingId(
    @Request() req: { user?: Record<string, unknown> },
    @Param('bookingId') bookingId: string,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const payment = await this.paymentsService.getPaymentByBookingId(
      userId,
      bookingId,
    );
    return {
      data: payment,
      message: 'Payment retrieved successfully',
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
