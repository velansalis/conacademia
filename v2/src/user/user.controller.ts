import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { Req, Param, Body } from '@nestjs/common';
import { Request } from 'express';

import { HttpErrorFilter } from '../shared/http.exception';
import { UserService } from './user.service';
import { UserDTO } from './types/user.dto';
import { AuthGuard } from '../shared/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
@UseFilters(HttpErrorFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':username')
    async getUser(@Param('username') username: string): Promise<Object> {
        let response = await this.userService.getUser(username);
        return { data: response };
    }

    @Patch(':username')
    async editUser(@Req() request: Request, @Body() userdata: Partial<UserDTO>): Promise<Object> {
        const username: string = request.params.username;
        let response = await this.userService.editUser(username, userdata);
        return { data: response };
    }
}
