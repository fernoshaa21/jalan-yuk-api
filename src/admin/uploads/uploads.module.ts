import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { FILE_STORAGE_SERVICE } from './constants/storage.tokens';
import { S3StorageService } from './storage/s3-storage.service';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    RolesGuard,
    S3StorageService,
    {
      provide: FILE_STORAGE_SERVICE,
      useExisting: S3StorageService,
    },
  ],
})
export class UploadsModule {}
