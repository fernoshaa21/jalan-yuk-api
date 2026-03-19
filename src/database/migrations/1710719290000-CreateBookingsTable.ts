import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBookingsTable1710719290000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('bookings');
    if (hasTable) {
      return;
    }

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'activity_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'bookingDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'qty',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'unitPrice',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'totalPrice',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'confirmed', 'cancelled'],
            enumName: 'bookings_status_enum',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        name: 'FK_bookings_user_id_users_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        name: 'FK_bookings_activity_id_activities_id',
        columnNames: ['activity_id'],
        referencedTableName: 'activities',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_BOOKINGS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_BOOKINGS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('bookings');
    if (!hasTable) {
      return;
    }

    await queryRunner.dropIndex('bookings', 'IDX_BOOKINGS_CREATED_AT');
    await queryRunner.dropIndex('bookings', 'IDX_BOOKINGS_STATUS');
    await queryRunner.dropForeignKey(
      'bookings',
      'FK_bookings_activity_id_activities_id',
    );
    await queryRunner.dropForeignKey(
      'bookings',
      'FK_bookings_user_id_users_id',
    );
    await queryRunner.dropTable('bookings');
    await queryRunner.query('DROP TYPE IF EXISTS "bookings_status_enum"');
  }
}
