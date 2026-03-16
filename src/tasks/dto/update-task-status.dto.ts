import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'Status harus salah satu dari: todo, in_progress, done',
  })
  status: TaskStatus;
}
