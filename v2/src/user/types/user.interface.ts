import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  username: string;
  password: string;
  fname: string;
  lname: string;
  dob: string;
  designation: string;
  age: number;
}
