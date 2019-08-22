import { AdminDTO } from './admin.dto';
export declare class AdminService {
    private readonly adminModel;
    private readonly userModel;
    constructor(adminModel: any, userModel: any);
    addAdmin(admindata: AdminDTO): Promise<object>;
    removeAdmin(admindata: AdminDTO): Promise<boolean>;
}
