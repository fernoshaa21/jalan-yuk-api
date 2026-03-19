import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BookingEntity,
  BookingStatus,
} from '../bookings/entities/booking.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity, PaymentStatus } from './entities/payment.entity';

const PAYMENT_METHODS = ['bank_transfer', 'gopay', 'ovo', 'cash'] as const;

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
  ) {}

  async createPayment(userId: number, dto: CreatePaymentDto) {
    this.validateBookingId(dto.bookingId);
    this.validatePaymentMethod(dto.method);

    const booking = await this.bookingsRepository.findOne({
      where: { id: dto.bookingId, user: { id: userId } },
      relations: ['activity', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot create payment for cancelled booking',
      );
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException('Booking is already confirmed');
    }

    const existingPayment = await this.paymentsRepository.findOne({
      where: { booking: { id: dto.bookingId } },
      relations: ['booking'],
    });

    if (
      existingPayment &&
      existingPayment.paymentStatus !== PaymentStatus.CANCELLED
    ) {
      throw new BadRequestException('Booking already has an active payment');
    }

    if (existingPayment) {
      existingPayment.method = dto.method;
      existingPayment.paymentStatus = PaymentStatus.PENDING;
      existingPayment.paidAt = null;
      existingPayment.externalRef = null;

      const refreshedPayment =
        await this.paymentsRepository.save(existingPayment);
      return this.toPaymentFlowResponse(
        refreshedPayment,
        booking.totalPrice,
        'Payment record created successfully',
      );
    }

    const payment = this.paymentsRepository.create({
      booking,
      method: dto.method,
      paymentStatus: PaymentStatus.PENDING,
      paidAt: null,
      externalRef: null,
    });

    const savedPayment = await this.paymentsRepository.save(payment);
    return this.toPaymentFlowResponse(
      savedPayment,
      booking.totalPrice,
      'Payment record created successfully',
    );
  }

  async payBooking(
    userId: number,
    bookingId: string,
    method: CreatePaymentDto['method'],
  ) {
    this.validateBookingId(bookingId);
    this.validatePaymentMethod(method);

    const result = await this.paymentsRepository.manager.transaction(
      async (manager) => {
        const bookingRepository = manager.getRepository(BookingEntity);
        const paymentRepository = manager.getRepository(PaymentEntity);

        const booking = await bookingRepository.findOne({
          where: { id: bookingId, user: { id: userId } },
          relations: ['activity', 'user'],
        });

        if (!booking) {
          throw new NotFoundException('Booking not found');
        }

        if (booking.status === BookingStatus.CANCELLED) {
          throw new BadRequestException('Booking has been cancelled');
        }

        let payment = await paymentRepository.findOne({
          where: { booking: { id: bookingId } },
          relations: ['booking'],
        });

        if (!payment) {
          payment = paymentRepository.create({
            booking,
            method,
            paymentStatus: PaymentStatus.PENDING,
            paidAt: null,
            externalRef: null,
          });
        }

        if (payment.paymentStatus === PaymentStatus.CANCELLED) {
          throw new BadRequestException('Payment already cancelled');
        }

        payment.method = method;
        payment.paymentStatus = PaymentStatus.PAID;
        payment.paidAt = new Date();

        const savedPayment = await paymentRepository.save(payment);

        booking.status = BookingStatus.CONFIRMED;
        const updatedBooking = await bookingRepository.save(booking);

        return this.toPaymentFlowResponse(
          savedPayment,
          updatedBooking.totalPrice,
          'Payment completed successfully',
        );
      },
    );

    return result;
  }

  async cancelPayment(userId: number, bookingId: string) {
    this.validateBookingId(bookingId);

    const result = await this.paymentsRepository.manager.transaction(
      async (manager) => {
        const bookingRepository = manager.getRepository(BookingEntity);
        const paymentRepository = manager.getRepository(PaymentEntity);

        const booking = await bookingRepository.findOne({
          where: { id: bookingId, user: { id: userId } },
        });

        if (!booking) {
          throw new NotFoundException('Booking not found');
        }

        const payment = await paymentRepository.findOne({
          where: { booking: { id: bookingId } },
          relations: ['booking'],
        });

        if (!payment) {
          throw new NotFoundException('Payment not found');
        }

        payment.paymentStatus = PaymentStatus.CANCELLED;
        payment.paidAt = null;
        const updatedPayment = await paymentRepository.save(payment);

        booking.status = BookingStatus.CANCELLED;
        const updatedBooking = await bookingRepository.save(booking);

        return this.toPaymentFlowResponse(
          updatedPayment,
          updatedBooking.totalPrice,
          'Payment cancelled successfully',
        );
      },
    );

    return result;
  }

  async getPaymentByBookingId(userId: number, bookingId: string) {
    this.validateBookingId(bookingId);

    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId, user: { id: userId } },
      select: ['id'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const payment = await this.paymentsRepository.findOne({
      where: { booking: { id: bookingId } },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toPaymentSummary(payment);
  }

  private validateBookingId(bookingId: string): void {
    if (!bookingId?.trim()) {
      throw new BadRequestException('Booking ID is required');
    }
  }

  private validatePaymentMethod(method: string): void {
    if (!PAYMENT_METHODS.includes(method as (typeof PAYMENT_METHODS)[number])) {
      throw new BadRequestException(
        `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`,
      );
    }
  }

  private toPaymentSummary(payment: PaymentEntity) {
    return {
      id: payment.id,
      bookingId: payment.bookingId ?? payment.booking?.id,
      method: payment.method,
      paymentStatus: payment.paymentStatus,
      paidAt: payment.paidAt,
      externalRef: payment.externalRef,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private toPaymentFlowResponse(
    payment: PaymentEntity,
    amount: string | number,
    message: string,
  ) {
    return {
      bookingId: payment.bookingId ?? payment.booking?.id,
      paymentId: payment.id,
      method: payment.method,
      paymentStatus: payment.paymentStatus,
      amount: this.toAmount(amount),
      paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
      message,
    };
  }

  private toAmount(value: string | number): number {
    const amount = typeof value === 'string' ? Number(value) : value;

    if (Number.isNaN(amount)) {
      throw new BadRequestException('Invalid booking amount');
    }

    return Number(amount);
  }
}
