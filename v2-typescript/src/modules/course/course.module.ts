import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseSchema } from './course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Course',
                schema: CourseSchema,
            },
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
    ],
    providers: [CourseService],
    controllers: [CourseController],
})
export class CourseModule {}
