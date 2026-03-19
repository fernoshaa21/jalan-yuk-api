import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePaymentsTable1710719300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('payments');
    if (hasTable) {
      return;
    }

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'booking_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'method',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'paymentStatus',
            type: 'enum',
            enum: ['pending', 'paid', 'cancelled'],
            enumName: 'payments_payment_status_enum',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'paidAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'externalRef',
            type: 'varchar',
            length: '100',
            isNullable: true,
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
      'payments',
      new TableForeignKey({
        name: 'FK_payments_booking_id_bookings_id',
        columnNames: ['booking_id'],
        referencedTableName: 'bookings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_STATUS',
        columnNames: ['paymentStatus'],
      }),
    );

    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_payments_externalRef',
        columnNames: ['externalRef'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('payments');
    if (!hasTable) {
      return;
    }

    await queryRunner.dropIndex('payments', 'IDX_payments_externalRef');
    await queryRunner.dropIndex('payments', 'IDX_PAYMENTS_CREATED_AT');
    await queryRunner.dropIndex('payments', 'IDX_PAYMENTS_STATUS');
    await queryRunner.dropForeignKey(
      'payments',
      'FK_payments_booking_id_bookings_id',
    );
    await queryRunner.dropTable('payments');
    await queryRunner.query(
      'DROP TYPE IF EXISTS "payments_payment_status_enum"',
    );
  }
}
