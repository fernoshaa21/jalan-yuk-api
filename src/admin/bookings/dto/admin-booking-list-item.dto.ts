import { BookingStatus } from '../../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../../payments/entities/payment.entity';

class AdminBookingUserDto {
  fullName: string;
}

class AdminBookingActivityDto {
  title: string;
}

export class AdminBookingListItemDto {
  id: string;
  user: AdminBookingUserDto | null;
  activity: AdminBookingActivityDto | null;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingDate: Date;
  totalPrice: number;
  createdAt: Date;
}
