import { CourseDTO } from '../course/course.dto';
export declare class AdminService {
    private readonly userModel;
    private readonly courseModel;
    constructor(userModel: any, courseModel: any);
    private isPasswordValid;
    addCourse(coursedata: CourseDTO): Promise<any>;
    deleteCourse(coursedata: any, course_id: any): Promise<any>;
}
