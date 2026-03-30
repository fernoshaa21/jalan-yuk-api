const ACTIVITY_CATEGORIES = [
  'adventure',
  'nature',
  'culture',
  'culinary',
  'city-tour',
  'water-sport',
  'family',
] as const;

const DEFAULT_CATEGORY: ActivityCategory = 'adventure';

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const activityImageMap: Record<ActivityCategory, string[]> = {
  adventure: [
    '/uploads/activities/adventure-1.jpg',
    '/uploads/activities/adventure-2.jpg',
    '/uploads/activities/adventure-3.jpg',
    '/uploads/activities/adventure-4.jpg',
    '/uploads/activities/adventure-5.jpg',
  ],
  nature: [
    '/uploads/activities/nature-1.jpg',
    '/uploads/activities/nature-2.jpg',
    '/uploads/activities/nature-3.jpg',
    '/uploads/activities/nature-4.jpg',
    '/uploads/activities/nature-5.jpg',
    '/uploads/activities/nature-6.jpg',
    '/uploads/activities/nature-7.jpg',
    '/uploads/activities/nature-8.jpg',
  ],
  culture: [
    '/uploads/activities/culture-1.webp',
    '/uploads/activities/culture-2.jpg',
    '/uploads/activities/culture-3.jpg',
    '/uploads/activities/culture-4.jpg',
    '/uploads/activities/culture-5.jpg',
    '/uploads/activities/culture-6.jpg',
    '/uploads/activities/culture-7.jpg',
  ],
  culinary: [
    '/uploads/activities/culinary-1.jpg',
    '/uploads/activities/culinary-2.jpg',
    '/uploads/activities/culinary-3.jpg',
    '/uploads/activities/culinary-4.jpg',
    '/uploads/activities/culinary-5.jpg',
    '/uploads/activities/culinary-6.jpg',
    '/uploads/activities/culinary-7.jpg',
  ],
  'city-tour': [
    '/uploads/activities/city-tour-1.jpg',
    '/uploads/activities/city-tour-2.jpg',
    '/uploads/activities/city-tour-3.jpg',
    '/uploads/activities/city-tour-4.jpg',
    '/uploads/activities/city-tour-5.jpg',
    '/uploads/activities/city-tour-6.jpg',
    '/uploads/activities/city-tour-7.jpg',
    '/uploads/activities/city-tour-8.jpg',
  ],
  'water-sport': [
    '/uploads/activities/water-sport-1.jpg',
    '/uploads/activities/water-sport-2.jpg',
    '/uploads/activities/water-sport-3.jpg',
    '/uploads/activities/water-sport-4.jpg',
    '/uploads/activities/water-sport-5.jpg',
    '/uploads/activities/water-sport-6.jpg',
  ],
  family: [
    '/uploads/activities/family-1.jpg',
    '/uploads/activities/family-2.jpg',
    '/uploads/activities/family-3.jpg',
    '/uploads/activities/family-4.jpg',
    '/uploads/activities/family-5.jpg',
    '/uploads/activities/family-6.jpg',
    '/uploads/activities/family-7.jpg',
    '/uploads/activities/family-8.jpg',
    '/uploads/activities/family-9.jpg',
    '/uploads/activities/family-10.jpg',
  ],
};

function normalizeCategory(category: string): ActivityCategory {
  return Object.prototype.hasOwnProperty.call(activityImageMap, category)
    ? (category as ActivityCategory)
    : DEFAULT_CATEGORY;
}

function isUnstableLegacyImageUrl(url: string): boolean {
  const normalizedUrl = url.toLowerCase();
  return (
    normalizedUrl.includes('images.unsplash.com') ||
    normalizedUrl.includes('source.unsplash.com') ||
    normalizedUrl.includes('picsum.photos')
  );
}

function isLocalUploadsPath(url: string): boolean {
  return /^\/uploads\/activities\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(url);
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function getImageByCategory(category: string, index = 0): string {
  const normalizedCategory = normalizeCategory(category);
  const images = activityImageMap[normalizedCategory];
  const safeIndex = Math.abs(index) % images.length;
  return images[safeIndex];
}

export function resolveActivityImageUrl(
  imageUrl: string | null | undefined,
  category: string,
  index = 0,
): string {
  const normalizedUrl = imageUrl?.trim();

  if (!normalizedUrl) {
    return getImageByCategory(category, index);
  }

  if (isLocalUploadsPath(normalizedUrl)) {
    return normalizedUrl;
  }

  if (
    isAbsoluteUrl(normalizedUrl) &&
    !isUnstableLegacyImageUrl(normalizedUrl)
  ) {
    return normalizedUrl;
  }

  return getImageByCategory(category, index);
}
