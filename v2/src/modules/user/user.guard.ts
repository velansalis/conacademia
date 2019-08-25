import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel) {}

    private getTokenData(request): any {
        let token: any = request.headers.authorization.split(' ');
        token[1] = jwt.verify(token[1], process.env.TOKEN_SECRET);
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
        let token = this.getTokenData(request)[1];
        if (token.scope == 'admin') return true;

        let pivot = this.getPivotData(request);
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            if (request.body.designation || request.body.scope)
                throw new HttpException('Designation / scope can not be changed', HttpStatus.BAD_REQUEST);
            let user: UserDTO = await this.userModel
                .findOne({ username: pivot, owner: token.username })
                .lean()
                .exec();
            if (!user) return false;
        }
        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        return (await this.isValidToken(request)) && (await this.isValidOwner(request));
    }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}
