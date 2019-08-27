import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../modules/user/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel) {}

    private async validateRequest(request): Promise<boolean> {
        try {
            let token: any = request.headers.authorization ? request.headers.authorization.split(' ')[1] : null;
            let tokendata = jwt.verify(token, process.env.TOKEN_SECRET);
            if (tokendata.scope == 'admin') return true;
            let pivot = request.params.username || request.body.username;

            if (request.method == 'PATCH') {
                if (request.body.designation || request.body.scope)
                    throw new HttpException('Designation / scope can not be changed', HttpStatus.BAD_REQUEST);
                let user: UserDTO = await this.userModel
                    .findOne({ username: pivot, owner: tokendata.username })
                    .lean()
                    .exec();
                if (!user) return false;
            }
            return true;
        } catch (err) {
            throw err;
        }
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}
