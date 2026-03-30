import { resolveActivityImageUrl } from './activity-image-map';

describe('resolveActivityImageUrl', () => {
  it('returns local uploads path as-is', () => {
    const imageUrl = '/uploads/activities/adventure-5.jpg';

    expect(resolveActivityImageUrl(imageUrl, 'adventure', 0)).toBe(imageUrl);
  });

  it('returns absolute non-legacy URL as-is', () => {
    const imageUrl = 'https://cdn.example.com/updated-activity-image.jpg';

    expect(resolveActivityImageUrl(imageUrl, 'adventure', 0)).toBe(imageUrl);
  });

  it('falls back for unstable legacy image URLs', () => {
    expect(
      resolveActivityImageUrl(
        'https://picsum.photos/seed/example/1200/800',
        'adventure',
        0,
      ),
    ).toBe('/uploads/activities/adventure-1.jpg');
  });

  it('falls back when image URL is empty', () => {
    expect(resolveActivityImageUrl('', 'family', 1)).toBe(
      '/uploads/activities/family-2.jpg',
    );
  });
});
