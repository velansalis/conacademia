import { AdminService } from './admin.service';
import { AdminInput } from './admin.types';
export declare class AdminResolver {
    private readonly adminService;
    constructor(adminService: AdminService);
    admin(): Promise<import("./admin.interface").Admin[]>;
    createAdmin(input: AdminInput): Promise<import("./admin.interface").Admin>;
}
