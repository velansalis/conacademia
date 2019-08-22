import { AdminDTO } from './admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(admindata: AdminDTO): Promise<object>;
}
