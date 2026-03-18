import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

const PAYMENT_METHODS = ['bank_transfer', 'gopay', 'ovo', 'cash'] as const;

export class CreatePaymentDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsUUID()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  bookingId: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsIn(PAYMENT_METHODS, {
    message: `method must be one of: ${PAYMENT_METHODS.join(', ')}`,
  })
  method: (typeof PAYMENT_METHODS)[number];
}
