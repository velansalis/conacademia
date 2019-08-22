export declare class CreateUserDto {
    readonly fname: string;
    readonly lname: string;
    readonly username: string;
    readonly password1: string;
    readonly password2: string;
    readonly dob: string;
    readonly designation: string;
    readonly age: number;
}
export interface User {
    id: string;
    username: string;
    password: string;
    fname: string;
    lname: string;
    dob: string;
    designation: string;
    age: number;
}
