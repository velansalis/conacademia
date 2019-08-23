import { Injectable, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../user/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel) {}

    private getToken(data: object): Object {
        return jwt.sign(data, 'supersecret', { expiresIn: '2h' });
    }

    private async isPasswordValid(plaintext, hashedtext): Promise<Boolean> {
        let valid = await bcrypt.compare(plaintext, hashedtext);
        return Boolean(valid);
    }

    @HttpCode(HttpStatus.CREATED)
    async loginUser(userdata: Partial<UserDTO>): Promise<object> {
        try {
            let user = await this.userModel.findOne({ username: userdata.username }).exec();
            if (!user) {
                throw new HttpException('Authorization failed : User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
                throw new HttpException('Authorization failed : Invalid password.', HttpStatus.BAD_REQUEST);
            }
            if (!user.token) {
                user.token = this.getToken({
                    username: userdata.username,
                    designation: user.designation,
                    scope: user.scope,
                });
                let n = await this.userModel.updateOne({ username: userdata.username }, { token: user.token }).exec();
                if (n == 0) throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            let data = {
                username: user.username,
                designation: user.designation,
                token: user.token,
            };
            return data;
        } catch (err) {
            throw err;
        }
    }

    @HttpCode(HttpStatus.CREATED)
    async registerUser(userdata: UserDTO): Promise<object> {
        try {
            if (userdata.password.length < 8) throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
            let user: any = await this.userModel.findOne({ username: userdata.username }).exec();
            if (!user) {
                userdata.password = await bcrypt.hash(userdata.password, 10);
                userdata.age = Math.floor((<any>new Date() - new Date(userdata.dob).getTime()) / 3.15576e10);
                userdata.owner = userdata.username;
                user = new this.userModel(userdata);
                await user.save();
                delete userdata.password;
                delete userdata.owner;
                return userdata;
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
                throw new HttpException('Authorization failed : User Does not exists.', HttpStatus.BAD_REQUEST);
            }
            if (!(await this.isPasswordValid(userdata.password, user.password))) {
                throw new HttpException('Authorization failed : Invalid password.', HttpStatus.BAD_REQUEST);
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
