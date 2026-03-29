import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { AdminUserListItemDto } from './dto/admin-user-list-item.dto';
import { GetAdminUsersDto } from './dto/get-admin-users.dto';

type AdminUsersPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getUsers(
    queryDto: GetAdminUsersDto = {},
  ): Promise<{
    data: AdminUserListItemDto[];
    meta: AdminUsersPaginationMeta;
  }> {
    const { page, limit } = this.normalizePagination(queryDto);
    const query = this.buildAdminUsersQuery(queryDto);

    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await query.getManyAndCount();
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
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

  private buildAdminUsersQuery(
    queryDto: GetAdminUsersDto,
  ): SelectQueryBuilder<UserEntity> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.role',
        'user.isActive',
        'user.createdAt',
      ]);

    if (queryDto.search?.trim()) {
      query.andWhere('(user.fullName ILIKE :search OR user.email ILIKE :search)', {
        search: `%${queryDto.search.trim()}%`,
      });
    }

    if (queryDto.role?.trim()) {
      query.andWhere('LOWER(user.role) = :role', {
        role: queryDto.role.trim().toLowerCase(),
      });
    }

    if (queryDto.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: queryDto.isActive,
      });
    }

    return query.orderBy('user.createdAt', 'DESC');
  }

  private normalizePagination(queryDto: GetAdminUsersDto): {
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
}
