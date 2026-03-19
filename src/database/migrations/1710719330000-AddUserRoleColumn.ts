import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddUserRoleColumn1710719330000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) {
      return;
    }

    if (!table.findColumnByName('role')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'role',
          type: 'varchar',
          length: '20',
          default: "'user'",
          isNullable: false,
        }),
      );
    }

    const refreshed = await queryRunner.getTable('users');
    if (!refreshed) {
      return;
    }

    const hasRoleIndex = refreshed.indices.some(
      (index) => index.name === 'IDX_users_role',
    );

    if (!hasRoleIndex) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'IDX_users_role',
          columnNames: ['role'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) {
      return;
    }

    const hasRoleIndex = table.indices.some(
      (index) => index.name === 'IDX_users_role',
    );

    if (hasRoleIndex) {
      await queryRunner.dropIndex('users', 'IDX_users_role');
    }

    const refreshed = await queryRunner.getTable('users');
    if (!refreshed) {
      return;
    }

    if (refreshed.findColumnByName('role')) {
      await queryRunner.dropColumn('users', 'role');
    }
  }
}
