import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentStatusDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(PaymentStatus, {
    message: 'status must be one of: pending, paid, cancelled',
  })
  status: PaymentStatus;
}
