import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            message:
                status !== HttpStatus.INTERNAL_SERVER_ERROR
                    ? exception.message.error || exception.message || null
                    : 'Internal server error',
            method: request.method,
            path: request.url,
            timestamp: new Date(),
        };
        Logger.error(`${request.method} ${request.url}`);
        response.status(status).json(errorResponse);
    }
}
