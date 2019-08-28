import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        console.log('hey');
        return next;
    }
}
