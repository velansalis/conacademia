import { Controller, Post } from '@nestjs/common';

@Controller('admin')
export class AdminController {
    @Post()
    async addAdmin(): Promise<object> {
        return {};
    }
}
