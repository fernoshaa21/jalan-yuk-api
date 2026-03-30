import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { CreateSellerActivityDto } from './dto/create-seller-activity.dto';
import { SellerActivitiesQueryDto } from './dto/seller-activities-query.dto';
import { UpdateSellerActivityDto } from './dto/update-seller-activity.dto';
import { SellerActivitiesService } from './activities.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: string;
  };
};

@Controller('seller/activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class SellerActivitiesController {
  constructor(
    private readonly sellerActivitiesService: SellerActivitiesService,
  ) {}

  @Get()
  async getActivities(
    @Req() req: AuthenticatedRequest,
    @Query() query: SellerActivitiesQueryDto,
  ) {
    const result = await this.sellerActivitiesService.getActivities(
      req.user.sub,
      query,
    );

    return {
      data: result.data,
      message: 'Seller activities retrieved successfully',
      meta: result.meta,
    };
  }

  @Get(':id')
  async getActivityById(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const activity = await this.sellerActivitiesService.getActivityById(
      req.user.sub,
      id,
    );

    return {
      data: activity,
      message: 'Seller activity detail retrieved successfully',
      meta: null,
    };
  }

  @Post()
  async createActivity(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSellerActivityDto,
  ) {
    const activity = await this.sellerActivitiesService.createActivity(
      req.user.sub,
      dto,
    );

    return {
      data: activity,
      message: 'Seller activity created successfully',
      meta: null,
    };
  }

  @Patch(':id')
  async updateActivity(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSellerActivityDto,
  ) {
    const activity = await this.sellerActivitiesService.updateActivity(
      req.user.sub,
      id,
      dto,
    );

    return {
      data: activity,
      message: 'Seller activity updated successfully',
      meta: null,
    };
  }

  @Delete(':id')
  async deleteActivity(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.sellerActivitiesService.deleteActivity(
      req.user.sub,
      id,
    );

    return {
      data: result,
      message: 'Seller activity deleted successfully',
      meta: null,
    };
  }
}
