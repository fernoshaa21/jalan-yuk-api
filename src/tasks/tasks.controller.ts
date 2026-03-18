import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';
import { TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // GET /tasks
  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  // GET /tasks/:id
  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task dengan id "${id}" tidak ditemukan`);
    }
    return task;
  }

  // POST /tasks
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  // DELETE /tasks/:id
  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  // PATCH /tasks/:id/status
  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.tasksService.updateTaskStatus(
      id,
      updateTaskStatusDto.status,
    );
    if (!task) {
      throw new NotFoundException(`Task dengan id "${id}" tidak ditemukan`);
    }
    return task;
  }

  // ============================================================
  // CUSTOM REPOSITORY ENDPOINTS
  // Endpoint di bawah menggunakan custom query methods dari TasksRepository
  // ============================================================

  /**
   * GET /tasks/stats
   * Menggunakan: TasksRepository.countByStatus()
   * Fungsi: Mendapatkan statistik/ringkasan jumlah task per status
   * Response: { todo: number, inProgress: number, done: number }
   */
  @Get('stats')
  getTaskStatistics(): Promise<{
    todo: number;
    inProgress: number;
    done: number;
  }> {
    return this.tasksService.getTaskStatistics();
  }

  /**
   * GET /tasks/recent?limit=5
   * Menggunakan: TasksRepository.findRecentTasks(limit)
   * Fungsi: Mendapatkan N task terbaru (berdasarkan createdAt)
   * Query Param: limit (default: 10)
   */
  @Get('recent')
  getRecentTasks(@Query('limit') limit?: string): Promise<Task[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.tasksService.getRecentTasks(limitNum);
  }

  /**
   * GET /tasks/completed
   * Menggunakan: TasksRepository.findCompletedTasks()
   * Fungsi: Mendapatkan semua task yang sudah completed (status=DONE)
   */
  @Get('completed')
  getCompletedTasks(): Promise<Task[]> {
    return this.tasksService.getCompletedTasks();
  }

  /**
   * GET /tasks/search?q=keyword
   * Menggunakan: TasksRepository.searchTasks(keyword)
   * Fungsi: Mencari task berdasarkan keyword di title atau description
   * Query Param: q (keyword yang dicari)
   */
  @Get('search')
  searchTasks(@Query('q') keyword?: string): Promise<Task[]> {
    if (!keyword) {
      return Promise.resolve([]);
    }
    return this.tasksService.searchTasks(keyword);
  }

  /**
   * GET /tasks/status/:status
   * Menggunakan: TasksRepository.findByStatus(status)
   * Fungsi: Mendapatkan semua task dengan status tertentu
   * Param: status (todo, in_progress, atau done)
   */
  @Get('status/:status')
  getTasksByStatus(@Param('status') status: string): Promise<Task[]> {
    // Validasi status
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new NotFoundException(
        `Status "${status}" tidak valid. Gunakan: ${Object.values(TaskStatus).join(', ')}`,
      );
    }
    return this.tasksService.getTasksByStatus(status as TaskStatus);
  }
}
