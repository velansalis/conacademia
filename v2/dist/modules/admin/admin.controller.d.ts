import { AdminService } from './admin.service';
import { UserDTO } from '../user/user.dto';
import { CourseDTO } from '../course/course.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(roledata: Partial<UserDTO>): Promise<object>;
    addCourse(coursedata: CourseDTO): Promise<{
        message: string;
    }>;
    deleteCourse(courseid: any): Promise<{
        message: string;
    }>;
}
