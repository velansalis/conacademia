import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserController } from './user.controller';
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
