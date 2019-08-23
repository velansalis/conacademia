import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        switch (exception.code) {
            case 11000:
                const context = host.switchToHttp();
                const response = context.getResponse();
                const request = context.getRequest();
                const errorResponse = {
                    message: exception.message,
                    method: request.method,
                    path: request.url,
                    timestamp: new Date(),
                };
                Logger.error(`${request.method} ${request.url}`);
                response.status(status).json(errorResponse);
        }
    }
}
