import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Post(':bookingId/pay')
  payBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: { method?: CreatePaymentDto['method'] },
  ) {
    if (!body?.method) {
      throw new BadRequestException('Payment method is required');
    }

    return this.paymentsService.payBooking(bookingId, body.method);
  }

  @Patch(':bookingId/cancel')
  cancelPayment(@Param('bookingId') bookingId: string) {
    return this.paymentsService.cancelPayment(bookingId);
  }

  @Get(':bookingId')
  getPaymentByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentByBookingId(bookingId);
  }
}
