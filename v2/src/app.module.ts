import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpErrorFilter } from './filters/http.exception';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { MongoExceptionFilter } from './filters/mongo.exception';
@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb+srv://velanmax:nmQwk34BCzmElvIw@mcaproject-5bdfh.mongodb.net/conacademia?retryWrites=true&w=majority',
            { dbName: 'conacademia', useNewUrlParser: true },
        ),
        UserModule,
        AuthModule,
        AdminModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: HttpErrorFilter },
        { provide: APP_FILTER, useClass: MongoExceptionFilter },
    ],
})
export class AppModule {}
