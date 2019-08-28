import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../modules/user/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import 'dotenv/config';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel) {}

    private signToken(data: object): any | boolean {
        try {
            return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '2h' });
        } catch (err) {
            return false;
        }
    }

    async loginUser(userdata: Partial<UserDTO>): Promise<object> {
        try {
            let user = await this.userModel.findOne({ username: userdata.username }).exec();
            if (!user) {
                throw new HttpException('User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await bcrypt.compare(userdata.password, user.password))) {
                throw new HttpException('Invalid password.', HttpStatus.BAD_REQUEST);
            }
            try {
                await jwt.verify(user.token, process.env.TOKEN_SECRET);
            } catch (err) {
                user.token = this.signToken({
                    username: userdata.username,
                    designation: user.designation,
                    scope: user.scope,
                });
                await this.userModel.updateOne({ username: userdata.username }, { token: user.token }).exec();
            }
            return {
                username: user.username,
                designation: user.designation,
                token: user.token,
            };
        } catch (err) {
            throw err;
        }
    }

    async registerUser(userdata: UserDTO): Promise<object> {
        try {
            let user: any = await this.userModel.findOne({ username: userdata.username }).exec();
            let count = await this.userModel.count();
            if (!user) {
                userdata.password = await bcrypt.hash(userdata.password, 10);
                userdata.age = Math.floor((<any>new Date() - new Date(userdata.dob).getTime()) / 3.15576e10);
                userdata.scope = count == 0 ? 'admin' : userdata.designation == 'student' ? 'user' : 'course';
                userdata.owner = userdata.username;
                userdata.token = await this.signToken({
                    username: userdata.username,
                    designation: userdata.designation,
                    scope: userdata.scope,
                });
                user = new this.userModel(userdata);
                await user.save();
                let { password, owner, token, ...response } = userdata;
                return response;
            } else {
                throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userdata: Partial<UserDTO>): Promise<object> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username: userdata.username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException('User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await bcrypt.compare(userdata.password, user.password))) {
                throw new HttpException('Invalid password.', HttpStatus.BAD_REQUEST);
            }
            user = await this.userModel
                .findOneAndDelete({ username: userdata.username })
                .lean()
                .exec();
            let { password, _id, __v, owner, token, scope, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }
}
