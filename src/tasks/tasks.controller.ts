import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // GET /tasks
  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  // GET /tasks/:id
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    const task = this.tasksService.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task dengan id "${id}" tidak ditemukan`);
    }
    return task;
  }

  // POST /tasks
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  // DELETE /tasks/:id
  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  // PATCH /tasks/:id/status
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const task = this.tasksService.updateTaskStatus(
      id,
      updateTaskStatusDto.status,
    );
    if (!task) {
      throw new NotFoundException(`Task dengan id "${id}" tidak ditemukan`);
    }
    return task;
  }
}
