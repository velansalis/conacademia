import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';
import { AdminSchema } from '../admin/admin.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
            {
                name: 'Admin',
                schema: AdminSchema,
            },
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
