import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { SellerActivitiesController } from './activities.controller';
import { SellerActivitiesService } from './activities.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity])],
  controllers: [SellerActivitiesController],
  providers: [SellerActivitiesService, RolesGuard],
})
export class SellerActivitiesModule {}
