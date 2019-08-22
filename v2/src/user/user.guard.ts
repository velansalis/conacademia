import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
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

        // If admin, allow
        if (data.admin) return true;

        // If anything else,
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            // Dont allow designation to change
            if (request.body.designation)
                throw new HttpException("Designation can't be changed", HttpStatus.BAD_REQUEST);
            // Check if user owns the document
            user = await this.userModel
                .findOne({ username: pivot, owner: data.username })
                .lean()
                .exec();
            // return false if not owned
            if (!user) return false;
        }

        // For any other requests, GET
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
