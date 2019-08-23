import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { HttpErrorFilter } from './filters/http.exception';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';

import 'dotenv/config';
@Module({
    imports: [
        UserModule,
        AuthModule,
        AdminModule,
        MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.DATABASE, useNewUrlParser: true }),
    ],
    providers: [{ provide: APP_FILTER, useClass: HttpErrorFilter }],
})
export class AppModule {}
