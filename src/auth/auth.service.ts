import {
  BadRequestException,
  Injectable,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

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
    return this.loginWithRole(loginDto, SELLER_ROLE, 'Login successful');
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

    this.logAuthEvent(`Register attempt for role=${role} email=${email}`);

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        this.logAuthEvent(
          `Register rejected for email=${email}: already exists with role=${existingUser.role}`,
        );
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

      this.logAuthEvent(
        `Register persisted for email=${email}: userId=${savedUser.id} role=${savedUser.role}`,
      );

      return this.buildAuthSuccessResponse(savedUser, successMessage);
    } catch (error: unknown) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof HttpException
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
          this.logger.error(
            `Register schema mismatch for email=${email}`,
            error.stack,
          );
          throw new InternalServerErrorException(
            'Database schema is outdated. Run migrations and retry.',
          );
        }

        this.logger.error(
          `Register query failed for email=${email}`,
          error.stack,
        );
      }

      this.logger.error(
        `Unexpected register failure for email=${email}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('Failed to register user');
    }
  }

  private async loginWithRole(
    loginDto: LoginDto,
    requiredRole: string | null,
    successMessage: string,
  ) {
    const normalizedEmail = loginDto.email?.trim().toLowerCase();
    const password = loginDto.password;

    this.logAuthEvent(
      `Login attempt on ${requiredRole ?? 'public'} auth flow for email=${normalizedEmail ?? '<empty>'}`,
    );

    try {
      if (!normalizedEmail || !password) {
        throw new BadRequestException('email and password are required');
      }

      const user = await this.usersRepository.findOne({
        where: { email: normalizedEmail },
      });

      this.logAuthEvent(
        `Login lookup result for email=${normalizedEmail}: found=${Boolean(user)} role=${user?.role ?? 'n/a'} isActive=${user?.isActive ?? 'n/a'}`,
      );

      if (!user) {
        this.logAuthEvent(
          `Login failed for email=${normalizedEmail}: user not found`,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      if (!user.isActive) {
        this.logAuthEvent(
          `Login failed for email=${normalizedEmail}: inactive account`,
        );
        throw new UnauthorizedException('User account is inactive');
      }

      if (requiredRole && user.role !== requiredRole) {
        this.logAuthEvent(
          `Login role mismatch for email=${normalizedEmail}: expected=${requiredRole} actual=${user.role}`,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      if (!user.password?.trim()) {
        this.logAuthEvent(
          `Login failed for email=${normalizedEmail}: empty password hash in database`,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      this.logAuthEvent(
        `Password compare result for email=${normalizedEmail}: valid=${isPasswordValid}`,
      );

      if (!isPasswordValid) {
        this.logAuthEvent(
          `Login failed for email=${normalizedEmail}: invalid password`,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      return this.buildAuthSuccessResponse(user, successMessage);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        this.logAuthEvent(
          `Login rejected for email=${normalizedEmail}: ${error.message}`,
        );
        throw error;
      }

      if (error instanceof BadRequestException) {
        this.logAuthEvent(
          `Login bad request for email=${normalizedEmail}: ${error.message}`,
        );
        throw error;
      }

      if (error instanceof QueryFailedError) {
        this.logger.error(
          `Login query failed for email=${normalizedEmail}`,
          error.stack,
        );
        throw new InternalServerErrorException('Failed to login user');
      }

      this.logger.error(
        `Unexpected login failure for email=${normalizedEmail}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('Failed to login user');
    }
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
    const jwtSecret = this.resolveJwtSecret();
    const jwtSecretPresent = jwtSecret !== 'default-secret';

    this.logAuthEvent(
      `JWT secret availability during auth response for userId=${user.id}: present=${jwtSecretPresent}`,
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { secret: jwtSecret });

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

  private resolveJwtSecret(): string {
    const configuredSecret = this.configService.get<string>('JWT_SECRET')?.trim();

    if (configuredSecret) {
      return configuredSecret;
    }

    this.logger.warn(
      'JWT_SECRET is not configured. Falling back to default-secret. Set JWT_SECRET in production immediately.',
    );

    return 'default-secret';
  }

  private logAuthEvent(message: string) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn(message);
      return;
    }

    this.logger.log(message);
  }
}
