import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingEntity } from './entities/booking.entity';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../activities/entities/activities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, UserEntity, ActivitiesEntity]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
