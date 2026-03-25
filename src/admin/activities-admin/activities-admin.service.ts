import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { CreateActivityAdminDto } from './dto/create-activity-admin.dto';
import { UpdateActivityDto } from './dto/update-activity-admin.dto';
import { resolveActivityImageUrl } from '../../common/constants/activity-image-map';

@Injectable()
export class ActivitiesAdminService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async createActivity(dto: CreateActivityAdminDto) {
    const activity = this.activitiesRepository.create({
      name: dto.title,
      description: dto.description,
      category: dto.category,
      location: dto.location,
      price: dto.price,
      maxParticipants: dto.availableSlots,
      imageUrl: resolveActivityImageUrl(dto.imageUrl, dto.category, 0),
      isFeatured: dto.isFeatured ?? false,
      rating: dto.rating ?? 0,
      isActive: dto.isActive ?? true,
      currentParticipants: 0,
    });

    const savedActivity = await this.activitiesRepository.save(activity);
    return this.toAdminActivity(savedActivity);
  }

  async updateActivity(id: number, dto: UpdateActivityDto) {
    const activity = await this.activitiesRepository.findOne({ where: { id } });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    if (dto.title !== undefined) activity.name = dto.title;
    if (dto.description !== undefined) activity.description = dto.description;
    if (dto.category !== undefined) activity.category = dto.category;
    if (dto.location !== undefined) activity.location = dto.location;
    if (dto.price !== undefined) activity.price = dto.price;
    if (dto.availableSlots !== undefined) {
      activity.maxParticipants = dto.availableSlots;
    }
    if (dto.imageUrl !== undefined) {
      activity.imageUrl = resolveActivityImageUrl(
        dto.imageUrl,
        activity.category,
        activity.id,
      );
    }
    if (dto.isFeatured !== undefined) activity.isFeatured = dto.isFeatured;
    if (dto.rating !== undefined) activity.rating = dto.rating;
    if (dto.isActive !== undefined) activity.isActive = dto.isActive;

    const updatedActivity = await this.activitiesRepository.save(activity);
    return this.toAdminActivity(updatedActivity);
  }

  async deleteActivity(id: number) {
    const activity = await this.activitiesRepository.findOne({ where: { id } });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    activity.isActive = false;
    await this.activitiesRepository.save(activity);

    return {
      message: 'Activity deleted successfully',
      id: activity.id,
      isActive: activity.isActive,
    };
  }

  private toAdminActivity(activity: ActivitiesEntity) {
    return {
      id: activity.id,
      title: activity.name,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      price: Number(activity.price),
      availableSlots: activity.maxParticipants,
      imageUrl: resolveActivityImageUrl(
        activity.imageUrl,
        activity.category,
        activity.id,
      ),
      isFeatured: activity.isFeatured,
      rating: Number(activity.rating),
      isActive: activity.isActive,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }
}
