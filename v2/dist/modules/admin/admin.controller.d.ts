import { AdminService } from './admin.service';
import { CourseDTO } from '../course/course.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addCourse(coursedata: CourseDTO): Promise<any>;
    deleteCourse(coursedata: any, courseid: any): Promise<any>;
}
