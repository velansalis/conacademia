import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './user.dto';
import { Model } from 'mongoose';
import { User } from './user.interface';

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
            let { _id, __v, password, token, owner, scope, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }

    @HttpCode(HttpStatus.OK)
    async editUser(username: string, userdata: Partial<UserDTO>): Promise<User> {
        try {
            let user: any = await this.userModel
                .findOne({ username: username })
                .lean()
                .exec();
            if (!user) throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
            user = await this.userModel
                .findOneAndUpdate({ username }, userdata, { new: true })
                .lean()
                .exec();
            let { _id, password, owner, __v, token, scope, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }
}