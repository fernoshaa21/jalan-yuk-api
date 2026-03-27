import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import {
  BookingEntity,
  BookingStatus,
} from '../../bookings/entities/booking.entity';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

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
}
