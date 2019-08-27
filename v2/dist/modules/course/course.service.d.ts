import { CourseDTO } from './course.dto';
export declare class CourseService {
    private readonly userModel;
    private readonly courseModel;
    constructor(userModel: any, courseModel: any);
    addCourse(coursedata: CourseDTO): Promise<any>;
    deleteCourse(coursedata: any, course_id: any): Promise<any>;
}
