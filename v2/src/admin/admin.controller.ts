import { Controller, Post, Body } from '@nestjs/common';
import { AdminDTO } from './admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    async addAdmin(@Body() admindata: AdminDTO): Promise<object> {
        let data = await this.adminService.addAdmin(admindata);
        console.log(data);
        return data;
    }
}
