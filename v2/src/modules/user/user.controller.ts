import { Controller, UseFilters, UseGuards, Post } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { Req, Param, Body } from '@nestjs/common';
import { Request } from 'express';

import { HttpErrorFilter } from '../../filters/http.exception';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserGuard } from '../../guards/user.guard';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('user')
@UseFilters(HttpErrorFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':username')
    @UseGuards(UserGuard)
    async getUser(@Param('username') username: string): Promise<Object> {
        console.log(username);
        let response = await this.userService.getUser(username);
        return { data: response };
    }

    @Patch(':username')
    @UseGuards(UserGuard)
    async editUser(@Req() request: Request, @Body() userdata: Partial<UserDTO>): Promise<Object> {
        const username: string = request.params.username;
        let response = await this.userService.editUser(username, userdata);
        return { data: response };
    }

    @Post('grant')
    @UseGuards(AdminGuard)
    async addAdmin(@Body() userdata: Partial<UserDTO>): Promise<object> {
        let data = await this.userService.grantPermission(userdata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }
}
