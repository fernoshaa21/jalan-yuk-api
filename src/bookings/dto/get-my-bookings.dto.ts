import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class GetMyBookingsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }: { value: unknown }) => {
    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? 1 : num;
  })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }: { value: unknown }) => {
    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? 10 : num;
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
