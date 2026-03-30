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
import { SELLER_ROLE, USER_ROLE } from '../common/constants/roles';

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
    return this.registerWithRole(registerDto, USER_ROLE, 'User registered successfully');
  }

  async registerSeller(registerDto: RegisterDto) {
    return this.registerWithRole(
      registerDto,
      SELLER_ROLE,
      'Seller registered successfully',
    );
  }

  async login(loginDto: LoginDto) {
    return this.loginWithRole(loginDto, null, 'Login successful');
  }

  async loginSeller(loginDto: LoginDto) {
    return this.loginWithRole(
      loginDto,
      SELLER_ROLE,
      'Seller login successful',
    );
  }

  private async registerWithRole(
    registerDto: RegisterDto,
    role: string,
    successMessage: string,
  ) {
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
        role,
        isActive: true,
      });

      const savedUser = await this.usersRepository.save(user);

      return this.buildAuthSuccessResponse(savedUser, successMessage);
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

  private async loginWithRole(
    loginDto: LoginDto,
    requiredRole: string | null,
    successMessage: string,
  ) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthSuccessResponse(user, successMessage);
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

  private buildAuthSuccessResponse(user: UserEntity, message: string) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message,
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
}
