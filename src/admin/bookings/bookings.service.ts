import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  BookingEntity,
  BookingStatus,
} from '../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../payments/entities/payment.entity';
import { AdminBookingDetailDto } from './dto/admin-booking-detail.dto';
import { AdminBookingListItemDto } from './dto/admin-booking-list-item.dto';
import { GetAdminBookingsDto } from './dto/get-admin-bookings.dto';

type AdminBookingsPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

@Injectable()
export class AdminBookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
  ) {}

  async getBookings(
    queryDto: GetAdminBookingsDto = {},
  ): Promise<{
    data: AdminBookingListItemDto[];
    meta: AdminBookingsPaginationMeta;
  }> {
    const { page, limit } = this.normalizePagination(queryDto);
    const normalizedBookingStatus = queryDto.bookingStatus?.trim().toLowerCase();
    const normalizedPaymentStatus = queryDto.paymentStatus?.trim().toLowerCase();

    this.validateStatuses(normalizedBookingStatus, normalizedPaymentStatus);

    const query = this.buildAdminBookingsQuery(
      queryDto,
      normalizedBookingStatus as BookingStatus | undefined,
      normalizedPaymentStatus as PaymentStatus | undefined,
    );

    query.skip((page - 1) * limit).take(limit);

    const [bookings, total] = await query.getManyAndCount();
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: bookings.map((booking) => ({
        id: booking.id,
        user: booking.user
          ? {
              fullName: booking.user.fullName,
            }
          : null,
        activity: booking.activity
          ? {
              title: booking.activity.title,
            }
          : null,
        bookingStatus: booking.status,
        paymentStatus: booking.payment?.paymentStatus ?? PaymentStatus.PENDING,
        bookingDate: booking.bookingDate,
        totalPrice: Number(booking.totalPrice),
        createdAt: booking.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: totalPages > 0 && page < totalPages,
      },
    };
  }

  async getBookingById(id: string): Promise<AdminBookingDetailDto> {
    if (!id?.trim()) {
      throw new NotFoundException('Booking not found');
    }

    const booking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('booking.id = :id', { id })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return {
      id: booking.id,
      bookingStatus: booking.status,
      paymentStatus: booking.payment?.paymentStatus ?? PaymentStatus.PENDING,
    };
  }

  private buildAdminBookingsQuery(
    queryDto: GetAdminBookingsDto,
    bookingStatus?: BookingStatus,
    paymentStatus?: PaymentStatus,
  ): SelectQueryBuilder<BookingEntity> {
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment');

    if (queryDto.search?.trim()) {
      query.andWhere(
        '(user.fullName ILIKE :search OR activity.name ILIKE :search)',
        {
          search: `%${queryDto.search.trim()}%`,
        },
      );
    }

    if (bookingStatus) {
      query.andWhere('booking.status = :bookingStatus', { bookingStatus });
    }

    if (paymentStatus) {
      if (paymentStatus === PaymentStatus.PENDING) {
        query.andWhere(
          '(payment.paymentStatus = :paymentStatus OR payment.id IS NULL)',
          { paymentStatus },
        );
      } else {
        query.andWhere('payment.paymentStatus = :paymentStatus', {
          paymentStatus,
        });
      }
    }

    return query.orderBy('booking.createdAt', 'DESC');
  }

  private normalizePagination(queryDto: GetAdminBookingsDto): {
    page: number;
    limit: number;
  } {
    const rawPage = queryDto.page ?? 1;
    const rawLimit = queryDto.limit ?? 10;

    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const limit = Number.isFinite(rawLimit)
      ? Math.min(100, Math.max(1, rawLimit))
      : 10;

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return { page, limit };
  }

  private validateStatuses(
    bookingStatus?: string,
    paymentStatus?: string,
  ): void {
    if (
      bookingStatus &&
      !Object.values(BookingStatus).includes(bookingStatus as BookingStatus)
    ) {
      throw new BadRequestException(
        'Invalid booking status. Allowed: pending, confirmed, cancelled',
      );
    }

    if (
      paymentStatus &&
      !Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
    ) {
      throw new BadRequestException(
        'Invalid payment status. Allowed: pending, paid, cancelled',
      );
    }
  }
}
