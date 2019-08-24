import { Controller, Post, Body, Delete, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserDTO } from '../user/user.dto';
import { AdminGuard } from './admin.guard';
import { CourseDTO } from '../course/course.dto';

@Controller()
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('course')
    async addCourse(@Body() coursedata: CourseDTO) {
        return { message: 'Adding course' + coursedata };
    }

    @Delete('course/:courseid')
    async deleteCourse(@Param() courseid) {
        return { message: 'Deleting course ' + courseid };
    }
}
