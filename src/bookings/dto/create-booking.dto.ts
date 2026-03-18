import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  activityId: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsDateString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  bookingDate: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1)
  qty: number;
}
