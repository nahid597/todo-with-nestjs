import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsNumber()
  @IsOptional()
  user_id?: number;
}
