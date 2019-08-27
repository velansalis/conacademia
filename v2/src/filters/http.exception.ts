import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            message: exception.name == 'TokenExpiredError' ? 'Access token has expired' : exception.message,
            method: request.method,
            path: request.url,
            timestamp: new Date(),
        };

        Logger.error(`${request.method} ${request.url}`);
        response.status(status).json(errorResponse);
    }
}
