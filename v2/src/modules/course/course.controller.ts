import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDTO } from './course.dto';
import { CourseGuard } from '../../guards/course.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { JWTStrategy } from '../../guards/jwt.guard';
import { Token } from '../../globals/token.decorator';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @UseGuards(JWTStrategy)
    @Get(':course_id')
    async getCourse(@Param('course_id') course_id) {
        let response = await this.courseService.getCourse(course_id);
        return {
            message: 'Course successfully fetched',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, AdminGuard)
    @Post()
    async addCourse(@Body() coursedata: CourseDTO) {
        let response = await this.courseService.addCourse(coursedata);
        return {
            message: 'Course successfully added',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, AdminGuard)
    @Patch(':course_id')
    async editCourse(@Param('course_id') course_id, @Body() coursedata: Partial<CourseDTO>) {
        let response = await this.courseService.editCourse(course_id, coursedata);
        return {
            message: 'Course successfully edited',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, AdminGuard)
    @Delete(':course_id')
    async deleteCourse(
        @Token('username') username: string,
        @Body('password') password: string,
        @Param('course_id') courseid: string,
    ): Promise<object> {
        let response = await this.courseService.deleteCourse(username, password, courseid);
        return {
            message: 'Course successfully deleted',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, CourseGuard)
    @Post(':course_id')
    async addStudentDetail(@Param('course_id') courseid, @Body() coursedata) {
        let response = await this.courseService.addStudentDetail(courseid, coursedata);
        return {
            message: 'Student details successfully added',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, CourseGuard)
    @Patch(':course_id/:username')
    async editStudentDetail(
        @Param('course_id') course_id: string,
        @Param('username') username: string,
        @Body() coursedata: Partial<CourseDTO>,
    ): Promise<any> {
        let response = await this.courseService.editStudentDetail(course_id, username);
        return {
            message: 'Student details successfully edited',
            data: response,
        };
    }

    @UseGuards(JWTStrategy, CourseGuard)
    @Delete(':course_id/:username')
    async deleteStudentDetail(@Param('course_id') courseid, @Param('username') username) {
        let response = await this.courseService.deleteStudentDetail();
        return {
            message: 'Student details successfully added',
            data: response,
        };
    }
}
