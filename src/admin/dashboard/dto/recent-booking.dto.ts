import { BookingStatus } from '../../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../../payments/entities/payment.entity';

class RecentBookingUserDto {
  id: number;
  fullName: string;
}

class RecentBookingActivityDto {
  id: number;
  title: string;
}

export class RecentBookingDto {
  id: string;
  user: RecentBookingUserDto | null;
  activity: RecentBookingActivityDto | null;
  bookingDate: Date;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
}
