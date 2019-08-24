import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseSchema } from './course.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Course',
                schema: CourseSchema,
            },
        ]),
    ],
    providers: [CourseService],
    controllers: [CourseController],
})
export class CourseModule {}
