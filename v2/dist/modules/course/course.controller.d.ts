import { CourseService } from './course.service';
import { CourseDTO } from './course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    getCourse(): Promise<{
        message: string;
    }>;
    editCourse(): Promise<{
        message: string;
    }>;
    addCourse(coursedata: CourseDTO): Promise<{
        message: string;
        data: any;
    }>;
    deleteCourse(coursedata: Partial<CourseDTO>, courseid: string): Promise<object>;
}
