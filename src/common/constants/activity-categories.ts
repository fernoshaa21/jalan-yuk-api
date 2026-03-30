export const ACTIVITY_CATEGORIES = [
  'adventure',
  'nature',
  'culture',
  'culinary',
  'city-tour',
  'water-sport',
  'family',
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
