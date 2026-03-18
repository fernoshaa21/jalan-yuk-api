import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity, TaskStatus } from './task.entity';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private repo: Repository<TaskEntity>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  /**
   * Cari semua task dengan status tertentu
   */
  findByStatus(status: TaskStatus): Promise<TaskEntity[]> {
    return this.repo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Cari task terbaru (berdasarkan createdAt)
   */
  findRecentTasks(limit: number = 10): Promise<TaskEntity[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Cari task yang sudah di-complete
   */
  findCompletedTasks(): Promise<TaskEntity[]> {
    return this.repo.find({
      where: {
        status: TaskStatus.DONE,
        isCompleted: true,
      },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Hitung total task per status
   */
  async countByStatus(): Promise<{
    todo: number;
    inProgress: number;
    done: number;
  }> {
    const [todo, inProgress, done] = await Promise.all([
      this.repo.countBy({ status: TaskStatus.TODO }),
      this.repo.countBy({ status: TaskStatus.IN_PROGRESS }),
      this.repo.countBy({ status: TaskStatus.DONE }),
    ]);

    return { todo, inProgress, done };
  }

  /**
   * Search task berdasarkan title atau description
   */
  searchTasks(keyword: string): Promise<TaskEntity[]> {
    return this.repo
      .createQueryBuilder('task')
      .where('task.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('task.createdAt', 'DESC')
      .getMany();
  }
}
