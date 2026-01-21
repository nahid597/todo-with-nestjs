import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TodoResponseDto } from './dto/todo-response.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(user_id: number): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepo.find({
      order: { createdAt: 'DESC' },
      where: { user: { id: user_id } },
      relations: ['user'],
    });

    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
      userId: todo.user.id,
    }));
  }

  async addNewTodos(dto: CreateTodoDto): Promise<TodoEntity> {
    const user = await this.userRepo.findOneBy({ id: dto.user_id });

    if (!user) {
      throw new NotFoundException(`User with id ${dto.user_id} not found`);
    }
    const todo = this.todoRepo.create({
      title: dto.title,
      user: user,
    });

    return this.todoRepo.save(todo);
  }

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const user = await this.userRepo.findOneBy({ id: dto.user_id });

    if (dto.user_id && !user) {
      throw new NotFoundException(`User with id ${dto.user_id} not found`);
    }
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
