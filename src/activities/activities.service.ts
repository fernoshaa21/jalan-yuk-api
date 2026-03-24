import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ActivitiesEntity } from './entities/activities.entity';
import { GetActivitiesDto } from './dto/get-activities.dto';
import { ActivityDetailDto } from './dto/activity-detail.dto';

type ActivitiesPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async getActivities(getActivitiesDto: GetActivitiesDto) {
    return this.getPaginatedActivities(getActivitiesDto);
  }

  async getFeaturedActivities(getActivitiesDto: GetActivitiesDto = {}) {
    return this.getPaginatedActivities({
      ...getActivitiesDto,
      featured: true,
    });
  }

  async getActivityById(id: number) {
    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid activity ID');
    }

    const activity = await this.activitiesRepository.findOne({
      where: { id, isActive: true },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    // Format response as ActivityDetailDto
    return this.formatActivityDetail(activity);
  }

  /**
   * Format activity entity to detail response DTO
   * Maps database entity to clean response format
   */
  private formatActivityDetail(activity: ActivitiesEntity): ActivityDetailDto {
    return {
      id: activity.id,
      title: activity.name,
      description: activity.description,
      price: activity.price,
      location: activity.location,
      availableSlots: activity.maxParticipants - activity.currentParticipants,
      imageUrl: activity.imageUrl,
      isFeatured: activity.isFeatured,
      category: activity.category,
      rating: activity.rating,
      currentParticipants: activity.currentParticipants,
      maxParticipants: activity.maxParticipants,
      availableDates: this.generateAvailableDates(5),
    };
  }

  /**
   * Generate available dates for next N days
   * Used for display purposes in detail view
   * @param days Number of days to generate
   * @returns Array of ISO 8601 date strings
   */
  private generateAvailableDates(days: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Format as YYYY-MM-DD
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }

  async createActivity(dto: Partial<ActivitiesEntity>) {
    const activity = this.activitiesRepository.create(dto);
    const savedActivity = await this.activitiesRepository.save(activity);

    return {
      message: 'Activity created successfully',
      data: savedActivity,
    };
  }

  async findAll(getActivitiesDto: GetActivitiesDto) {
    return this.getActivities(getActivitiesDto);
  }

  private async getPaginatedActivities(
    getActivitiesDto: GetActivitiesDto,
  ): Promise<{
    data: ActivitiesEntity[];
    meta: ActivitiesPaginationMeta;
  }> {
    const { page, limit } = this.normalizePagination(getActivitiesDto);
    const query = this.buildActivitiesQuery(getActivitiesDto);

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: totalPages > 0 && page < totalPages,
      },
    };
  }

  private buildActivitiesQuery(
    getActivitiesDto: GetActivitiesDto,
  ): SelectQueryBuilder<ActivitiesEntity> {
    const { search, category, featured } = getActivitiesDto;
    const query = this.activitiesRepository.createQueryBuilder('activity');

    query.andWhere('activity.isActive = :isActive', { isActive: true });

    if (search?.trim()) {
      query.andWhere(
        '(activity.name ILIKE :search OR activity.description ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    if (category?.trim()) {
      query.andWhere('activity.category = :category', {
        category: category.trim(),
      });
    }

    if (featured !== undefined) {
      query.andWhere('activity.isFeatured = :isFeatured', {
        isFeatured: featured,
      });
    }

    return query.orderBy('activity.createdAt', 'DESC');
  }

  private normalizePagination(getActivitiesDto: GetActivitiesDto): {
    page: number;
    limit: number;
  } {
    const rawPage = getActivitiesDto.page ?? 1;
    const rawLimit = getActivitiesDto.limit ?? 10;

    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const limit = Number.isFinite(rawLimit)
      ? Math.min(100, Math.max(1, rawLimit))
      : 10;

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return { page, limit };
  }
}
