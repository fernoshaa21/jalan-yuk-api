import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { runSeeder, seedInBatches, numberInRange } from './utils/seed.util';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { BookingEntity, BookingStatus } from '../../bookings/entities/booking.entity';
import {
  PaymentEntity,
  PaymentStatus,
} from '../../payments/entities/payment.entity';
import { getImageByCategory } from '../../common/constants/activity-image-map';
import { SELLER_ROLE, USER_ROLE } from '../../common/constants/roles';

type SellerSeedOptions = {
  sellerEmail?: string;
  sellerId?: number;
  count: number;
  withBookings: boolean;
  bookingsPerActivity: number;
};

type TravelActivitySeed = {
  title: string;
  description: string;
  location: string;
  category:
    | 'adventure'
    | 'nature'
    | 'culture'
    | 'culinary'
    | 'city-tour'
    | 'water-sport'
    | 'family';
  priceRange: { min: number; max: number };
  slotsRange: { min: number; max: number };
};

const popularActivities: TravelActivitySeed[] = [
  {
    title: 'Sunrise Jeep Adventure Bromo',
    description:
      'Trip sunrise favorit di Bromo dengan jeep 4x4, spot Penanjakan, lautan pasir, dan sesi foto di area kawah yang paling ikonik.',
    location: 'Bromo, Jawa Timur',
    category: 'adventure',
    priceRange: { min: 350000, max: 650000 },
    slotsRange: { min: 4, max: 8 },
  },
  {
    title: 'ATV Ubud Rice Field Trail',
    description:
      'Jelajahi jalur sawah, kebun, dan trek tanah Ubud dengan ATV yang aman untuk pemula maupun peserta berpengalaman.',
    location: 'Ubud, Bali',
    category: 'adventure',
    priceRange: { min: 280000, max: 520000 },
    slotsRange: { min: 6, max: 14 },
  },
  {
    title: 'Nusa Penida West Coast Tour',
    description:
      'Tur sehari ke spot populer Nusa Penida Barat seperti Kelingking Beach, Broken Beach, dan Angel Billabong dengan itinerary efisien.',
    location: 'Nusa Penida, Bali',
    category: 'nature',
    priceRange: { min: 300000, max: 700000 },
    slotsRange: { min: 6, max: 12 },
  },
  {
    title: 'Borobudur Heritage Sunrise',
    description:
      'Pengalaman menikmati matahari terbit di kawasan Borobudur dengan pemandu lokal dan sesi cerita sejarah yang ringkas namun informatif.',
    location: 'Magelang, Jawa Tengah',
    category: 'culture',
    priceRange: { min: 220000, max: 550000 },
    slotsRange: { min: 8, max: 18 },
  },
  {
    title: 'Labuan Bajo Island Hopping',
    description:
      'Open trip populer ke pulau-pulau unggulan Labuan Bajo dengan waktu santai di pantai, snorkeling, dan spot panorama terbaik.',
    location: 'Labuan Bajo, NTT',
    category: 'nature',
    priceRange: { min: 450000, max: 950000 },
    slotsRange: { min: 8, max: 20 },
  },
  {
    title: 'Kecak Uluwatu Sunset Show',
    description:
      'Paket menonton pertunjukan Kecak di Uluwatu dengan suasana sunset dramatis dan akses nyaman untuk wisatawan keluarga maupun pasangan.',
    location: 'Uluwatu, Bali',
    category: 'culture',
    priceRange: { min: 150000, max: 300000 },
    slotsRange: { min: 10, max: 30 },
  },
  {
    title: 'Bandung Culinary Night Trail',
    description:
      'Tur kuliner malam ke jajanan legendaris Bandung dengan rute santai, cocok untuk food hunter yang ingin rasa lokal autentik.',
    location: 'Bandung, Jawa Barat',
    category: 'culinary',
    priceRange: { min: 120000, max: 250000 },
    slotsRange: { min: 10, max: 24 },
  },
  {
    title: 'Malioboro City Walk Jogja',
    description:
      'Paket city walk ringan di Malioboro dan area heritage Jogja dengan kombinasi belanja, sejarah, dan street snack favorit wisatawan.',
    location: 'Yogyakarta, DI Yogyakarta',
    category: 'city-tour',
    priceRange: { min: 100000, max: 220000 },
    slotsRange: { min: 8, max: 25 },
  },
  {
    title: 'Tanjung Benoa Water Sport Combo',
    description:
      'Aktivitas watersport favorit di Bali seperti banana boat dan parasailing dengan operator berpengalaman serta briefing keselamatan.',
    location: 'Tanjung Benoa, Bali',
    category: 'water-sport',
    priceRange: { min: 250000, max: 700000 },
    slotsRange: { min: 6, max: 16 },
  },
  {
    title: 'Bogor Family Safari Escape',
    description:
      'Paket wisata keluarga dengan aktivitas santai, area edukatif anak, dan waktu fleksibel untuk eksplorasi destinasi ramah keluarga.',
    location: 'Bogor, Jawa Barat',
    category: 'family',
    priceRange: { min: 180000, max: 420000 },
    slotsRange: { min: 10, max: 28 },
  },
];

const variedActivities: TravelActivitySeed[] = [
  {
    title: 'Rafting Cisadane Bogor',
    description:
      'Arung jeram di Sungai Cisadane dengan durasi menengah, cocok untuk outing kecil, keluarga aktif, atau traveler pencari adrenalin ringan.',
    location: 'Bogor, Jawa Barat',
    category: 'adventure',
    priceRange: { min: 220000, max: 450000 },
    slotsRange: { min: 10, max: 24 },
  },
  {
    title: 'Lembang Forest Healing Walk',
    description:
      'Perjalanan santai menyusuri area hutan pinus Lembang dengan fokus relaksasi, udara sejuk, dan spot foto alami yang estetik.',
    location: 'Lembang, Jawa Barat',
    category: 'nature',
    priceRange: { min: 100000, max: 240000 },
    slotsRange: { min: 12, max: 30 },
  },
  {
    title: 'Solo Batik & Heritage Route',
    description:
      'Eksplor kampung batik, sentra kerajinan, dan titik heritage Solo dengan itinerary yang nyaman untuk wisata budaya setengah hari.',
    location: 'Solo, Jawa Tengah',
    category: 'culture',
    priceRange: { min: 120000, max: 280000 },
    slotsRange: { min: 8, max: 18 },
  },
  {
    title: 'Makassar Seafood Sunset Market',
    description:
      'Tur kuliner sore hingga malam untuk mencicipi seafood khas Makassar dan camilan lokal di area tepi laut yang ramai dan hidup.',
    location: 'Makassar, Sulawesi Selatan',
    category: 'culinary',
    priceRange: { min: 140000, max: 320000 },
    slotsRange: { min: 10, max: 22 },
  },
  {
    title: 'Semarang Old Town Leisure Tour',
    description:
      'City tour ringan ke Kota Lama Semarang dengan kombinasi sejarah bangunan kolonial, cafe hopping, dan sesi foto arsitektur.',
    location: 'Semarang, Jawa Tengah',
    category: 'city-tour',
    priceRange: { min: 110000, max: 260000 },
    slotsRange: { min: 8, max: 20 },
  },
  {
    title: 'Lombok Gili Snorkeling Escape',
    description:
      'Trip snorkeling ke perairan jernih sekitar Gili dengan pemandangan bawah laut cantik dan suasana pulau yang santai.',
    location: 'Lombok, NTB',
    category: 'water-sport',
    priceRange: { min: 300000, max: 800000 },
    slotsRange: { min: 6, max: 14 },
  },
  {
    title: 'Batu Family Farm Experience',
    description:
      'Aktivitas keluarga di area agrowisata Batu dengan wahana ringan, kebun edukasi, dan banyak spot yang nyaman untuk anak-anak.',
    location: 'Batu, Jawa Timur',
    category: 'family',
    priceRange: { min: 150000, max: 350000 },
    slotsRange: { min: 10, max: 26 },
  },
  {
    title: 'Raja Ampat Scenic Day Cruise',
    description:
      'Paket satu hari menjelajah panorama pulau karst Raja Ampat dengan titik pandang unggulan dan waktu santai di perairan jernih.',
    location: 'Raja Ampat, Papua Barat',
    category: 'nature',
    priceRange: { min: 650000, max: 1000000 },
    slotsRange: { min: 6, max: 12 },
  },
  {
    title: 'Kupang Coastal Adventure Ride',
    description:
      'Petualangan darat ringan di area pesisir Kupang dengan pemandangan laut, bukit, dan beberapa spot foto terbaik di jalur timur Indonesia.',
    location: 'Kupang, NTT',
    category: 'adventure',
    priceRange: { min: 250000, max: 500000 },
    slotsRange: { min: 6, max: 16 },
  },
  {
    title: 'Pontianak Riverside Food Journey',
    description:
      'Wisata rasa menyusuri area kuliner tepi sungai Pontianak, menonjolkan menu lokal, kopi khas, dan cerita hidangan daerah.',
    location: 'Pontianak, Kalimantan Barat',
    category: 'culinary',
    priceRange: { min: 100000, max: 240000 },
    slotsRange: { min: 10, max: 24 },
  },
];

const bookingPaymentMethods = [
  'bank_transfer',
  'gopay',
  'ovo',
  'qris',
  'credit_card',
] as const;

function parseArgs(argv: string[]): SellerSeedOptions {
  const raw = Object.fromEntries(
    argv
      .filter((arg) => arg.startsWith('--'))
      .map((arg) => {
        const [key, ...rest] = arg.slice(2).split('=');
        return [key, rest.join('=') || 'true'];
      }),
  );

  const count = Number(raw.count ?? 10);
  const sellerId = raw.sellerId ? Number(raw.sellerId) : undefined;
  const bookingsPerActivity = Number(raw.bookingsPerActivity ?? 3);

  if (!raw.sellerEmail && !sellerId) {
    throw new Error('Pass --sellerEmail=<email> or --sellerId=<id>');
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new Error('--count must be a positive integer');
  }

  if (!Number.isInteger(bookingsPerActivity) || bookingsPerActivity < 1) {
    throw new Error('--bookingsPerActivity must be a positive integer');
  }

  return {
    sellerEmail: raw.sellerEmail,
    sellerId,
    count,
    withBookings: raw.withBookings === 'true',
    bookingsPerActivity,
  };
}

function toMoney(min: number, max: number): number {
  const amount = numberInRange(min / 1000, max / 1000) * 1000;
  return Number(amount.toFixed(2));
}

function toRating(): number {
  return Number(
    faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }).toFixed(1),
  );
}

function resolveTemplate(index: number, count: number): TravelActivitySeed {
  const popularQuota = Math.ceil(count * 0.6);
  const source = index < popularQuota ? popularActivities : variedActivities;
  return source[index % source.length];
}

function buildTitle(baseTitle: string, index: number): string {
  const suffixes = [
    'Open Trip',
    'Weekend Session',
    'Private Experience',
    'Morning Escape',
    'Sunset Edition',
  ];

  if (index < popularActivities.length + variedActivities.length) {
    return baseTitle;
  }

  return `${baseTitle} ${suffixes[index % suffixes.length]}`;
}

async function seedSellerActivitiesAndBookings() {
  const options = parseArgs(process.argv.slice(2));
  const sellerRepository = AppDataSource.getRepository(UserEntity);
  const activitiesRepository = AppDataSource.getRepository(ActivitiesEntity);
  const bookingsRepository = AppDataSource.getRepository(BookingEntity);
  const paymentsRepository = AppDataSource.getRepository(PaymentEntity);

  const seller = await sellerRepository.findOne({
    where: options.sellerEmail
      ? { email: options.sellerEmail.trim().toLowerCase(), role: SELLER_ROLE }
      : { id: options.sellerId, role: SELLER_ROLE },
  });

  if (!seller) {
    throw new Error(
      options.sellerEmail
        ? `Seller with email ${options.sellerEmail} not found`
        : `Seller with id ${options.sellerId} not found`,
    );
  }

  const activitySeedData = Array.from({ length: options.count }, (_, index) => {
    const template = resolveTemplate(index, options.count);
    const title = buildTitle(template.title, index);

    return {
      title,
      description: template.description,
      category: template.category,
      location: template.location,
      price: toMoney(template.priceRange.min, template.priceRange.max),
      availableSlots: numberInRange(
        template.slotsRange.min,
        template.slotsRange.max,
      ),
      currentParticipants: 0,
      imageUrl: getImageByCategory(template.category, index),
      isFeatured: Math.random() < 0.25,
      rating: toRating(),
      isActive: true,
      sellerId: seller.id,
    };
  });

  const activities = activitiesRepository.create(activitySeedData);

  await seedInBatches(activitiesRepository, activities, 30);

  console.log(
    `Seeded ${activities.length} seller activities for ${seller.email} (sellerId=${seller.id})`,
  );

  if (!options.withBookings) {
    console.log('Booking dummy creation skipped (--withBookings not provided)');
    return;
  }

  const regularUsers = await sellerRepository.find({
    where: { role: USER_ROLE, isActive: true },
    take: 100,
  });

  if (regularUsers.length === 0) {
    throw new Error(
      'No regular users found to create seller bookings. Seed users first or disable --withBookings.',
    );
  }

  let totalBookingsCreated = 0;
  let totalPaymentsCreated = 0;

  for (const activity of activities) {
    let reservedParticipants = 0;
    const bookingCount = numberInRange(1, options.bookingsPerActivity);

    for (let i = 0; i < bookingCount; i += 1) {
      const remainingSlots = activity.availableSlots - reservedParticipants;

      if (remainingSlots < 1) {
        break;
      }

      const qty = numberInRange(1, Math.min(4, remainingSlots));
      const status = faker.helpers.weightedArrayElement([
        { value: BookingStatus.PENDING, weight: 3 },
        { value: BookingStatus.CONFIRMED, weight: 5 },
        { value: BookingStatus.CANCELLED, weight: 2 },
      ]);

      const booking = await bookingsRepository.save(
        bookingsRepository.create({
          user: faker.helpers.arrayElement(regularUsers),
          activity,
          bookingDate: faker.date.soon({ days: 60 }),
          qty,
          unitPrice: Number(activity.price).toFixed(2),
          totalPrice: (Number(activity.price) * qty).toFixed(2),
          status,
        }),
      );

      totalBookingsCreated += 1;

      if (status !== BookingStatus.CANCELLED) {
        reservedParticipants += qty;
      }

      const shouldCreatePayment =
        status === BookingStatus.CONFIRMED ||
        status === BookingStatus.CANCELLED ||
        Math.random() < 0.6;

      if (!shouldCreatePayment) {
        continue;
      }

      const paymentStatus =
        status === BookingStatus.CONFIRMED
          ? PaymentStatus.PAID
          : status === BookingStatus.CANCELLED
            ? PaymentStatus.CANCELLED
            : PaymentStatus.PENDING;

      await paymentsRepository.save(
        paymentsRepository.create({
          booking,
          method: faker.helpers.arrayElement([...bookingPaymentMethods]),
          paymentStatus,
          paidAt:
            paymentStatus === PaymentStatus.PAID ? faker.date.recent() : null,
          externalRef:
            paymentStatus === PaymentStatus.PAID
              ? `PAY-${faker.string.alphanumeric(12).toUpperCase()}`
              : null,
        }),
      );

      totalPaymentsCreated += 1;
    }

    activity.currentParticipants = reservedParticipants;
    await activitiesRepository.save(activity);
  }

  console.log(
    `Seeded ${totalBookingsCreated} bookings and ${totalPaymentsCreated} payments for seller ${seller.email}`,
  );
}

void runSeeder(
  AppDataSource,
  'Seller Activities',
  seedSellerActivitiesAndBookings,
);
