import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesAdminController } from './activities-admin.controller';
import { ActivitiesAdminService } from './activities-admin.service';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { ActivitiesController } from '../activities/activities.controller';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity])],
  controllers: [ActivitiesAdminController, ActivitiesController],
  providers: [ActivitiesAdminService, RolesGuard],
  exports: [ActivitiesAdminService],
})
export class ActivitiesAdminModule {}
