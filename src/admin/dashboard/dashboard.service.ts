import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import {
  BookingEntity,
  BookingStatus,
} from '../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../payments/entities/payment.entity';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { GetRecentBookingsDto } from './dto/get-recent-bookings.dto';
import { RecentBookingDto } from './dto/recent-booking.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getStats(): Promise<DashboardStatsDto> {
    const [
      totalActivities,
      totalBookings,
      totalUsers,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenueRow,
    ] = await Promise.all([
      this.activitiesRepository.count(),
      this.bookingsRepository.count(),
      this.usersRepository.count(),
      this.bookingsRepository.countBy({ status: BookingStatus.PENDING }),
      this.bookingsRepository.countBy({ status: BookingStatus.CONFIRMED }),
      this.bookingsRepository.countBy({ status: BookingStatus.CANCELLED }),
      this.bookingsRepository
        .createQueryBuilder('booking')
        .select('COALESCE(SUM(booking.totalPrice), 0)', 'totalRevenue')
        .where('booking.status = :status', {
          status: BookingStatus.CONFIRMED,
        })
        .getRawOne<{ totalRevenue: string }>(),
    ]);

    return {
      totalActivities,
      totalBookings,
      totalUsers,
      totalRevenue: Number(revenueRow?.totalRevenue ?? 0),
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
    };
  }

  async getRecentBookings(
    queryDto: GetRecentBookingsDto = {},
  ): Promise<RecentBookingDto[]> {
    const limit = queryDto.limit ?? 5;

    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.activity', 'activity')
      .leftJoinAndSelect('booking.payment', 'payment')
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
}
