import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = exception.message;
        let method = request.method;
        let path = request.url;
        let timestamp = new Date();

        switch (exception.name) {
            case 'CastError':
                message = exception.message.replace(/"/g, "'");
                break;
            case 'TokenExpiredError':
                message = 'Access token has expired';
                break;
        }

        const errorResponse = { message, method, path, timestamp };
        Logger.debug(`${request.method} ${request.url}`);
        response.status(status).json(errorResponse);
    }
}
