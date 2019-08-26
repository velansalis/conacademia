import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDTO } from '../course/course.dto';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(@InjectModel('User') private readonly userModel, @InjectModel('Course') private readonly courseModel) {}

    private async isPasswordValid(plaintext, hashedtext): Promise<boolean> {
        let valid = await bcrypt.compare(plaintext, hashedtext);
        return Boolean(valid);
    }

    async addCourse(coursedata: CourseDTO): Promise<any> {
        try {
            let user = await this.userModel
                .findOne({ username: coursedata.faculty_incharge })
                .lean()
                .exec();

            if (!user) throw new HttpException("Faculty Incharge doesn't exists", HttpStatus.BAD_REQUEST);
            if (user.designation != 'faculty')
                throw new HttpException(`${user.username} is not a faculty`, HttpStatus.BAD_REQUEST);

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
                throw new HttpException('User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(coursedata.password, user.password))) {
                throw new HttpException('Invalid password.', HttpStatus.BAD_REQUEST);
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
