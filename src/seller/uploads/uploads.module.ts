import { Module } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UploadsModule } from '../../admin/uploads/uploads.module';
import { SellerUploadsController } from './uploads.controller';

@Module({
  imports: [UploadsModule],
  controllers: [SellerUploadsController],
  providers: [RolesGuard],
})
export class SellerUploadsModule {}
