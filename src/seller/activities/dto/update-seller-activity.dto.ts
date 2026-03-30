import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ACTIVITY_CATEGORIES } from '../../../common/constants/activity-categories';

export class UpdateSellerActivityDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsString()
  @IsIn(ACTIVITY_CATEGORIES)
  category?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null) {
      return undefined;
    }

    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null) {
      return undefined;
    }

    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  @Min(0)
  availableSlots?: number;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsString()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
    require_tld: false,
  })
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null) {
      return undefined;
    }

    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }

    if (value === 'false' || value === false || value === 0 || value === '0') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null) {
      return undefined;
    }

    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null) {
      return undefined;
    }

    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }

    if (value === 'false' || value === false || value === 0 || value === '0') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
