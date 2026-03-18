import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from './entities/activities.entity';
import { GetActivitiesDto } from './dto/get-activities.dto';
import { ActivityDetailDto } from './dto/activity-detail.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async getActivities(getActivitiesDto: GetActivitiesDto) {
    const {
      search,
      category,
      featured,
      page = 1,
      limit = 10,
    } = getActivitiesDto;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const query = this.activitiesRepository.createQueryBuilder('activity');

    // Filter only active activities
    query.andWhere('activity.isActive = :isActive', { isActive: true });

    // Search by name or description
    if (search && search.trim()) {
      query.andWhere(
        '(activity.name ILIKE :search OR activity.description ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    // Filter by category
    if (category && category.trim()) {
      query.andWhere('activity.category = :category', { category });
    }

    // Filter by featured
    if (featured !== undefined) {
      query.andWhere('activity.isFeatured = :isFeatured', {
        isFeatured: featured,
      });
    }

    // Order by createdAt DESC
    query.orderBy('activity.createdAt', 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Get total count for pagination
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getFeaturedActivities() {
    const data = await this.activitiesRepository.find({
      where: { isActive: true, isFeatured: true },
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total: data.length,
    };
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
}
