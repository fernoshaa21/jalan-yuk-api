import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { SellerAuthController } from './seller-auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [SellerAuthController],
})
export class SellerAuthModule {}
