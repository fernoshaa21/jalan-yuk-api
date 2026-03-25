import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeActivityImageUrlsToSeededPicsum1710719340000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE activities
      SET "imageUrl" = CONCAT(
        'https://picsum.photos/seed/',
        CASE
          WHEN category IN (
            'adventure',
            'nature',
            'culture',
            'culinary',
            'city-tour',
            'water-sport',
            'family'
          )
            THEN category
          ELSE 'adventure'
        END,
        '-',
        ((ABS(id) % 4) + 1)::text,
        '/800/500'
      )
      WHERE "imageUrl" IS NULL
         OR TRIM("imageUrl") = ''
         OR "imageUrl" ILIKE '%source.unsplash.com%'
         OR "imageUrl" ILIKE '%images.unsplash.com%'
         OR NOT (
           "imageUrl" ~* '^https://picsum\\.photos/seed/[a-z0-9-]+/800/500(\\?.*)?$'
         );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE activities
      SET "imageUrl" = NULL
      WHERE "imageUrl" ILIKE 'https://picsum.photos/seed/%/800/500';
    `);
  }
}
