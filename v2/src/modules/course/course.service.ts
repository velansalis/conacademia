import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CourseDTO } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class CourseService {
    constructor(@InjectModel('User') private readonly userModel, @InjectModel('Course') private readonly courseModel) {}

    async getCourse(course_id: string): Promise<any> {
        let course = await this.courseModel
            .findOne({ course_id })
            .lean()
            .exec();
        if (!course) throw new HttpException(`Course ${course_id} does not exists.`, HttpStatus.BAD_REQUEST);
        let { marks, _id, __v, ...response } = course;
        return response;
    }

    async editCourse(course_id, coursedata) {
        return { msg: `Method not implemented ${course_id} | ${coursedata}` };
    }

    async addCourse(coursedata: CourseDTO): Promise<any> {
        try {
            let user = await this.userModel
                .findOne({ username: coursedata.faculty_incharge })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException("Faculty Incharge doesn't exists", HttpStatus.BAD_REQUEST);
            }
            if (user.designation != 'faculty') {
                throw new HttpException(`${user.username} is not a faculty`, HttpStatus.BAD_REQUEST);
            }
            let course = await this.courseModel(coursedata).save();
            let { _id, __v, marks, student_details, ...response } = course['_doc'];
            return response;
        } catch (err) {
            throw err;
        }
    }

    async deleteCourse(username, password, course_id): Promise<any> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
            }
            if (!(await bcrypt.compare(password, user.password))) {
                throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
            }
            let course = await this.courseModel
                .findOneAndDelete({ course_id: course_id })
                .lean()
                .exec();
            if (!course) throw new HttpException(`Course ${course_id} doesn't exists`, HttpStatus.BAD_REQUEST);
            let { __v, _id, student_details, ...response } = course;
            return response;
        } catch (err) {
            throw err;
        }
    }
}
