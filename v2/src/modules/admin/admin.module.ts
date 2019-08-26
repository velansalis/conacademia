import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';
import { CourseSchema } from '../course/course.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
            {
                name: 'Course',
                schema: CourseSchema,
            },
        ]),
    ],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
