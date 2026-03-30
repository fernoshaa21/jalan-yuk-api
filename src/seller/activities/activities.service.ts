import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { resolveActivityImageUrl } from '../../common/constants/activity-image-map';
import { CreateSellerActivityDto } from './dto/create-seller-activity.dto';
import { SellerActivitiesQueryDto } from './dto/seller-activities-query.dto';
import { UpdateSellerActivityDto } from './dto/update-seller-activity.dto';

type SellerActivitiesPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

@Injectable()
export class SellerActivitiesService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private readonly activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async getActivities(
    sellerId: number,
    queryDto: SellerActivitiesQueryDto = {},
  ): Promise<{
    data: Array<{
      id: number;
      title: string;
      category: string;
      location: string;
      price: number;
      isActive: boolean;
    }>;
    meta: SellerActivitiesPaginationMeta;
  }> {
    const { page, limit } = this.normalizePagination(queryDto);
    const query = this.buildSellerActivitiesQuery(sellerId, queryDto);

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

  async getActivityById(sellerId: number, id: number) {
    const activity = await this.findOwnedActivityOrFail(sellerId, id);

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      price: Number(activity.price),
      availableSlots: activity.availableSlots,
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

  async createActivity(sellerId: number, dto: CreateSellerActivityDto) {
    const activity = this.activitiesRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      location: dto.location,
      price: dto.price,
      availableSlots: dto.availableSlots,
      currentParticipants: 0,
      imageUrl: dto.imageUrl ?? null,
      isFeatured: dto.isFeatured ?? false,
      rating: dto.rating ?? 0,
      isActive: dto.isActive ?? true,
      sellerId,
    });

    const savedActivity = await this.activitiesRepository.save(activity);
    return this.toSellerActivity(savedActivity);
  }

  async updateActivity(
    sellerId: number,
    id: number,
    dto: UpdateSellerActivityDto,
  ) {
    const activity = await this.findOwnedActivityOrFail(sellerId, id);

    if (dto.title !== undefined) activity.title = dto.title;
    if (dto.description !== undefined) activity.description = dto.description;
    if (dto.category !== undefined) activity.category = dto.category;
    if (dto.location !== undefined) activity.location = dto.location;
    if (dto.price !== undefined) activity.price = dto.price;
    if (dto.availableSlots !== undefined) {
      activity.availableSlots = dto.availableSlots;
    }
    if (dto.imageUrl !== undefined) activity.imageUrl = dto.imageUrl;
    if (dto.isFeatured !== undefined) activity.isFeatured = dto.isFeatured;
    if (dto.rating !== undefined) activity.rating = dto.rating;
    if (dto.isActive !== undefined) activity.isActive = dto.isActive;

    const updatedActivity = await this.activitiesRepository.save(activity);
    return this.toSellerActivity(updatedActivity);
  }

  async deleteActivity(sellerId: number, id: number) {
    const activity = await this.findOwnedActivityOrFail(sellerId, id);

    activity.isActive = false;
    const deletedActivity = await this.activitiesRepository.save(activity);

    return {
      id: deletedActivity.id,
      isActive: deletedActivity.isActive,
    };
  }

  private buildSellerActivitiesQuery(
    sellerId: number,
    queryDto: SellerActivitiesQueryDto,
  ): SelectQueryBuilder<ActivitiesEntity> {
    const query = this.activitiesRepository
      .createQueryBuilder('activity')
      .where('activity.sellerId = :sellerId', { sellerId });

    if (queryDto.search?.trim()) {
      query.andWhere(
        '(activity.name ILIKE :search OR activity.location ILIKE :search)',
        { search: `%${queryDto.search.trim()}%` },
      );
    }

    if (queryDto.category?.trim()) {
      query.andWhere('activity.category = :category', {
        category: queryDto.category.trim(),
      });
    }

    if (queryDto.isActive !== undefined) {
      query.andWhere('activity.isActive = :isActive', {
        isActive: queryDto.isActive,
      });
    }

    if (queryDto.isFeatured !== undefined) {
      query.andWhere('activity.isFeatured = :isFeatured', {
        isFeatured: queryDto.isFeatured,
      });
    }

    return query.orderBy('activity.createdAt', 'DESC');
  }

  private normalizePagination(queryDto: SellerActivitiesQueryDto): {
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

  private async findOwnedActivityOrFail(
    sellerId: number,
    id: number,
  ): Promise<ActivitiesEntity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id, sellerId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  private toSellerActivity(activity: ActivitiesEntity) {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      price: Number(activity.price),
      availableSlots: activity.availableSlots,
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
