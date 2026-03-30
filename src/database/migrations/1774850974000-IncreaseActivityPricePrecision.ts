import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class IncreaseActivityPricePrecision1774850974000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table?.findColumnByName('price')) {
      return;
    }

    await queryRunner.changeColumn(
      'activities',
      'price',
      new TableColumn({
        name: 'price',
        type: 'numeric',
        precision: 12,
        scale: 2,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activities');

    if (!table?.findColumnByName('price')) {
      return;
    }

    await queryRunner.changeColumn(
      'activities',
      'price',
      new TableColumn({
        name: 'price',
        type: 'numeric',
        precision: 10,
        scale: 2,
        isNullable: false,
      }),
    );
  }
}
