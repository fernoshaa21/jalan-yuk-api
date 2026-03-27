import { BookingStatus } from '../../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../../payments/entities/payment.entity';

export class AdminBookingDetailDto {
  id: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
}
