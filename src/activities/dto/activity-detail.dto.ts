/* eslint-disable @typescript-eslint/no-unsafe-call */
export class ActivityDetailDto {
  id: number;

  title: string;

  description: string;

  price: number;

  location: string;

  availableSlots: number;

  imageUrl: string | null;

  isFeatured: boolean;

  category: string;

  rating: number;

  availableDates: string[];

  currentParticipants: number;

  maxParticipants: number;
}
