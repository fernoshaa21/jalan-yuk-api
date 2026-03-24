import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { GetActivitiesDto } from './dto/get-activities.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  /**
   * Get all activities with optional filters and pagination
   * GET /activities
   * GET /activities?search=jeep&category=adventure&featured=true&page=1&limit=10
   */
  @Get()
  async getActivities(@Query() getActivitiesDto: GetActivitiesDto) {
    const result = await this.activitiesService.getActivities(getActivitiesDto);
    return {
      data: result.data,
      message: 'Activities retrieved successfully',
      meta: result.meta,
    };
  }

  /**
   * Get all featured activities
   * GET /activities/featured?page=1&limit=10
   */
  @Get('featured')
  @HttpCode(HttpStatus.OK)
  async getFeaturedActivities(@Query() getActivitiesDto: GetActivitiesDto) {
    const result =
      await this.activitiesService.getFeaturedActivities(getActivitiesDto);
    return {
      data: result.data,
      message: 'Featured activities retrieved successfully',
      meta: result.meta,
    };
  }

  /**
   * Get activity detail by ID
   * GET /activities/:id
   * @param id - Activity ID (numeric)
   * @returns Activity detail with available dates and slots
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getActivityById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.activitiesService.getActivityById(id);
    return {
      data,
      message: 'Activity retrieved successfully',
      meta: null,
    };
  }
}
