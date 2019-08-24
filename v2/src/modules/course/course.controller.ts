import { Controller, Get, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { CourseGuard } from './course.guard';

@Controller('course')
@UseGuards(CourseGuard)
export class CourseController {
    @Get(':courseid')
    async getCourse() {
        return { message: 'Getting course' };
    }

    @Patch(':courseid')
    async editCourse() {
        return { message: 'Editing course' };
    }
}
