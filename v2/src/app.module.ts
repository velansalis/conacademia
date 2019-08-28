import 'dotenv/config';

import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './modules/course/course.module';

import { HttpErrorFilter } from './globals/http.exception';
import { LogInterceptor } from './globals/log.interceptor';
import { MongooseModule } from '@nestjs/mongoose';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.DATABASE, useNewUrlParser: true }),
        AuthModule,
        UserModule,
        CourseModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LogInterceptor,
        },
    ],
})
export class AppModule {}
