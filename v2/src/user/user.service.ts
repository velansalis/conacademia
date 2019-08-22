import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './types/user.interface';
import { UserDTO } from './types/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    @HttpCode(HttpStatus.OK)
    async getUser(username: string): Promise<User> {
        try {
            let user: Model<User> = await this.userModel
                .findOne({ username: username })
                .lean()
                .exec();
            if (!user) throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
            let { _id, __v, password, token, owner, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }

    @HttpCode(HttpStatus.OK)
    async editUser(username: string, userdata: Partial<UserDTO>): Promise<User> {
        try {
            let user: any;
            user = await this.userModel
                .findOne({ username: username })
                .lean()
                .exec();
            if (userdata.designation && user.designation != 'admin') {
                delete userdata.designation;
                if (Object.keys(userdata).length == 0)
                    throw new HttpException("Designation can't be changed", HttpStatus.BAD_REQUEST);
            }
            if (!user) throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
            user = await this.userModel
                .findOneAndUpdate({ username }, userdata, { new: true })
                .lean()
                .exec();
            let { _id, password, owner, __v, token, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }
}
