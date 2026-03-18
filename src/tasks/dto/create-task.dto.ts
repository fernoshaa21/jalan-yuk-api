import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Title tidak boleh kosong' })
  @IsString()
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  title: string;

  @IsNotEmpty({ message: 'Description tidak boleh kosong' })
  @IsString()
  description: string;
}
