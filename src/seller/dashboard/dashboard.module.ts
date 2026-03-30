import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { SellerDashboardController } from './dashboard.controller';
import { SellerDashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity, BookingEntity])],
  controllers: [SellerDashboardController],
  providers: [SellerDashboardService, RolesGuard],
})
export class SellerDashboardModule {}
