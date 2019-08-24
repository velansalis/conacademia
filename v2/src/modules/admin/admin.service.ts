import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class AdminService {
    constructor(@InjectModel('User') private readonly userModel) {}

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
