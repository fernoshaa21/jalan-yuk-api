import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity, TaskStatus } from './task.entity';
import { TasksRepository } from './tasks.repository';

export type Task = TaskEntity;

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getAllTasks(): Promise<TaskEntity[]> {
    return this.tasksRepository.find();
  }

  getTaskById(id: string): Promise<TaskEntity | null> {
    return this.tasksRepository.findOneBy({ id });
  }

  createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.TODO,
    });
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
  ): Promise<TaskEntity | null> {
    await this.tasksRepository.update(id, { status });
    return this.tasksRepository.findOneBy({ id });
  }

  // ============ Custom Query Methods ============

  /**
   * Cari task berdasarkan status tertentu
   */
  getTasksByStatus(status: TaskStatus): Promise<TaskEntity[]> {
    return this.tasksRepository.findByStatus(status);
  }

  /**
   * Ambil task terbaru
   */
  getRecentTasks(limit?: number): Promise<TaskEntity[]> {
    return this.tasksRepository.findRecentTasks(limit);
  }

  /**
   * Ambil task yang sudah completed
   */
  getCompletedTasks(): Promise<TaskEntity[]> {
    return this.tasksRepository.findCompletedTasks();
  }

  /**
   * Hitung statistik task per status
   */
  getTaskStatistics(): Promise<{
    todo: number;
    inProgress: number;
    done: number;
  }> {
    return this.tasksRepository.countByStatus();
  }

  /**
   * Search task berdasarkan keyword
   */
  searchTasks(keyword: string): Promise<TaskEntity[]> {
    return this.tasksRepository.searchTasks(keyword);
  }
}
