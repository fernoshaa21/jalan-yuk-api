import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetMyBookingsDto } from './dto/get-my-bookings.dto';
import { BookingEntity, BookingStatus } from './entities/booking.entity';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../activities/entities/activities.entity';
import { PaymentStatus } from '../payments/entities/payment.entity';
import { resolveActivityImageUrl } from '../common/constants/activity-image-map';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async createBooking(userId: number, dto: CreateBookingDto) {
    this.validateUserId(userId);

    if (!Number.isInteger(dto.qty) || dto.qty < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activity = await this.activitiesRepository.findOne({
      where: { id: dto.activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (!activity.isActive) {
      throw new BadRequestException('Activity is not active');
    }

    const availableSlots =
      activity.maxParticipants - activity.currentParticipants;
    if (availableSlots < dto.qty) {
      throw new BadRequestException('Insufficient available slots');
    }

    const unitPrice = this.toNumeric(activity.price);
    const totalPrice = this.toNumeric(unitPrice * dto.qty);

    const booking = this.bookingsRepository.create({
      user,
      activity,
      bookingDate: new Date(dto.bookingDate),
      qty: dto.qty,
      unitPrice: unitPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    const bookingWithRelations = await this.bookingsRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['activity', 'user'],
    });

    if (!bookingWithRelations) {
      throw new NotFoundException('Booking not found after creation');
    }

    return this.toCreateBookingSummary(bookingWithRelations);
  }

  async getMyBookings(userId: number, queryDto: GetMyBookingsDto = {}) {
    this.validateUserId(userId);

    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;
    const normalizedStatus = queryDto.status?.trim().toLowerCase();
    const normalizedPaymentStatus = queryDto.paymentStatus
      ?.trim()
      .toLowerCase();

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    if (
      normalizedStatus &&
      !Object.values(BookingStatus).includes(normalizedStatus as BookingStatus)
    ) {
      throw new BadRequestException(
        'Invalid booking status. Allowed: pending, confirmed, cancelled',
      );
    }

    if (
      normalizedPaymentStatus &&
      !Object.values(PaymentStatus).includes(
        normalizedPaymentStatus as PaymentStatus,
      )
    ) {
      throw new BadRequestException(
        'Invalid payment status. Allowed: pending, paid, cancelled',
      );
    }

    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('booking.user_id = :userId', { userId });

    if (normalizedStatus) {
      query.andWhere('booking.status = :status', { status: normalizedStatus });
    }

    if (normalizedPaymentStatus) {
      query.andWhere('payment.paymentStatus = :paymentStatus', {
        paymentStatus: normalizedPaymentStatus,
      });
    }

    query.orderBy('booking.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [bookings, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings.map((booking) => ({
        id: booking.id,
        activity: booking.activity
          ? {
              id: booking.activity.id,
              title: booking.activity.name,
              imageUrl: resolveActivityImageUrl(
                booking.activity.imageUrl,
                booking.activity.category,
                booking.activity.id,
              ),
              location: booking.activity.location,
            }
          : null,
        bookingDate: booking.bookingDate,
        qty: booking.qty,
        totalPrice: Number(booking.totalPrice),
        bookingStatus: booking.status,
        paymentStatus: booking.payment?.paymentStatus ?? null,
        createdAt: booking.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getBookingById(userId: number, bookingId: string) {
    this.validateUserId(userId);

    if (!bookingId?.trim()) {
      throw new BadRequestException('Booking ID is required');
    }

    const booking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('booking.id = :bookingId', { bookingId })
      .andWhere('booking.user_id = :userId', { userId })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.toBookingDetail(booking);
  }

  async cancelBooking(userId: number, bookingId: string) {
    this.validateUserId(userId);

    if (!bookingId?.trim()) {
      throw new BadRequestException('Booking ID is required');
    }

    const result = await this.bookingsRepository.manager.transaction(
      async (manager) => {
        const bookingRepository = manager.getRepository(BookingEntity);

        const booking = await bookingRepository.findOne({
          where: {
            id: bookingId,
            user: { id: userId },
          },
          relations: ['payment'],
        });

        if (!booking) {
          throw new NotFoundException('Booking not found');
        }

        if (booking.status === BookingStatus.CANCELLED) {
          throw new BadRequestException('Booking is already cancelled');
        }

        if (
          booking.status === BookingStatus.CONFIRMED ||
          booking.payment?.paymentStatus === PaymentStatus.PAID
        ) {
          throw new BadRequestException('Booking is already completed');
        }

        booking.status = BookingStatus.CANCELLED;

        if (booking.payment) {
          booking.payment.paymentStatus = PaymentStatus.CANCELLED;
          booking.payment.paidAt = null;
        }

        const updatedBooking = await bookingRepository.save(booking);

        return {
          message: 'Booking cancelled successfully',
          bookingId: updatedBooking.id,
          bookingStatus: updatedBooking.status,
          paymentStatus: updatedBooking.payment?.paymentStatus ?? null,
        };
      },
    );

    return result;
  }

  private validateUserId(userId: number): void {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
  }

  private toNumeric(value: string | number): number {
    const numeric = typeof value === 'string' ? Number(value) : value;

    if (Number.isNaN(numeric)) {
      throw new BadRequestException('Invalid numeric value');
    }

    return Number(numeric.toFixed(2));
  }

  private toCreateBookingSummary(booking: BookingEntity) {
    return {
      id: booking.id,
      activity: booking.activity
        ? {
            id: booking.activity.id,
            title: booking.activity.name,
            imageUrl: resolveActivityImageUrl(
              booking.activity.imageUrl,
              booking.activity.category,
              booking.activity.id,
            ),
            location: booking.activity.location,
          }
        : null,
      bookingDate: booking.bookingDate,
      qty: booking.qty,
      unitPrice: Number(booking.unitPrice),
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      createdAt: booking.createdAt,
    };
  }

  private toBookingSummary(booking: BookingEntity) {
    return {
      id: booking.id,
      bookingDate: booking.bookingDate,
      qty: booking.qty,
      unitPrice: Number(booking.unitPrice),
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      activity: booking.activity
        ? {
            id: booking.activity.id,
            name: booking.activity.name,
            location: booking.activity.location,
            imageUrl: resolveActivityImageUrl(
              booking.activity.imageUrl,
              booking.activity.category,
              booking.activity.id,
            ),
            price: Number(booking.activity.price),
          }
        : null,
    };
  }

  private toBookingDetail(booking: BookingEntity) {
    return {
      id: booking.id,
      activity: booking.activity
        ? {
            id: booking.activity.id,
            title: booking.activity.name,
            imageUrl: resolveActivityImageUrl(
              booking.activity.imageUrl,
              booking.activity.category,
              booking.activity.id,
            ),
            location: booking.activity.location,
            price: Number(booking.activity.price),
          }
        : null,
      bookingDate: booking.bookingDate,
      qty: booking.qty,
      unitPrice: Number(booking.unitPrice),
      totalPrice: Number(booking.totalPrice),
      bookingStatus: booking.status,
      payment: booking.payment
        ? {
            id: booking.payment.id,
            method: booking.payment.method,
            paymentStatus: booking.payment.paymentStatus,
            paidAt: booking.payment.paidAt,
          }
        : null,
      createdAt: booking.createdAt,
    };
  }
}
