import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../activities/entities/activities.entity';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { TaskEntity } from '../tasks/task.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'jalanyuk_db',
  entities: [
    UserEntity,
    ActivitiesEntity,
    BookingEntity,
    PaymentEntity,
    TaskEntity,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
