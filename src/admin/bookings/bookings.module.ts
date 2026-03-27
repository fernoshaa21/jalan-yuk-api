import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { AdminBookingsController } from './bookings.controller';
import { AdminBookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  controllers: [AdminBookingsController],
  providers: [AdminBookingsService, RolesGuard],
})
export class AdminBookingsModule {}
