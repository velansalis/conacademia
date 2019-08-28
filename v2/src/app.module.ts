import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './modules/course/course.module';

import { MongooseModule } from '@nestjs/mongoose';
import { HttpErrorFilter } from './filters/http.exception';

import { APP_FILTER } from '@nestjs/core';
import 'dotenv/config';
@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.DATABASE, useNewUrlParser: true }),
        UserModule,
        AuthModule,
        CourseModule,
    ],
    providers: [{ provide: APP_FILTER, useClass: HttpErrorFilter }],
})
export class AppModule {}
