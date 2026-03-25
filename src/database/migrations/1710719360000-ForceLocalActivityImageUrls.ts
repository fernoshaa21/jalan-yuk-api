import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForceLocalActivityImageUrls1710719360000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE activities
      SET "imageUrl" = CONCAT(
        '/uploads/activities/',
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
        '.jpg'
      )
      WHERE "imageUrl" IS NULL
         OR TRIM("imageUrl") = ''
         OR "imageUrl" ILIKE '%source.unsplash.com%'
         OR "imageUrl" ILIKE '%images.unsplash.com%'
         OR "imageUrl" ILIKE '%picsum.photos%'
         OR NOT (
           "imageUrl" ~* '^/uploads/activities/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
         );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE activities
      SET "imageUrl" = NULL
      WHERE "imageUrl" ~* '^/uploads/activities/[a-z0-9-]+\.(jpg|jpeg|png|webp)$';
    `);
  }
}
