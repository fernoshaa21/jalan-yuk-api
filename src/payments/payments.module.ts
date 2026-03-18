import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentEntity } from './entities/payment.entity';
import { BookingEntity } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, BookingEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
