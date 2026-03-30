import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class UpdateSellerProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9\-+\s]*$/, {
    message: 'Phone number must contain only numbers, -, +, and spaces',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
    require_tld: false,
  })
  avatarUrl?: string;
}
