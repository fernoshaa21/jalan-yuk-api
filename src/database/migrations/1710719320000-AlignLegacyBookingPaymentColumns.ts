import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlignLegacyBookingPaymentColumns1710719320000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.alignBookingsTable(queryRunner);
    await this.alignPaymentsTable(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const bookingsTable = await queryRunner.getTable('bookings');

    if (bookingsTable?.findColumnByName('user_id')) {
      const userFk = bookingsTable.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      if (userFk) {
        await queryRunner.dropForeignKey('bookings', userFk);
      }

      await queryRunner.renameColumn('bookings', 'user_id', 'userId');

      await queryRunner.createForeignKey(
        'bookings',
        new TableForeignKey({
          name: 'FK_bookings_userId_users_id',
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const refreshedBookingsTable = await queryRunner.getTable('bookings');
    if (refreshedBookingsTable?.findColumnByName('activity_id')) {
      const activityFk = refreshedBookingsTable.foreignKeys.find((fk) =>
        fk.columnNames.includes('activity_id'),
      );
      if (activityFk) {
        await queryRunner.dropForeignKey('bookings', activityFk);
      }

      await queryRunner.renameColumn('bookings', 'activity_id', 'activityId');

      await queryRunner.createForeignKey(
        'bookings',
        new TableForeignKey({
          name: 'FK_bookings_activityId_activities_id',
          columnNames: ['activityId'],
          referencedTableName: 'activities',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );
    }

    const paymentsTable = await queryRunner.getTable('payments');
    if (paymentsTable?.findColumnByName('booking_id')) {
      const bookingFk = paymentsTable.foreignKeys.find((fk) =>
        fk.columnNames.includes('booking_id'),
      );
      if (bookingFk) {
        await queryRunner.dropForeignKey('payments', bookingFk);
      }

      await queryRunner.renameColumn('payments', 'booking_id', 'bookingId');

      await queryRunner.createForeignKey(
        'payments',
        new TableForeignKey({
          name: 'FK_payments_bookingId_bookings_id',
          columnNames: ['bookingId'],
          referencedTableName: 'bookings',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  private async alignBookingsTable(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('bookings');
    if (!table) {
      return;
    }

    if (
      table.findColumnByName('userId') &&
      !table.findColumnByName('user_id')
    ) {
      await queryRunner.renameColumn('bookings', 'userId', 'user_id');
    }

    const afterUserRename = await queryRunner.getTable('bookings');
    if (!afterUserRename) {
      return;
    }

    if (
      afterUserRename.findColumnByName('activityId') &&
      !afterUserRename.findColumnByName('activity_id')
    ) {
      await queryRunner.renameColumn('bookings', 'activityId', 'activity_id');
    }

    const refreshed = await queryRunner.getTable('bookings');
    if (!refreshed) {
      return;
    }

    const userForeignKeys = refreshed.foreignKeys.filter((fk) =>
      fk.columnNames.includes('user_id'),
    );

    for (const fk of userForeignKeys) {
      await queryRunner.dropForeignKey('bookings', fk);
    }

    const activityForeignKeys = refreshed.foreignKeys.filter((fk) =>
      fk.columnNames.includes('activity_id'),
    );

    for (const fk of activityForeignKeys) {
      await queryRunner.dropForeignKey('bookings', fk);
    }

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
  }

  private async alignPaymentsTable(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (!table) {
      return;
    }

    if (
      table.findColumnByName('bookingId') &&
      !table.findColumnByName('booking_id')
    ) {
      await queryRunner.renameColumn('payments', 'bookingId', 'booking_id');
    }

    const refreshed = await queryRunner.getTable('payments');
    if (!refreshed) {
      return;
    }

    const bookingForeignKeys = refreshed.foreignKeys.filter((fk) =>
      fk.columnNames.includes('booking_id'),
    );

    for (const fk of bookingForeignKeys) {
      await queryRunner.dropForeignKey('payments', fk);
    }

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
  }
}
