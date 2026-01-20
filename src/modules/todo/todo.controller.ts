import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  getTodos(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
  }

  @Post()
  addNewTodo(@Body() dto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoService.addNewTodos(dto);
  }

  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return this.todoService.updateTodo(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeTodo(@Param('id', ParseIntPipe) id: number): Promise<string | void> {
    return this.todoService.deleteTodo(id);
  }
}
