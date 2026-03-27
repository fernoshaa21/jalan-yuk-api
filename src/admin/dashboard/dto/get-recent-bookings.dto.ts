import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class GetRecentBookingsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }: { value: unknown }) => {
    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? 5 : num;
  })
  limit?: number = 5;
}
