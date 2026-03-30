import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';

@Injectable()
export class SellerProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.findSellerOrFail(userId);
    return this.toSellerProfile(user);
  }

  async updateProfile(userId: number, dto: UpdateSellerProfileDto) {
    const user = await this.findSellerOrFail(userId);

    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName.trim();
    }

    if (dto.phoneNumber !== undefined) {
      user.phoneNumber = dto.phoneNumber.trim();
    }

    if (dto.avatarUrl !== undefined) {
      user.avatarUrl = dto.avatarUrl;
    }

    const updatedUser = await this.usersRepository.save(user);
    return this.toSellerProfile(updatedUser);
  }

  private async findSellerOrFail(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, role: 'seller' },
    });

    if (!user) {
      throw new NotFoundException('Seller not found');
    }

    return user;
  }

  private toSellerProfile(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      role: user.role,
    };
  }
}
