import { Model } from 'mongoose';
import { Admin } from './admin.interface';
import { AdminInput } from './admin.types';
export declare class AdminService {
    private readonly adminModel;
    constructor(adminModel: Model<Admin>);
    create(adminInput: AdminInput): Promise<Admin>;
    findAll(): Promise<Admin[]>;
}
