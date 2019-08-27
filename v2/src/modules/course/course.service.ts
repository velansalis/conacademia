import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CourseDTO } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class CourseService {
    constructor(@InjectModel('User') private readonly userModel, @InjectModel('Course') private readonly courseModel) {}

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
            let course = await this.courseModel(coursedata);
            await course.save();
            return course;
        } catch (err) {
            throw err;
        }
    }

    async deleteCourse(coursedata, course_id): Promise<any> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username: coursedata.username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
            }
            if (!(await bcrypt.compare(coursedata.password, user.password))) {
                throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
            }
            let course = await this.courseModel
                .findOneAndDelete({ course_id: course_id })
                .lean()
                .exec();
            return course;
        } catch (err) {
            throw err;
        }
    }
}
