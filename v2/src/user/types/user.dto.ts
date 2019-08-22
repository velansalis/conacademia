import { IsString, IsInt, IsDate, Max } from 'class-validator';

export class UserDTO {
    _id: string;
    username: string;
    password: string;
    age: number;
    owner: string;
    fname: string;
    lname: string;
    designation: string;
    dob: string;
    token: string;
    __v: number;
}
