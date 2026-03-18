import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { GetActivitiesDto } from './dto/get-activities.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

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
      statusCode: HttpStatus.OK,
      message: 'Activities retrieved successfully',
      ...result,
    };
  }

  /**
   * Get all featured activities
   * GET /activities/featured
   */
  @Get('featured')
  @HttpCode(HttpStatus.OK)
  async getFeaturedActivities() {
    const result = await this.activitiesService.getFeaturedActivities();
    return {
      statusCode: HttpStatus.OK,
      message: 'Featured activities retrieved successfully',
      ...result,
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
      statusCode: HttpStatus.OK,
      message: 'Activity retrieved successfully',
      data,
    };
  }

  /**
   * Create new activity
   * POST /activities
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createActivity(@Body() createActivityDto: CreateActivityDto) {
    const result =
      await this.activitiesService.createActivity(createActivityDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: result.message,
      data: result.data,
    };
  }
}
