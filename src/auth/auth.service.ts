import {
  BadRequestException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

type PgDriverError = {
  code?: string;
  detail?: string;
  column?: string;
  constraint?: string;
  message?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email?.trim().toLowerCase();
    const password = registerDto.password;
    const fullName = registerDto.fullName?.trim();
    const phoneNumber = registerDto.phoneNumber?.trim();

    if (!email || !password || !fullName || !phoneNumber) {
      throw new BadRequestException(
        'email, password, fullName, and phoneNumber are required',
      );
    }

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        isActive: true,
      });

      const savedUser = await this.usersRepository.save(user);

      // Generate JWT token
      const payload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'User registered successfully',
        accessToken,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          fullName: savedUser.fullName,
          phoneNumber: savedUser.phoneNumber,
          role: savedUser.role,
        },
      };
    } catch (error: unknown) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        const driverError = error as QueryFailedError & {
          driverError?: PgDriverError;
        };
        const code = driverError.driverError?.code;
        const detail = driverError.driverError?.detail;
        const message = driverError.driverError?.message;

        if (code === '23505') {
          throw new ConflictException('Email already exists');
        }

        if (code === '23502') {
          throw new BadRequestException('Invalid register payload');
        }

        if (
          code === '42703' &&
          (detail?.includes('role') || message?.includes('role'))
        ) {
          throw new InternalServerErrorException(
            'Database schema is outdated. Run migrations and retry.',
          );
        }
      }

      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }

  async validateUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

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
