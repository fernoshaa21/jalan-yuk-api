import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../activities/entities/activities.entity';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { TaskEntity } from '../tasks/task.entity';

type DatabaseEnv = {
  NODE_ENV?: string;
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_DATABASE?: string;
  DB_SSL?: string;
  DB_POOL_MAX?: string;
};

function parsePort(value?: string): number {
  const port = Number.parseInt(value ?? '5432', 10);
  return Number.isFinite(port) ? port : 5432;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return fallback;
}

function shouldEnableSsl(env: DatabaseEnv, usingDatabaseUrl: boolean): boolean {
  if (env.DB_SSL !== undefined) {
    return env.DB_SSL === 'true';
  }

  return usingDatabaseUrl && env.NODE_ENV === 'production';
}

export function buildTypeOrmConfig(env: DatabaseEnv): DataSourceOptions {
  const databaseUrl = env.DATABASE_URL?.trim();
  const usingDatabaseUrl = Boolean(databaseUrl);
  const sslEnabled = shouldEnableSsl(env, usingDatabaseUrl);
  const poolMax = parsePositiveInt(env.DB_POOL_MAX, usingDatabaseUrl ? 5 : 10);
  const sslConfig = sslEnabled ? { rejectUnauthorized: false } : false;
  const extraConfig = {
    max: poolMax,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    ...(sslEnabled ? { ssl: sslConfig } : {}),
  };

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
    extra: extraConfig,
  };

  if (usingDatabaseUrl && databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
      ssl: sslConfig,
    };
  }

  return {
    ...baseConfig,
    host: env.DB_HOST || 'localhost',
    port: parsePort(env.DB_PORT),
    username: env.DB_USERNAME || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_DATABASE || 'jalanyuk_db',
    ssl: sslConfig,
  };
}
