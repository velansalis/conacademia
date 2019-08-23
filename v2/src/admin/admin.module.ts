import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './admin.schema';
import { UserSchema } from '../user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Admin',
                schema: AdminSchema,
            },
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
    ],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}