import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class AdminService {
    constructor(@InjectModel('User') private readonly userModel) {}
}
