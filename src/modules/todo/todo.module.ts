import { Module } from '@nestjs/common';
import { TodosService } from './todo.service';
import { TodosController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {}

// @Module({})
// export class LoggerModule {
//   static forRoot(options): DynamicModule {
//     return {
//       module: LoggerModule,
//       providers: [
//         {
//           provide: 'LOGGER_OPTIONS',
//           useValue: options,
//         },
//         // other service
//       ],
//       exports: [],
//     };
//   }
// }
