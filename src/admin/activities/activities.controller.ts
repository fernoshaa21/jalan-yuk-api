import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ActivitiesAdminService } from '../activities-admin/activities-admin.service';
import { GetAdminActivitiesDto } from './dto/get-admin-activities.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('admin/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesAdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getActivities(@Query() query: GetAdminActivitiesDto) {
    const result = await this.activitiesService.getActivities(query);

    return {
      data: result.data,
      message: 'Admin activities retrieved successfully',
      meta: result.meta,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getActivityById(@Param('id', ParseIntPipe) id: number) {
    const activity = await this.activitiesService.getActivityById(id);

    return {
      data: activity,
      message: 'Admin activity detail retrieved successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createActivity(@Body() dto: CreateActivityDto) {
    const activity = await this.activitiesService.createActivity(dto);
    return {
      data: activity,
      message: 'Activity created successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ) {
    const activity = await this.activitiesService.updateActivity(id, dto);
    return {
      data: activity,
      message: 'Activity updated successfully',
      meta: null,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteActivity(@Param('id', ParseIntPipe) id: number) {
    const result = await this.activitiesService.deleteActivity(id);
    return {
      data: {
        id: result.id,
        isActive: result.isActive,
      },
      message: result.message,
      meta: null,
    };
  }
}
