import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const userId = request?.headers['x-userId'] || 'anonymous';

    response.setHeader('user-id', userId);

    // modify response
    return next.handle().pipe(
      map((data) => ({
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
