import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    // Unique ID that is generated
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },

    // Unique username for every user
    username: {
        type: String,
        required: [true, 'Username field is required'],
        unique: [true, 'Username already exists.'],
        validate: {
            validator: value => {
                if (value) return /^[A-Za-z_0-9]+$/.test(value);
                else value;
            },
            message: "Username can contain only letters and underscore '_'.",
        },
        minlength: [8, 'Username should be at least 8 characters long'],
        maxlength: [32, 'Username should be at most 32 characters long'],
    },

    // Hashed Password
    password: {
        type: String,
        required: [true, 'Password field is required'],
    },

    // First Name with Name validator and title case transformation
    fname: {
        type: String,
        required: true,
        validate: {
            validator: value => {
                if (value) return /^[A-Za-z_0-9]+$/.test(value);
                else value;
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

    // Last Name with Name validator and title case transformation
    lname: {
        type: String,
        required: true,
        validate: {
            validator: value => {
                if (value) return /^[A-Za-z_0-9]+$/.test(value);
                else value;
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

    // Date of birth
    dob: { type: Date, required: true },

    // Designation (admin, faculty, student)
    designation: { type: String, required: true, enum: ['student', 'faculty'], default: 'student' },

    // Age (inferred from date of birth)
    age: { type: Number, min: [16, 'Age should be greater than 16'] },

    // Owner of the particular document
    owner: { type: String, required: true },

    scope: { type: String, enum: ['admin', 'user', 'course'], required: true, default: 'user' },

    // Access token
    token: { type: String },
});
