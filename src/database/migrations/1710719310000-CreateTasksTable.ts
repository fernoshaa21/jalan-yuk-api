import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTasksTable1710719310000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('tasks');
    if (hasTable) {
      return;
    }

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'tasks_status_enum',
            enum: ['todo', 'in_progress', 'done'],
            default: "'todo'",
            isNullable: false,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('tasks');
    if (!hasTable) {
      return;
    }

    await queryRunner.dropTable('tasks');
    await queryRunner.query('DROP TYPE IF EXISTS "tasks_status_enum"');
  }
}
