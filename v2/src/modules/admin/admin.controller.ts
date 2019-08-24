import { Controller, Post, Body, Delete, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserDTO } from '../user/user.dto';
import { AdminGuard } from './admin.guard';
import { CourseDTO } from '../course/course.dto';

@Controller()
// @UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    /**
     * Grants permission to users.
     * @param roledata { username, role [user,course] }
     */
    @Post('grant')
    async addAdmin(@Body() roledata: Partial<UserDTO>): Promise<object> {
        let data = await this.adminService.grant(roledata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }

    /**
     * Adds a new course with course id and course title.
     * @param coursedata { course_id, course_title, credits, year, semester, faculty_incharge }
     */
    @Post('course')
    async addCourse(@Body() coursedata: CourseDTO) {
        return { message: 'Adding course' + coursedata };
    }

    /**
     * Deletes a course.
     * @param courseid { course_id }
     */
    @Delete('course/:courseid')
    async deleteCourse(@Param() courseid) {
        return { message: 'Deleting course ' + courseid };
    }
}
