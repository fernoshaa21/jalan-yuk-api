import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { AdminUsersController } from './users.controller';
import { AdminUsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, RolesGuard],
})
export class AdminUsersModule {}
