import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CourseDTO } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../user/user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class CourseService {
    constructor(@InjectModel('User') private readonly userModel, @InjectModel('Course') private readonly courseModel) {}

    async getCourse(course_id: string): Promise<any> {
        let course = await this.courseModel
            .findOne({ course_id })
            .lean()
            .exec();
        if (!course) throw new HttpException(`Course ${course_id} does not exists.`, HttpStatus.BAD_REQUEST);
        let { marks, _id, __v, student_details, ...response } = course;
        return response;
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

    async editCourse(courseid, coursedata) {
        let { _id, course_id, student_details, __v, ...data } = coursedata;

        let course = await this.courseModel
            .findOneAndUpdate({ course_id: courseid }, data, { new: true, useFindAndModify: true })
            .lean()
            .exec();

        if (!course) throw new HttpException(`Course ${courseid} does not exists.`, HttpStatus.BAD_REQUEST);

        return course;
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

    async addStudentDetail(courseid, coursedata) {
        let course = await this.courseModel
            .findOne({ course_id: courseid })
            .lean()
            .exec();
        if (!course) throw new HttpException(`Course ${courseid} does not exists.`, HttpStatus.BAD_REQUEST);

        let student = await this.userModel
            .findOne({ username: coursedata.usn })
            .lean()
            .exec();
        if (!student) throw new HttpException(`User ${coursedata.usn} doesn't exists`, HttpStatus.BAD_REQUEST);
        if (student.designation != 'student') throw new HttpException(`User ${coursedata.usn} is not a student`, HttpStatus.BAD_REQUEST);

        let student_details = course.student_details.filter((student) => student.usn == coursedata.usn );
        if(!student_details.length) {
            course = await this.courseModel
            .findOneAndUpdate(
                { course_id: courseid }, 
                { $push: { student_details: { usn: coursedata.usn } } }, 
                { new: true }
            )
            .lean()
            .exec();
        }

        let studentdata = {
            exam_name: coursedata.exam_name,
            acquired_marks: coursedata.acquired_marks,
            total_marks: coursedata.total_marks,
        }
        return course;
    }

    async deleteStudentDetail() {
        return { message: 'Delete Details' };
    }
}
