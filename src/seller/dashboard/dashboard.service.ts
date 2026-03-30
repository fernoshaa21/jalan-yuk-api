import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import {
  BookingEntity,
  BookingStatus,
} from '../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../payments/entities/payment.entity';
import { GetSellerRecentBookingsDto } from './dto/get-seller-recent-bookings.dto';

@Injectable()
export class SellerDashboardService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
  ) {}

  async getStats(sellerId: number) {
    const [
      totalActivities,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenueRow,
    ] = await Promise.all([
      this.activitiesRepository.countBy({ sellerId }),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .innerJoin('booking.activity', 'activity')
        .where('activity.sellerId = :sellerId', { sellerId })
        .getCount(),
      this.countBookingsByStatus(sellerId, BookingStatus.PENDING),
      this.countBookingsByStatus(sellerId, BookingStatus.CONFIRMED),
      this.countBookingsByStatus(sellerId, BookingStatus.CANCELLED),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .innerJoin('booking.activity', 'activity')
        .select('COALESCE(SUM(booking.totalPrice), 0)', 'totalRevenue')
        .where('activity.sellerId = :sellerId', { sellerId })
        .andWhere('booking.status = :status', {
          status: BookingStatus.CONFIRMED,
        })
        .getRawOne<{ totalRevenue: string }>(),
    ]);

    return {
      totalActivities,
      totalBookings,
      totalRevenue: Number(revenueRow?.totalRevenue ?? 0),
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
    };
  }

  async getRecentBookings(
    sellerId: number,
    queryDto: GetSellerRecentBookingsDto = {},
  ) {
    const limit = queryDto.limit ?? 5;

    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('activity.sellerId = :sellerId', { sellerId })
      .orderBy('booking.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return bookings.map((booking) => ({
      id: booking.id,
      user: booking.user
        ? {
            id: booking.user.id,
            fullName: booking.user.fullName,
          }
        : null,
      activity: booking.activity
        ? {
            id: booking.activity.id,
            title: booking.activity.title,
          }
        : null,
      bookingDate: booking.bookingDate,
      bookingStatus: booking.status,
      paymentStatus: booking.payment?.paymentStatus ?? PaymentStatus.PENDING,
      totalPrice: Number(booking.totalPrice),
    }));
  }

  private countBookingsByStatus(sellerId: number, status: BookingStatus) {
    return this.bookingsRepository
      .createQueryBuilder('booking')
      .innerJoin('booking.activity', 'activity')
      .where('activity.sellerId = :sellerId', { sellerId })
      .andWhere('booking.status = :status', { status })
      .getCount();
  }
}
