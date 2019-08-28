import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from '../modules/user/user.dto';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel) {}

    private async filterRequests(request, username) {
        let method = request.method;
        let pivot = request.params.username || request.body.username;
        switch (method) {
            case 'PATCH':
                if (request.body.designation || request.body.scope)
                    throw new HttpException('Designation / scope can not be changed', HttpStatus.BAD_REQUEST);
                let user: UserDTO = await this.userModel
                    .findOne({ username: pivot, owner: username })
                    .lean()
                    .exec();
                if (!user) return false;
        }
        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        try {
            let tokendata: any = request.user;
            if (tokendata.scope == 'admin') return true;
            return await this.filterRequests(request, tokendata.username);
        } catch (err) {
            throw err;
        }
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}
