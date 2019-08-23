import { AdminService } from './admin.service';
import { UserDTO } from '../user/user.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(roledata: Partial<UserDTO>): Promise<object>;
}
