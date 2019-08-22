"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    username: {
        type: String,
        required: [true, 'Username field is required'],
        unique: [true, 'Username already exists.'],
        validate: {
            validator: value => {
                if (value)
                    return /^[A-Za-z_0-9]+$/.test(value);
                else
                    value;
            },
            message: "Username can contain only letters and underscore '_'.",
        },
        minlength: [8, 'Username should be at least 8 characters long'],
        maxlength: [32, 'Username should be at most 32 characters long'],
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
    },
    fname: {
        type: String,
        required: true,
        validate: {
            validator: value => {
                if (value)
                    return /^[A-Za-z_0-9]+$/.test(value);
                else
                    value;
            },
            message: 'Name can contain only letters.',
        },
        set: value => {
            if (value)
                return value
                    .trim()
                    .split(' ')
                    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                    .join(' ');
        },
    },
    lname: {
        type: String,
        required: true,
        validate: {
            validator: value => {
                if (value)
                    return /^[A-Za-z_0-9]+$/.test(value);
                else
                    value;
            },
            message: 'Name can contain only letters.',
        },
        set: value => {
            if (value)
                return value
                    .trim()
                    .split(' ')
                    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                    .join(' ');
        },
    },
    dob: { type: Date, required: true },
    designation: {
        type: String,
        required: true,
        enum: ['student', 'faculty'],
    },
    age: { type: Number, min: [16, 'Age should be greater than 16'] },
    owner: { type: String, required: true },
    token: { type: String },
});
//# sourceMappingURL=user.schema.js.map