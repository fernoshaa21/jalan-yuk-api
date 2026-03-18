import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ActivitiesAdminService } from '../activities-admin/activities-admin.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('admin/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesAdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  createActivity(@Body() dto: CreateActivityDto) {
    return this.activitiesService.createActivity(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.updateActivity(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.deleteActivity(id);
  }
}
