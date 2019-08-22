import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http.exception';
import { AuthModule } from './auth/auth.module';
@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb+srv://velanmax:nmQwk34BCzmElvIw@mcaproject-5bdfh.mongodb.net/conacademia?retryWrites=true&w=majority',
            { dbName: 'conacademia', useNewUrlParser: true },
        ),
        UserModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
    ],
})
export class AppModule {}
