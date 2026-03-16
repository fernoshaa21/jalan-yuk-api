import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.service';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'Status harus salah satu dari: OPEN, IN_PROGRESS, DONE',
  })
  status: TaskStatus;
}
