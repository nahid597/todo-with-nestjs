import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsNumber()
  user_id: number;
}
