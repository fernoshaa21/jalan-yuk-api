import { DataSource, DeepPartial, ObjectLiteral, Repository } from 'typeorm';

export async function runSeeder(
  dataSource: DataSource,
  seederName: string,
  seedFn: (dataSource: DataSource) => Promise<void>,
): Promise<void> {
  await dataSource.initialize();

  try {
    await seedFn(dataSource);
    console.log(`✅ ${seederName} seeding completed successfully`);
  } catch (error) {
    console.error(`❌ ${seederName} seeding failed`, error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

export async function seedInBatches<T extends ObjectLiteral>(
  repository: Repository<T>,
  data: DeepPartial<T>[],
  batchSize = 50,
): Promise<void> {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await repository.save(batch);
  }
}

export function randomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function numberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
