import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesAdminModule } from './admin/activities-admin/activities-admin.module';
import { AdminBookingsModule } from './admin/bookings/bookings.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';
import { UploadsModule } from './admin/uploads/uploads.module';
import { AdminUsersModule } from './admin/users/users.module';
import { buildTypeOrmConfig } from './database/typeorm.config';
import { SellerActivitiesModule } from './seller/activities/activities.module';
import { SellerAuthModule } from './seller/auth/seller-auth.module';
import { SellerBookingsModule } from './seller/bookings/bookings.module';
import { SellerDashboardModule } from './seller/dashboard/dashboard.module';
import { SellerProfileModule } from './seller/profile/profile.module';
import { SellerUploadsModule } from './seller/uploads/uploads.module';

function shouldServeStaticUploads(): boolean {
  if (process.env.SERVE_STATIC_UPLOADS !== undefined) {
    return process.env.SERVE_STATIC_UPLOADS === 'true';
  }

  return process.env.NODE_ENV !== 'production';
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = buildTypeOrmConfig({
          NODE_ENV: configService.get<string>('NODE_ENV'),
          DATABASE_URL: configService.get<string>('DATABASE_URL'),
          DB_HOST: configService.get<string>('DB_HOST'),
          DB_PORT: configService.get<string>('DB_PORT'),
          DB_USERNAME: configService.get<string>('DB_USERNAME'),
          DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
          DB_DATABASE: configService.get<string>('DB_DATABASE'),
          DB_SSL: configService.get<string>('DB_SSL'),
          DB_POOL_MAX: configService.get<string>('DB_POOL_MAX'),
        });

        return {
          ...databaseConfig,
          autoLoadEntities: true,
          logging: false,
          migrations: [],
          migrationsRun: false,
          retryAttempts: process.env.NODE_ENV === 'production' ? 2 : 5,
          retryDelay: 3000,
        };
      },
    }),
    ...(shouldServeStaticUploads()
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
          }),
        ]
      : []),
    AuthModule,
    ActivitiesModule,
    BookingsModule,
    PaymentsModule,
    UsersModule,
    CommonModule,
    TasksModule,
    ActivitiesAdminModule,
    AdminBookingsModule,
    DashboardModule,
    UploadsModule,
    AdminUsersModule,
    SellerAuthModule,
    SellerActivitiesModule,
    SellerBookingsModule,
    SellerDashboardModule,
    SellerProfileModule,
    SellerUploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
