import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    // constructor(@InjectModel('User') private readonly userModel) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            message: exception.message,
            method: request.method,
            path: request.url,
            timestamp: new Date(),
        };

        if (exception.name === 'TokenExpiredError') {
            console.log('error');
            let obj = request.body.username || request.query.username;
        }

        Logger.error(`${request.method} ${request.url}`);
        response.status(status).json(errorResponse);
    }
}
