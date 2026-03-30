import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { CreateActivityAdminDto } from './dto/create-activity-admin.dto';
import { UpdateActivityDto } from './dto/update-activity-admin.dto';
import { resolveActivityImageUrl } from '../../common/constants/activity-image-map';
import { GetAdminActivitiesDto } from '../activities/dto/get-admin-activities.dto';
import { AdminActivityDetailDto } from '../activities/dto/admin-activity-detail.dto';
import { AdminActivityListItemDto } from '../activities/dto/admin-activity-list-item.dto';

type AdminActivitiesPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

@Injectable()
export class ActivitiesAdminService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async createActivity(dto: CreateActivityAdminDto) {
    const activity = this.activitiesRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      location: dto.location,
      price: dto.price,
      availableSlots: dto.availableSlots,
      imageUrl: resolveActivityImageUrl(dto.imageUrl, dto.category, 0),
      isFeatured: dto.isFeatured ?? false,
      rating: dto.rating ?? 0,
      isActive: dto.isActive ?? true,
      currentParticipants: 0,
    });

    const savedActivity = await this.activitiesRepository.save(activity);
    return this.toAdminActivity(savedActivity);
  }

  async getActivities(
    queryDto: GetAdminActivitiesDto = {},
  ): Promise<{
    data: AdminActivityListItemDto[];
    meta: AdminActivitiesPaginationMeta;
  }> {
    const { page, limit } = this.normalizePagination(queryDto);
    const query = this.buildAdminActivitiesQuery(queryDto);

    query.skip((page - 1) * limit).take(limit);

    const [activities, total] = await query.getManyAndCount();
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        category: activity.category,
        location: activity.location,
        price: Number(activity.price),
        isActive: activity.isActive,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: totalPages > 0 && page < totalPages,
      },
    };
  }

  async getActivityById(id: number): Promise<AdminActivityDetailDto> {
    const activity = await this.activitiesRepository.findOne({ where: { id } });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      price: Number(activity.price),
    };
  }

  async updateActivity(id: number, dto: UpdateActivityDto) {
    const activity = await this.activitiesRepository.findOne({ where: { id } });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    if (dto.title !== undefined) activity.title = dto.title;
    if (dto.description !== undefined) activity.description = dto.description;
    if (dto.category !== undefined) activity.category = dto.category;
    if (dto.location !== undefined) activity.location = dto.location;
    if (dto.price !== undefined) activity.price = dto.price;
    if (dto.availableSlots !== undefined) {
      activity.availableSlots = dto.availableSlots;
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

  private buildAdminActivitiesQuery(
    queryDto: GetAdminActivitiesDto,
  ): SelectQueryBuilder<ActivitiesEntity> {
    const query = this.activitiesRepository.createQueryBuilder('activity');
    const { search, category, isActive, isFeatured } = queryDto;

    if (search?.trim()) {
      query.andWhere(
        '(activity.name ILIKE :search OR activity.location ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    if (category?.trim()) {
      query.andWhere('activity.category = :category', {
        category: category.trim(),
      });
    }

    if (isActive !== undefined) {
      query.andWhere('activity.isActive = :isActive', { isActive });
    }

    if (isFeatured !== undefined) {
      query.andWhere('activity.isFeatured = :isFeatured', { isFeatured });
    }

    return query.orderBy('activity.createdAt', 'DESC');
  }

  private normalizePagination(queryDto: GetAdminActivitiesDto): {
    page: number;
    limit: number;
  } {
    const rawPage = queryDto.page ?? 1;
    const rawLimit = queryDto.limit ?? 10;

    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const limit = Number.isFinite(rawLimit)
      ? Math.min(100, Math.max(1, rawLimit))
      : 10;

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return { page, limit };
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
