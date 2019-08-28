import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDTO } from './course.dto';
import { CourseGuard } from '../../guards/course.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { JWTStrategy } from '../../guards/jwt.guard';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @UseGuards(JWTStrategy, CourseGuard)
    @Get(':course_id')
    async getCourse() {
        return { message: 'Getting course' };
    }

    @UseGuards(JWTStrategy, CourseGuard)
    @Patch(':course_id')
    async editCourse() {
        return { message: 'Editing course' };
    }

    @UseGuards(JWTStrategy, AdminGuard)
    @Post('course')
    async addCourse(@Body() coursedata: CourseDTO) {
        let response = await this.courseService.addCourse(coursedata);
        return {
            message: 'Course successfully added',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, AdminGuard)
    @Delete('course/:course_id')
    async deleteCourse(@Body() coursedata: Partial<CourseDTO>, @Param() courseid: string): Promise<object> {
        let response = await this.courseService.deleteCourse(coursedata, courseid);
        return {
            message: 'Course successfully deleted',
            data: response,
        };
    }
}
