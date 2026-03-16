import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Belajar NestJS',
      description: 'Mempelajari dasar-dasar framework NestJS',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'Membuat REST API',
      description: 'Membuat REST API untuk manajemen tugas',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: '3',
      title: 'Setup Database',
      description: 'Konfigurasi koneksi database PostgreSQL',
      status: TaskStatus.DONE,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task | undefined {
    const task = this.getTaskById(id);
    if (task) {
      task.status = status;
    }
    return task;
  }
}
