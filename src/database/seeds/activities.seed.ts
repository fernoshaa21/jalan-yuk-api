import { faker } from '@faker-js/faker';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import {
  activityImageMap,
  getImageByCategory,
  type ActivityCategory,
} from '../../common/constants/activity-image-map';
import { AppDataSource } from '../data-source';
import { runSeeder, seedInBatches } from './utils/seed.util';

const ACTIVITY_TOTAL = 120;
const ACTIVITY_DISTRIBUTION_MODE: SeedDistributionMode = 'balanced';

type SeedDistributionMode = 'random' | 'balanced';

type CategorySeedTemplate = {
  titlePatterns: readonly string[];
  descriptionPatterns: readonly string[];
  locations: readonly string[];
  priceRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
  availableSlotsRange: { min: number; max: number };
  featuredProbability?: number;
  curatedEntries?: readonly {
    title: string;
    description: string;
    location: string;
  }[];
};

const categories = Object.keys(activityImageMap) as ActivityCategory[];

const categorySeedTemplates: Record<ActivityCategory, CategorySeedTemplate> = {
  adventure: {
    titlePatterns: [
      'ATV Jungle Ride {location}',
      'Sunrise Jeep Tour {location}',
      'White Water Rafting {location}',
      'Volcano Trekking Experience {location}',
      'Canyoning Adventure {location}',
    ],
    descriptionPatterns: [
      'Paket petualangan seru di {location} untuk pencari adrenalin. Sudah termasuk pemandu lokal, briefing keselamatan, dan dokumentasi trip.',
      'Nikmati pengalaman outdoor menantang di {location} dengan itinerary yang aman untuk pemula maupun peserta berpengalaman.',
      'Aktivitas adventure populer di {location} dengan durasi 3-5 jam, cocok untuk solo traveler, pasangan, atau rombongan kecil.',
    ],
    locations: ['Ubud', 'Bromo', 'Batu', 'Lombok', 'Labuan Bajo'],
    priceRange: { min: 250000, max: 1450000 },
    ratingRange: { min: 4.3, max: 5.0 },
    availableSlotsRange: { min: 8, max: 28 },
    featuredProbability: 0.25,
    curatedEntries: [
      {
        title: 'Arum Jeram Sungai Seru Batu',
        location: 'Batu',
        description:
          'Pacu adrenalin dengan arung jeram di aliran sungai berbatu yang deras di Batu. Aktivitas ini cocok untuk pencinta petualangan yang ingin merasakan kombinasi tantangan, teamwork, dan panorama alam dalam satu trip.',
      },
      {
        title: 'ATV Offroad Adventure Ubud',
        location: 'Ubud',
        description:
          'Jelajahi jalur tanah, tanjakan, dan trek pedesaan Ubud dengan ATV yang aman untuk pemula maupun peserta berpengalaman. Sudah termasuk briefing keselamatan, perlengkapan standar, dan pendamping lokal selama perjalanan.',
      },
      {
        title: 'Sunrise Jeep Tour Bromo',
        location: 'Bromo',
        description:
          'Nikmati pengalaman jeep sunrise menuju spot panorama Gunung Bromo dengan pemandangan lautan kabut yang ikonik. Cocok untuk traveler yang ingin petualangan ringan dengan view spektakuler sejak pagi hari.',
      },
      {
        title: 'Island Hopping Adventure Labuan Bajo',
        location: 'Labuan Bajo',
        description:
          'Eksplor pulau-pulau eksotis dan perairan jernih di sekitar Labuan Bajo dalam perjalanan yang memadukan petualangan laut, waktu santai di pantai, dan momen foto terbaik dari atas kapal.',
      },
      {
        title: 'Volcano Trekking Experience Rinjani',
        location: 'Lombok',
        description:
          'Rasakan sensasi trekking menuju area kawah dan panorama danau vulkanik yang dramatis di kawasan Rinjani. Paket ini cocok untuk peserta yang mencari pengalaman mendaki dengan view alam yang benar-benar berkesan.',
      },
    ],
  },
  nature: {
    titlePatterns: [
      'Waterfall Trek & Picnic {location}',
      'Sunrise Viewpoint Tour {location}',
      'Forest Healing Walk {location}',
      'Island Nature Escape {location}',
      'Lakeside Camping Experience {location}',
    ],
    descriptionPatterns: [
      'Jelajahi keindahan alam {location} dengan rute santai dan pemandangan terbaik. Cocok untuk relaksasi akhir pekan.',
      'Paket wisata alam di {location} dengan kombinasi trekking ringan, spot foto, dan waktu bebas menikmati suasana hijau.',
      'Aktivitas nature trip di {location} yang ramah keluarga, dengan itinerary fleksibel dan meeting point yang mudah dijangkau.',
    ],
    locations: [
      'Banyuwangi',
      'Lembang',
      'Lombok Utara',
      'Bedugul',
      'Berastagi',
    ],
    priceRange: { min: 120000, max: 650000 },
    ratingRange: { min: 4.2, max: 4.9 },
    availableSlotsRange: { min: 10, max: 34 },
    featuredProbability: 0.18,
    curatedEntries: [
      {
        title: 'Danau & Pura View Escape Bali',
        location: 'Bedugul',
        description:
          'Nikmati suasana danau yang tenang dengan latar pura ikonik dan pegunungan berkabut di Bali. Aktivitas ini cocok untuk traveler yang mencari pengalaman alam santai dengan spot foto yang sangat estetik.',
      },
      {
        title: 'Coastal Nature Escape Kalimantan Timur',
        location: 'Kalimantan Timur',
        description:
          'Jelajahi garis pantai tropis dengan hamparan laut biru dan vegetasi hijau yang masih alami di Kalimantan Timur. Pilihan tepat untuk menikmati panorama pesisir, udara segar, dan suasana liburan yang menenangkan.',
      },
      {
        title: 'Orangutan Rainforest Encounter Kalimantan',
        location: 'Kalimantan',
        description:
          'Rasakan pengalaman melihat kehidupan satwa endemik di tengah hutan hujan Kalimantan yang lebat. Trip ini ideal untuk pecinta alam yang ingin menikmati ekowisata dengan nuansa liar dan autentik.',
      },
      {
        title: 'Komodo Island Nature Trek',
        location: 'Labuan Bajo',
        description:
          'Eksplor jalur alam terbuka di habitat komodo dengan pemandangan savana dan bukit yang khas. Aktivitas ini menghadirkan perpaduan trekking ringan, wisata satwa, dan panorama alam yang unik.',
      },
      {
        title: 'Pink Beach Escape Lombok',
        location: 'Lombok',
        description:
          'Habiskan waktu di pantai berpasir merah muda dengan air laut jernih dan perbukitan eksotis di sekitarnya. Cocok untuk wisatawan yang ingin bersantai sambil menikmati keindahan alam pesisir yang langka.',
      },
      {
        title: 'Hidden Rainforest Journey Kalimantan Utara',
        location: 'Kalimantan Utara',
        description:
          'Temukan lanskap hutan tropis, sungai berkelok, dan air terjun tersembunyi dalam perjalanan alam yang memukau di Kalimantan Utara. Pengalaman ini pas untuk pencari ketenangan sekaligus penjelajah alam liar.',
      },
      {
        title: 'Raja Ampat Scenic Island Cruise',
        location: 'Raja Ampat',
        description:
          'Nikmati panorama gugusan pulau karst dan perairan biru jernih yang menjadi ikon Raja Ampat. Aktivitas ini menawarkan pengalaman nature trip premium dengan view kelas dunia dari setiap sudut perjalanan.',
      },
      {
        title: 'Jogja Forest Viewpoint Experience',
        location: 'Yogyakarta',
        description:
          'Kunjungi spot pandang alam di area perbukitan Jogja dengan instalasi kayu artistik dan panorama hijau yang luas. Cocok untuk perjalanan santai, berburu foto, dan menikmati suasana alam dari ketinggian.',
      },
    ],
  },
  culture: {
    titlePatterns: [
      'Borobudur Cultural Tour {location}',
      'Traditional Village Experience {location}',
      'Batik Workshop & Heritage Walk {location}',
      'Temple & Local Story Tour {location}',
      'Royal Palace Historical Journey {location}',
    ],
    descriptionPatterns: [
      'Eksplorasi budaya lokal di {location} bersama guide berpengalaman. Paket mencakup kunjungan situs bersejarah dan sesi interaktif.',
      'Wisata budaya di {location} untuk memahami sejarah, tradisi, dan kehidupan masyarakat setempat secara lebih mendalam.',
      'Tur heritage di {location} yang menggabungkan storytelling, aktivitas budaya, dan waktu bebas untuk eksplorasi mandiri.',
    ],
    locations: ['Yogyakarta', 'Ubud', 'Solo', 'Cirebon', 'Magelang'],
    priceRange: { min: 90000, max: 420000 },
    ratingRange: { min: 4.1, max: 4.8 },
    availableSlotsRange: { min: 12, max: 40 },
    featuredProbability: 0.14,
    curatedEntries: [
      {
        title: 'Papua Coastal Drum Performance',
        location: 'Papua Barat',
        description:
          'Saksikan pertunjukan musik tradisional di pesisir Papua dengan nuansa budaya yang kuat dan suasana alam yang khas. Aktivitas ini menghadirkan pengalaman budaya otentik melalui tarian, ritme tifa, dan ekspresi masyarakat lokal.',
      },
      {
        title: 'Kecak Sunset Experience Bali',
        location: 'Uluwatu',
        description:
          'Nikmati pertunjukan tari kecak di Bali saat matahari terbenam dengan latar pura dan panorama laut yang dramatis. Cocok untuk traveler yang ingin menikmati seni pertunjukan ikonik dengan atmosfer yang benar-benar berkesan.',
      },
      {
        title: 'Kampung Adat Cultural Visit Bogor',
        location: 'Bogor',
        description:
          'Kunjungi kawasan kampung adat dengan rumah tradisional dan aktivitas budaya yang ramah untuk keluarga maupun rombongan. Pengalaman ini cocok untuk mengenal nilai-nilai lokal, permainan tradisional, dan interaksi budaya secara langsung.',
      },
      {
        title: 'Pampang Dayak Heritage Parade',
        location: 'Samarinda',
        description:
          'Rasakan semarak parade budaya Dayak dengan busana adat, tarian, dan suasana kampung tradisional yang hidup. Aktivitas ini menawarkan pengalaman heritage yang kaya visual dan penuh cerita tentang identitas lokal Kalimantan.',
      },
      {
        title: 'Borobudur Sunrise Heritage Tour',
        location: 'Magelang',
        description:
          'Eksplor kemegahan Candi Borobudur dengan panorama pagi yang hangat dan suasana heritage yang menenangkan. Cocok untuk penikmat sejarah, fotografi, dan perjalanan budaya yang sarat nilai arsitektur Nusantara.',
      },
      {
        title: 'Dayak Village Cultural Experience Borneo',
        location: 'Kalimantan',
        description:
          'Nikmati kunjungan budaya ke desa tradisional Dayak dengan pertunjukan seni dan momen interaktif bersama warga lokal. Trip ini menghadirkan kombinasi edukasi budaya, suasana hangat komunitas, dan pengalaman yang autentik.',
      },
      {
        title: 'Prambanan Temple Sunset Walk',
        location: 'Yogyakarta',
        description:
          'Jelajahi kawasan Candi Prambanan saat cahaya senja menonjolkan detail arsitektur candi yang megah. Aktivitas ini cocok untuk wisatawan yang ingin menikmati perpaduan sejarah, spiritualitas, dan lanskap budaya yang ikonik.',
      },
    ],
  },
  culinary: {
    titlePatterns: [
      'Bandung Street Food Tour',
      'Jogja Coffee & Culinary Walk',
      'Night Market Food Experience {location}',
      'Local Flavor Tasting Route {location}',
      'Traditional Market Brunch Tour {location}',
    ],
    descriptionPatterns: [
      'Wisata kuliner populer di {location} dengan rute makanan lokal, rekomendasi menu signature, dan cerita asal-usul kuliner daerah.',
      'Paket food tour di {location} untuk mencoba hidangan legendaris, jajanan kaki lima, hingga hidden gem favorit warga lokal.',
      'Cocok untuk food hunter: eksplorasi cita rasa khas {location} dengan itinerary yang santai dan ramah untuk semua usia.',
    ],
    locations: ['Bandung', 'Yogyakarta', 'Jakarta', 'Surabaya', 'Medan'],
    priceRange: { min: 75000, max: 290000 },
    ratingRange: { min: 4.0, max: 4.8 },
    availableSlotsRange: { min: 10, max: 30 },
    featuredProbability: 0.2,
    curatedEntries: [
      {
        title: 'Balinese Traditional Feast Experience',
        location: 'Bali',
        description:
          'Nikmati sajian kuliner khas Bali dengan presentasi tradisional yang kaya warna, rempah, dan cita rasa lokal. Aktivitas ini cocok untuk pencinta makanan yang ingin mengeksplor kekayaan rasa sekaligus nuansa budaya Bali.',
      },
      {
        title: 'Jakarta Night Street Food Crawl',
        location: 'Jakarta',
        description:
          'Jelajahi suasana kuliner malam Jakarta dengan deretan hidangan panas yang dimasak langsung di depan pengunjung. Cocok untuk food hunter yang ingin merasakan energi street food ibu kota yang ramai dan autentik.',
      },
      {
        title: 'Jogja Sate & Angkringan Tasting',
        location: 'Yogyakarta',
        description:
          'Cicipi aneka sate, minuman tradisional, dan suasana khas kuliner malam Jogja dalam perjalanan rasa yang santai. Aktivitas ini pas untuk wisatawan yang ingin menikmati kuliner legendaris dengan atmosfer lokal yang hangat.',
      },
      {
        title: 'Lengkong Culinary Discovery Bandung',
        location: 'Bandung',
        description:
          'Eksplor sisi unik kuliner Bandung melalui ragam sajian khas yang menggugah rasa penasaran dan cocok untuk petualang kuliner. Pengalaman ini menawarkan sensasi mencoba menu berbeda dalam suasana street food yang hidup.',
      },
      {
        title: 'Santo Seaside Dining Escape',
        location: 'Bali',
        description:
          'Nikmati pengalaman bersantap di tempat bernuansa santai dengan pemandangan terbuka yang estetik dan menu yang cocok untuk quality time. Pilihan tepat untuk traveler yang mencari kombinasi kuliner, ambience, dan spot foto menarik.',
      },
      {
        title: 'South Jakarta Social Dining Night',
        location: 'Jakarta Selatan',
        description:
          'Rasakan pengalaman makan malam di restoran bergaya hangat dan modern yang cocok untuk nongkrong bersama teman maupun keluarga. Aktivitas ini menghadirkan kombinasi interior menarik, suasana nyaman, dan pilihan menu yang variatif.',
      },
      {
        title: 'Sudirman Street Food Experience',
        location: 'Bandung',
        description:
          'Kunjungi area kuliner populer Sudirman Street untuk menikmati berbagai tenant makanan dalam satu destinasi yang ramai. Cocok untuk wisatawan yang ingin berburu banyak rasa sekaligus merasakan atmosfer kuliner kota yang semarak.',
      },
    ],
  },
  'city-tour': {
    titlePatterns: [
      'Jakarta City Highlights Tour',
      'Old Town Heritage Walk {location}',
      'Night Lights City Tour {location}',
      'Landmark Hopping Experience {location}',
      'Urban Culture Explorer {location}',
    ],
    descriptionPatterns: [
      'Tur kota komprehensif di {location} yang mencakup landmark utama, area ikonik, dan spot foto favorit wisatawan.',
      'Paket city tour di {location} dengan transportasi nyaman dan jadwal efisien untuk melihat banyak tempat dalam satu hari.',
      'Eksplorasi sisi modern dan historis {location} dalam satu perjalanan, cocok untuk first-time visitor.',
    ],
    locations: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Denpasar'],
    priceRange: { min: 95000, max: 360000 },
    ratingRange: { min: 4.0, max: 4.7 },
    availableSlotsRange: { min: 14, max: 42 },
    featuredProbability: 0.16,
    curatedEntries: [
      {
        title: 'Bandung Heritage Landmark Tour',
        location: 'Bandung',
        description:
          'Jelajahi ikon arsitektur dan suasana kota Bandung melalui kunjungan ke landmark bersejarah yang populer. Aktivitas ini cocok untuk traveler yang ingin menikmati sisi klasik kota sambil berburu foto dan cerita lokal.',
      },
      {
        title: 'Bogor Botanical City Escape',
        location: 'Bogor',
        description:
          'Nikmati city tour santai ke area hijau ikonik Bogor dengan suasana sejuk, taman tertata, dan spot jalan kaki yang menyenangkan. Pilihan tepat untuk wisatawan yang ingin menikmati kombinasi kota dan alam dalam satu perjalanan.',
      },
      {
        title: 'Highland Leisure Tour Bogor',
        location: 'Bogor',
        description:
          'Kunjungi kawasan dataran tinggi sekitar Bogor dengan panorama pegunungan dan udara yang lebih segar dari pusat kota. Cocok untuk perjalanan singkat yang menawarkan nuansa santai, pemandangan terbuka, dan suasana family-friendly.',
      },
      {
        title: 'Jakarta Chinatown Night Walk',
        location: 'Jakarta',
        description:
          'Rasakan atmosfer kawasan Pecinan Jakarta di malam hari dengan lampion, bangunan khas, dan suasana kota yang hidup. Aktivitas ini menghadirkan pengalaman city tour yang kaya visual, budaya, dan spot foto yang menarik.',
      },
      {
        title: 'South Jakarta Skyline Drive',
        location: 'Jakarta Selatan',
        description:
          'Eksplor area modern Jakarta Selatan dengan view gedung tinggi, jalan-jalan utama, dan ritme kota metropolitan yang dinamis. Cocok untuk traveler yang ingin melihat sisi urban Jakarta yang modern dan energik.',
      },
      {
        title: 'Jayapura Waterfront Evening Tour',
        location: 'Jayapura',
        description:
          'Nikmati panorama teluk dan lampu kota Jayapura saat sore menuju malam dalam perjalanan yang tenang dan berkesan. Pilihan tepat untuk menikmati city view tepi laut dengan karakter kota timur Indonesia yang unik.',
      },
      {
        title: 'Malioboro Heritage Street Walk',
        location: 'Yogyakarta',
        description:
          'Jelajahi kawasan Malioboro dan sekitarnya dengan suasana jalanan yang ikonik, bangunan bersejarah, dan denyut wisata kota Jogja yang khas. Aktivitas ini cocok untuk first-time visitor yang ingin merasakan jantung kota Yogyakarta.',
      },
      {
        title: 'Monas & Central Jakarta Highlights',
        location: 'Jakarta Pusat',
        description:
          'Kunjungi kawasan Monas dan area pusat Jakarta untuk menikmati landmark nasional dengan view kota yang luas dan fotogenik. Trip ini pas untuk wisatawan yang ingin melihat simbol utama ibu kota dalam itinerary yang ringkas.',
      },
    ],
  },
  'water-sport': {
    titlePatterns: [
      'Snorkeling Trip {location}',
      'Intro Diving Experience {location}',
      'Jet Ski Adventure {location}',
      'Surf Lesson & Beach Session {location}',
      'Island Hopping by Speedboat {location}',
    ],
    descriptionPatterns: [
      'Aktivitas water sport favorit di {location} dengan peralatan safety lengkap dan instruktur berlisensi.',
      'Nikmati petualangan laut di {location} untuk pemula hingga intermediate, termasuk briefing keselamatan sebelum mulai.',
      'Paket wisata air di {location} dengan kombinasi aktivitas seru dan waktu bebas menikmati pantai.',
    ],
    locations: [
      'Nusa Penida',
      'Lombok',
      'Labuan Bajo',
      'Tanjung Benoa',
      'Gili Trawangan',
    ],
    priceRange: { min: 220000, max: 1350000 },
    ratingRange: { min: 4.3, max: 5.0 },
    availableSlotsRange: { min: 6, max: 24 },
    featuredProbability: 0.24,
    curatedEntries: [
      {
        title: 'Bali Watersport Combo Adventure',
        location: 'Tanjung Benoa',
        description:
          'Nikmati paket watersport seru di Bali dengan kombinasi aktivitas cepat, laut biru, dan suasana liburan yang energik. Cocok untuk traveler yang ingin mencoba lebih dari satu permainan air dalam satu sesi.',
      },
      {
        title: 'Flyboard Action Experience Bali',
        location: 'Bali',
        description:
          'Rasakan sensasi melayang di atas permukaan laut dengan flyboard dalam pengalaman water sport yang penuh adrenalin. Aktivitas ini pas untuk pencari tantangan yang ingin mencoba atraksi modern dengan instruktur pendamping.',
      },
      {
        title: 'Jet Ski Fun Ride Bali',
        location: 'Bali',
        description:
          'Jelajahi perairan tropis Bali dengan jet ski yang memadukan kecepatan, percikan ombak, dan panorama laut terbuka. Pilihan tepat untuk peserta yang ingin menikmati permainan air yang seru namun tetap mudah diikuti.',
      },
      {
        title: 'Jakarta Bay Jet Ski Session',
        location: 'Jakarta',
        description:
          'Nikmati pengalaman jet ski di perairan sekitar Jakarta dengan trek yang dinamis dan suasana aktivitas laut yang ramai. Cocok untuk traveler yang ingin merasakan water sport tanpa harus keluar jauh dari area kota.',
      },
      {
        title: 'Pulau Seribu Jet Ski Escape',
        location: 'Kepulauan Seribu',
        description:
          'Habiskan waktu di perairan Kepulauan Seribu dengan jet ski yang seru dan view laut yang lebih terbuka. Aktivitas ini menghadirkan kombinasi antara petualangan singkat, suasana pulau, dan pengalaman laut yang menyegarkan.',
      },
      {
        title: 'Tanjung Benoa Banana Boat Ride',
        location: 'Tanjung Benoa',
        description:
          'Ajak teman atau keluarga menikmati banana boat di Tanjung Benoa dengan sensasi tawa, cipratan ombak, dan permainan tim yang menyenangkan. Cocok untuk grup yang ingin water activity ringan namun tetap seru.',
      },
    ],
  },
  family: {
    titlePatterns: [
      'Family Holiday Fun Day {location}',
      'Mini Zoo & Playpark Visit {location}',
      'Kids Friendly Nature Trip {location}',
      'Educational Farm Tour {location}',
      'Family Leisure Weekend {location}',
    ],
    descriptionPatterns: [
      'Aktivitas ramah keluarga di {location} dengan agenda santai, aman untuk anak-anak, dan fasilitas lengkap.',
      'Paket family trip di {location} untuk quality time bersama, termasuk area bermain dan aktivitas edukatif.',
      'Liburan keluarga di {location} dengan itinerary fleksibel dan durasi yang nyaman untuk semua anggota keluarga.',
    ],
    locations: ['Bogor', 'Bandung', 'Malang', 'Yogyakarta', 'Batu'],
    priceRange: { min: 100000, max: 520000 },
    ratingRange: { min: 4.1, max: 4.9 },
    availableSlotsRange: { min: 12, max: 50 },
    featuredProbability: 0.15,
    curatedEntries: [
      {
        title: 'Bandung Family Retreat Escape',
        location: 'Bandung',
        description:
          'Nikmati liburan keluarga di area penginapan bernuansa alam dengan suasana tenang, udara sejuk, dan jalur santai untuk berjalan bersama. Cocok untuk family getaway yang mengutamakan quality time dan kenyamanan.',
      },
      {
        title: 'Hillside Leisure Trip Bandung',
        location: 'Bandung',
        description:
          'Habiskan waktu bersama keluarga di kawasan perbukitan dengan pemandangan hijau, spot santai, dan suasana yang ramah anak. Aktivitas ini pas untuk liburan singkat yang rileks tanpa agenda yang terlalu padat.',
      },
      {
        title: 'Puncak Family Glamping Experience',
        location: 'Puncak',
        description:
          'Rasakan pengalaman glamping keluarga dengan view senja yang hangat, area berkumpul yang nyaman, dan atmosfer alam yang menyenangkan. Pilihan tepat untuk keluarga yang ingin staycation dengan nuansa outdoor yang tetap praktis.',
      },
      {
        title: 'Dusun Bambu Family Fun Day',
        location: 'Lembang',
        description:
          'Jelajahi area rekreasi keluarga yang luas dengan taman, spot foto, dan fasilitas santai yang cocok untuk semua usia. Aktivitas ini ideal untuk keluarga yang ingin menikmati liburan aktif namun tetap nyaman dan teratur.',
      },
      {
        title: 'Lembang Nature Stay Experience',
        location: 'Lembang',
        description:
          'Nikmati suasana asri Lembang dengan akomodasi bernuansa kayu dan lingkungan yang tenang untuk istirahat bersama keluarga. Cocok untuk family trip yang mencari udara segar, suasana hangat, dan ritme liburan yang santai.',
      },
      {
        title: 'Jungle Park Family Walk Lembang',
        location: 'Lembang',
        description:
          'Ajak keluarga berjalan santai di area hutan pinus dengan jalur yang nyaman dan panorama alam yang menenangkan. Aktivitas ini pas untuk quality time ringan sambil menikmati suasana outdoor yang sejuk dan fotogenik.',
      },
      {
        title: 'Pine Forest Cabin Family Camp',
        location: 'Lembang',
        description:
          'Habiskan waktu bersama keluarga di area cabin dan hutan pinus yang teduh dengan nuansa camping yang aman dan menyenangkan. Cocok untuk keluarga yang ingin merasakan pengalaman alam tanpa kehilangan kenyamanan dasar.',
      },
      {
        title: 'Bogor Family Outdoor Games',
        location: 'Bogor',
        description:
          'Nikmati aktivitas ringan di area terbuka hijau yang cocok untuk permainan kelompok, bonding, dan momen seru bersama keluarga. Pilihan tepat untuk agenda santai yang tetap aktif dan melibatkan semua peserta.',
      },
      {
        title: 'Sentul Gathering Family Session',
        location: 'Sentul',
        description:
          'Bangun kebersamaan lewat sesi gathering di ruang terbuka dengan permainan kelompok, suasana santai, dan area yang nyaman untuk interaksi. Aktivitas ini cocok untuk family outing maupun rombongan besar lintas usia.',
      },
      {
        title: 'Taman Mini Family Event Day',
        location: 'Jakarta',
        description:
          'Habiskan hari keluarga di destinasi ikonik Jakarta dengan area luas, fasilitas acara, dan suasana yang cocok untuk kegiatan bersama. Cocok untuk keluarga yang ingin agenda ringan, terorganisir, dan mudah dijangkau dari pusat kota.',
      },
    ],
  },
};

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

function getSeedTemplateByCategory(
  category: ActivityCategory,
): CategorySeedTemplate {
  return categorySeedTemplates[category];
}

function generateActivityByCategory(
  category: ActivityCategory,
  categoryIndex: number,
  sequenceIndex: number,
  total: number,
  now: Date,
): Partial<ActivitiesEntity> {
  const template = getSeedTemplateByCategory(category);
  const curatedEntry = template.curatedEntries?.[
    categoryIndex % template.curatedEntries.length
  ];
  const location = curatedEntry?.location ??
    faker.helpers.arrayElement(template.locations);
  const title =
    curatedEntry?.title ??
    interpolate(faker.helpers.arrayElement(template.titlePatterns), {
      location,
    });
  const description =
    curatedEntry?.description ??
    interpolate(faker.helpers.arrayElement(template.descriptionPatterns), {
      location,
    });
  const availableSlots = faker.number.int({
    min: template.availableSlotsRange.min,
    max: template.availableSlotsRange.max,
  });
  const maxCurrentParticipants = Math.max(1, Math.floor(availableSlots * 0.78));
  const currentParticipants = faker.number.int({
    min: 0,
    max: maxCurrentParticipants,
  });
  const createdAt = new Date(now);
  createdAt.setDate(now.getDate() - (total - sequenceIndex));

  return {
    title,
    description,
    category,
    location,
    price: faker.number.int({
      min: template.priceRange.min,
      max: template.priceRange.max,
    }),
    availableSlots,
    currentParticipants,
    imageUrl: getImageByCategory(category, categoryIndex),
    isFeatured:
      sequenceIndex % 7 === 0 ||
      faker.datatype.boolean(template.featuredProbability ?? 0.15),
    rating: Number(
      faker.number.float({
        min: template.ratingRange.min,
        max: template.ratingRange.max,
        fractionDigits: 1,
      }),
    ),
    isActive: sequenceIndex % 12 !== 0,
    createdAt,
    updatedAt: createdAt,
  };
}

function shuffleArray<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = faker.number.int({ min: 0, max: i });
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function buildCategorySequence(
  total: number,
  mode: SeedDistributionMode,
): ActivityCategory[] {
  if (mode === 'random') {
    return Array.from({ length: total }, () =>
      faker.helpers.arrayElement(categories),
    );
  }

  const baseCount = Math.floor(total / categories.length);
  const remainder = total % categories.length;

  const sequence: ActivityCategory[] = [];

  categories.forEach((category) => {
    for (let i = 0; i < baseCount; i++) {
      sequence.push(category);
    }
  });

  const shuffledCategories = shuffleArray([...categories]);
  for (let i = 0; i < remainder; i++) {
    sequence.push(shuffledCategories[i]);
  }

  return shuffleArray(sequence);
}

function createActivitiesSeedData(total: number): Partial<ActivitiesEntity>[] {
  const now = new Date();
  const allCategoriesCurated = categories.every(
    (category) =>
      (categorySeedTemplates[category].curatedEntries?.length ?? 0) > 0,
  );

  if (allCategoriesCurated) {
    const curatedCategorySequence = shuffleArray(
      categories.flatMap((category) =>
        Array.from(
          {
            length: categorySeedTemplates[category].curatedEntries?.length ?? 0,
          },
          () => category,
        ),
      ),
    );
    const perCategoryIndex = Object.fromEntries(
      categories.map((category) => [category, 0]),
    ) as Record<ActivityCategory, number>;

    return curatedCategorySequence.map((category, sequenceIndex) => {
      const categoryIndex = perCategoryIndex[category];
      perCategoryIndex[category] += 1;

      return generateActivityByCategory(
        category,
        categoryIndex,
        sequenceIndex,
        curatedCategorySequence.length,
        now,
      );
    });
  }

  const categorySequence = buildCategorySequence(
    total,
    ACTIVITY_DISTRIBUTION_MODE,
  );
  const perCategoryIndex = Object.fromEntries(
    categories.map((category) => [category, 0]),
  ) as Record<ActivityCategory, number>;

  return Array.from({ length: total }, (_, sequenceIndex) => {
    const category = categorySequence[sequenceIndex];
    const categoryIndex = perCategoryIndex[category];
    perCategoryIndex[category] += 1;

    return generateActivityByCategory(
      category,
      categoryIndex,
      sequenceIndex,
      total,
      now,
    );
  });
}

async function seedActivities() {
  const repository = AppDataSource.getRepository(ActivitiesEntity);

  try {
    await AppDataSource.query(
      'TRUNCATE TABLE "activities" RESTART IDENTITY CASCADE',
    );
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
