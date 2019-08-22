"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const nameValidator = {
    validator: value => {
        if (value)
            return /^[A-Za-z_0-9]+$/.test(value);
        else
            value;
    },
    message: 'Name can contain only letters.',
};
const usernameValidator = {
    validator: value => {
        if (value)
            return /^[A-Za-z_0-9]+$/.test(value);
        else
            value;
    },
    message: "Username can contain only letters and underscore '_'.",
};
const titlecase = value => {
    if (value)
        return value
            .trim()
            .split(' ')
            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(' ');
};
exports.UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    username: {
        type: String,
        required: [true, 'Username field is required'],
        unique: true,
        validate: usernameValidator,
        minlength: [8, 'Username should be at least 8 characters long'],
        maxlength: [32, 'Username should be at most 32 characters long'],
    },
    password: { type: String, required: [true, 'Password field is required'] },
    fname: {
        type: String,
        required: true,
        validate: nameValidator,
        set: titlecase,
    },
    lname: {
        type: String,
        required: true,
        validate: nameValidator,
        set: titlecase,
    },
    dob: { type: Date, required: true },
    designation: {
        type: String,
        required: true,
        enum: ['admin', 'student', 'faculty'],
    },
    age: { type: Number, min: [16, 'Age should be greater than 16'] },
});
//# sourceMappingURL=user.schema.js.map