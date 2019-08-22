import { Injectable, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDTO } from './admin.dto';
import { UserDTO } from '../user/user.dto';
import { AdminGuard } from './admin.guard';

@Injectable()
@UseGuards(AdminGuard)
export class AdminService {
    constructor(@InjectModel('Admin') private readonly adminModel, @InjectModel('User') private readonly userModel) {}

    async addAdmin(admindata: AdminDTO): Promise<object> {
        try {
            let user: UserDTO = await this.userModel
                .findOne({ username: admindata.username })
                .lean()
                .exec();
            if (!user) {
                throw new HttpException(`User ${admindata.username} Does not exists.`, HttpStatus.BAD_REQUEST);
            }
            admindata.adminId = user._id;
            let admin = new this.adminModel(admindata);
            return await admin.save();
        } catch (err) {
            throw err;
        }
    }

    async removeAdmin(admindata: AdminDTO): Promise<boolean> {
        return true;
    }
}
