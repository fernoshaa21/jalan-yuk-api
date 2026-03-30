import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { SellerBookingsController } from './bookings.controller';
import { SellerBookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  controllers: [SellerBookingsController],
  providers: [SellerBookingsService, RolesGuard],
})
export class SellerBookingsModule {}
