import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    return this.todoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  addNewTodos(dto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepo.create({
      title: dto.title,
    });

    return this.todoRepo.save(todo);
  }

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }

  async deleteTodo(id: number): Promise<string | void> {
    const res = await this.todoRepo.delete(id);

    if (res?.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return `your todo with id ${id} is deleted successfully`;
  }
}
