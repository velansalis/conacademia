import { Injectable, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import 'dotenv/config';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel) {}

    private getToken(data: object): string {
        return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '2h' });
    }

    private async isTokenValid(data: object): Promise<any> {
        try {
            let token = jwt.verify(data, process.env.TOKEN_SECRET);
            return token;
        } catch (err) {
            return false;
        }
    }

    private async isPasswordValid(plaintext, hashedtext): Promise<boolean> {
        let valid = await bcrypt.compare(plaintext, hashedtext);
        return Boolean(valid);
    }

    @HttpCode(HttpStatus.CREATED)
    async loginUser(userdata: Partial<UserDTO>): Promise<object> {
        try {
            let user = await this.userModel.findOne({ username: userdata.username }).exec();

            if (!user) {
                throw new HttpException('User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
                throw new HttpException('Invalid password.', HttpStatus.BAD_REQUEST);
            }
            let token = await this.isTokenValid(user.token);
            if (!token || token.scope != user.scope) {
                user.token = this.getToken({
                    username: userdata.username,
                    designation: user.designation,
                    scope: user.scope,
                });
                await this.userModel.updateOne({ username: userdata.username }, { token: user.token }).exec();
                throw new HttpException('Access token has expired. Log in to obtain a new one', HttpStatus.FORBIDDEN);
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

    @HttpCode(HttpStatus.CREATED)
    async registerUser(userdata: UserDTO): Promise<object> {
        try {
            if (userdata.password.length < 8) throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
            let user: any = await this.userModel.findOne({ username: userdata.username }).exec();
            let count = await this.userModel.count();
            if (!user) {
                userdata.password = await bcrypt.hash(userdata.password, 10);
                userdata.age = Math.floor((<any>new Date() - new Date(userdata.dob).getTime()) / 3.15576e10);
                userdata.owner = userdata.username;
                userdata.scope = count == 0 ? 'admin' : userdata.designation == 'student' ? 'user' : 'course';
                userdata.token = await this.getToken({
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

    @HttpCode(HttpStatus.OK)
    async deleteUser(userdata: Partial<UserDTO>): Promise<object> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username: userdata.username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException('User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
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

    @HttpCode(HttpStatus.OK)
    async grant(admindata: Partial<UserDTO>): Promise<object> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username: admindata.username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException(`User ${admindata.username} Does not exists.`, HttpStatus.BAD_REQUEST);
            }
            user = await this.userModel
                .findOneAndUpdate(
                    { username: admindata.username },
                    { scope: admindata.scope },
                    { new: true, runValidators: true },
                )
                .lean()
                .exec();
            let { _id, password, owner, __v, token, ...data } = user;
            return data;
        } catch (err) {
            throw err;
        }
    }
}
