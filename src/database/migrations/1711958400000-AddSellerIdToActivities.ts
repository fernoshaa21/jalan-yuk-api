import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddSellerIdToActivities1711958400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table) {
      return;
    }

    if (!table.findColumnByName('sellerId')) {
      await queryRunner.addColumn(
        'activities',
        new TableColumn({
          name: 'sellerId',
          type: 'int',
          isNullable: true,
        }),
      );
    }

    const sellerForeignKey = table.foreignKeys.find(
      (foreignKey) => foreignKey.columnNames[0] === 'sellerId',
    );

    if (!sellerForeignKey) {
      await queryRunner.createForeignKey(
        'activities',
        new TableForeignKey({
          name: 'FK_activities_sellerId_users_id',
          columnNames: ['sellerId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }

    const refreshedTable = await queryRunner.getTable('activities');
    const sellerIndex = refreshedTable?.indices.find(
      (index) => index.name === 'IDX_activities_sellerId',
    );

    if (!sellerIndex) {
      await queryRunner.createIndex(
        'activities',
        new TableIndex({
          name: 'IDX_activities_sellerId',
          columnNames: ['sellerId'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table) {
      return;
    }

    const sellerIndex = table.indices.find(
      (index) => index.name === 'IDX_activities_sellerId',
    );

    if (sellerIndex) {
      await queryRunner.dropIndex('activities', sellerIndex);
    }

    const sellerForeignKey = table.foreignKeys.find(
      (foreignKey) => foreignKey.name === 'FK_activities_sellerId_users_id',
    );

    if (sellerForeignKey) {
      await queryRunner.dropForeignKey('activities', sellerForeignKey);
    }

    if (table.findColumnByName('sellerId')) {
      await queryRunner.dropColumn('activities', 'sellerId');
    }
  }
}
