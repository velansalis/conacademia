import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { CourseGuard } from '../../guards/course.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { CourseService } from './course.service';
import { CourseDTO } from './course.dto';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @UseGuards(CourseGuard)
    @Get(':courseid')
    async getCourse() {
        return { message: 'Getting course' };
    }

    @UseGuards(CourseGuard)
    @Patch(':courseid')
    async editCourse() {
        return { message: 'Editing course' };
    }

    @UseGuards(AdminGuard)
    @Post('course')
    async addCourse(@Body() coursedata: CourseDTO) {
        let response = await this.courseService.addCourse(coursedata);
        return {
            message: 'Course successfully added',
            data: response,
        };
    }

    @UseGuards(AdminGuard)
    @Delete('course/:courseid')
    async deleteCourse(@Body() coursedata: Partial<CourseDTO>, @Param() courseid: string): Promise<object> {
        let response = await this.courseService.deleteCourse(coursedata, courseid);
        return {
            message: 'Course successfully deleted',
            data: response,
        };
    }
}
