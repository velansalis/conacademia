import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongoose';
export declare class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost): void;
}
