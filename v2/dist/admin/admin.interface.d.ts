import { Document } from 'mongoose';
export interface Admin extends Document {
    readonly name: string;
    readonly age: number;
    readonly username: string;
}
