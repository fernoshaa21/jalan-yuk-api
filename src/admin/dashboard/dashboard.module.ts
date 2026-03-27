import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivitiesEntity, BookingEntity, UserEntity]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, RolesGuard],
})
export class DashboardModule {}
