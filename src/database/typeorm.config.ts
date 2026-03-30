import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../activities/entities/activities.entity';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { TaskEntity } from '../tasks/task.entity';

type DatabaseEnv = {
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_DATABASE?: string;
  DB_SSL?: string;
};

function parsePort(value?: string): number {
  const port = Number.parseInt(value ?? '5432', 10);
  return Number.isFinite(port) ? port : 5432;
}

function shouldEnableSsl(env: DatabaseEnv, usingDatabaseUrl: boolean): boolean {
  if (env.DB_SSL !== undefined) {
    return env.DB_SSL === 'true';
  }

  return usingDatabaseUrl;
}

export function buildTypeOrmConfig(env: DatabaseEnv): DataSourceOptions {
  const databaseUrl = env.DATABASE_URL?.trim();
  const usingDatabaseUrl = Boolean(databaseUrl);
  const sslEnabled = shouldEnableSsl(env, usingDatabaseUrl);

  const baseConfig: DataSourceOptions = {
    type: 'postgres',
    entities: [
      UserEntity,
      ActivitiesEntity,
      BookingEntity,
      PaymentEntity,
      TaskEntity,
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
  };

  if (usingDatabaseUrl && databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    ...baseConfig,
    host: env.DB_HOST || 'localhost',
    port: parsePort(env.DB_PORT),
    username: env.DB_USERNAME || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_DATABASE || 'jalanyuk_db',
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };
}
