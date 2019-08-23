import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserDTO } from '../user/user.dto';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('grant')
    async addAdmin(@Body() roledata: Partial<UserDTO>): Promise<object> {
        let data = await this.adminService.grant(roledata);
        return {
            message: 'Permissions successfully changed',
            data,
        };
    }
}
