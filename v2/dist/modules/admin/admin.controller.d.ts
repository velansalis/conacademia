import { AdminService } from './admin.service';
import { CourseDTO } from '../course/course.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addCourse(coursedata: CourseDTO): Promise<{
        message: string;
    }>;
    deleteCourse(courseid: any): Promise<{
        message: string;
    }>;
}
