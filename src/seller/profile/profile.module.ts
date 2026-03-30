import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { SellerProfileController } from './profile.controller';
import { SellerProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [SellerProfileController],
  providers: [SellerProfileService, RolesGuard],
})
export class SellerProfileModule {}
