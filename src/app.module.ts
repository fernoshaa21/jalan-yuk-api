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
import { SellerActivitiesModule } from './seller/activities/activities.module';
import { SellerAuthModule } from './seller/auth/seller-auth.module';
import { SellerBookingsModule } from './seller/bookings/bookings.module';
import { SellerDashboardModule } from './seller/dashboard/dashboard.module';
import { SellerProfileModule } from './seller/profile/profile.module';
import { SellerUploadsModule } from './seller/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
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
