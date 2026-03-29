import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class GetAdminUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }
    if (value === 'false' || value === false || value === 0 || value === '0') {
      return false;
    }
    return undefined;
  })
  isActive?: boolean;

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
}
