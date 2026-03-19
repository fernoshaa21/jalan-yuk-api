import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterActivitiesTableForBookingApp1710719280000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table) {
      return;
    }

    if (!table.findColumnByName('isFeatured')) {
      await queryRunner.addColumn(
        'activities',
        new TableColumn({
          name: 'isFeatured',
          type: 'boolean',
          default: false,
          isNullable: false,
        }),
      );
    }

    if (!table.findColumnByName('category')) {
      await queryRunner.addColumn(
        'activities',
        new TableColumn({
          name: 'category',
          type: 'varchar',
          default: "'adventure'",
          isNullable: false,
        }),
      );
    }

    if (!table.findColumnByName('rating')) {
      await queryRunner.addColumn(
        'activities',
        new TableColumn({
          name: 'rating',
          type: 'numeric',
          precision: 3,
          scale: 1,
          default: 0,
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table) {
      return;
    }

    if (table.findColumnByName('rating')) {
      await queryRunner.dropColumn('activities', 'rating');
    }

    if (table.findColumnByName('category')) {
      await queryRunner.dropColumn('activities', 'category');
    }

    if (table.findColumnByName('isFeatured')) {
      await queryRunner.dropColumn('activities', 'isFeatured');
    }
  }
}
