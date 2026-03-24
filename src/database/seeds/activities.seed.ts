import { faker } from '@faker-js/faker';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { AppDataSource } from '../data-source';
import { runSeeder, seedInBatches } from './utils/seed.util';

const ACTIVITY_TOTAL = 120;

const categories = [
  'adventure',
  'nature',
  'culture',
  'culinary',
  'city-tour',
  'water-sport',
  'family',
] as const;

const locations = [
  'Jakarta',
  'Bandung',
  'Yogyakarta',
  'Bali',
  'Lombok',
  'Malang',
  'Surabaya',
  'Bogor',
  'Semarang',
  'Labuan Bajo',
] as const;

function categoryPriceRange(category: string): { min: number; max: number } {
  switch (category) {
    case 'water-sport':
      return { min: 250000, max: 1250000 };
    case 'adventure':
      return { min: 200000, max: 1500000 };
    case 'city-tour':
      return { min: 75000, max: 300000 };
    case 'culinary':
      return { min: 50000, max: 200000 };
    case 'family':
      return { min: 100000, max: 450000 };
    case 'nature':
      return { min: 90000, max: 700000 };
    case 'culture':
      return { min: 60000, max: 350000 };
    default:
      return { min: 50000, max: 500000 };
  }
}

function createActivitiesSeedData(total: number): Partial<ActivitiesEntity>[] {
  const now = new Date();

  return Array.from({ length: total }, (_, index) => {
    const category = faker.helpers.arrayElement(categories);
    const location = faker.helpers.arrayElement(locations);
    const { min, max } = categoryPriceRange(category);

    const price = faker.number.int({ min, max });
    const maxParticipants = faker.number.int({ min: 10, max: 80 });
    const currentParticipants = faker.number.int({
      min: 0,
      max: Math.floor(maxParticipants * 0.7),
    });

    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - (total - index));

    const titlePrefix = faker.helpers.arrayElement([
      'Eksplorasi',
      'Trip',
      'Wisata',
      'Petualangan',
      'Liburan',
    ]);

    return {
      title: `${titlePrefix} ${faker.word.adjective()} ${category} ${location}`,
      description: faker.lorem.paragraph({ min: 2, max: 4 }),
      category,
      location,
      price,
      availableSlots: maxParticipants,
      currentParticipants,
      imageUrl: faker.image.urlPicsumPhotos({ width: 1280, height: 720 }),
      isFeatured: index % 6 === 0 || faker.datatype.boolean(0.12),
      rating: Number(
        faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
      ),
      isActive: index % 12 !== 0,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

async function seedActivities() {
  const repository = AppDataSource.getRepository(ActivitiesEntity);

  try {
    await repository.clear();
  } catch {
    console.warn(
      '⚠️ Could not truncate activities table. New dummy data will be appended.',
    );
  }

  const seedData = createActivitiesSeedData(ACTIVITY_TOTAL);
  await seedInBatches(repository, seedData, 40);

  const activeTotal = await repository.count({ where: { isActive: true } });
  const featuredTotal = await repository.count({
    where: { isActive: true, isFeatured: true },
  });

  console.log(
    `🌱 Seeded ${seedData.length} activities (${activeTotal} active, ${featuredTotal} featured active)`,
  );
}

faker.seed(20260324);

void runSeeder(AppDataSource, 'Activities', seedActivities);
