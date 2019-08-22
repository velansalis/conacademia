import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './user.dto';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel) {}

    private getTokenData(request): any {
        let token: any = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], 'supersecret');
        return token;
    }

    private getPivotData(request): string {
        return request.params.username || request.body.username;
    }

    private async isValidToken(request): Promise<boolean> {
        if (!request.headers.authorization) return false;
        var data = this.getTokenData(request);
        if (data[0] == 'Bearer' && data[1]) return true;
        else return false;
    }

    private async isValidOwner(request): Promise<boolean> {
        let user: UserDTO;
        let data = this.getTokenData(request)[1];
        let pivot = this.getPivotData(request);
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            user = await this.userModel
                .findOne({ username: pivot, owner: data.username })
                .lean()
                .exec();
            if (!user) return false;
        }
        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        return this.isValidToken(request) && (await this.isValidOwner(request));
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}
