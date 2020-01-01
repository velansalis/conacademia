import { Get, Patch, Post } from '@nestjs/common';
import { Req, Param, Body } from '@nestjs/common';
import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { HttpErrorFilter } from '../../globals/http.exception';

import { JWTStrategy } from '../../guards/jwt.guard';
import { UserGuard } from '../../guards/user.guard';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('user')
@UseFilters(HttpErrorFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':username')
    @UseGuards(JWTStrategy)
    async getUser(@Param('username') username: string): Promise<Object> {
        let response = await this.userService.getUser(username);
        return { data: response };
    }

    @Patch(':username')
    @UseGuards(JWTStrategy, UserGuard)
    async editUser(@Req() request: Request, @Body() userdata: Partial<UserDTO>): Promise<Object> {
        const username: string = request.params.username;
        let response = await this.userService.editUser(username, userdata);
        return { data: response };
    }

    @Post('grant')
    @UseGuards(JWTStrategy, AdminGuard)
    async addAdmin(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let data = await this.userService.grantPermission(userdata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }
}
