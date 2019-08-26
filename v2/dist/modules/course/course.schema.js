"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const MarksSchema = new mongoose.Schema({
    usn: { type: String, required: true, lowercase: true, ref: 'User', unique: true },
    attendance: { type: Number, min: 0, required: true, default: 0 },
    task: [{ type: Number, min: [0, "Task marks can't be less than 0"], required: false, default: 0 }],
    mse1: { type: Number, min: [0, "MSE marks can't be less than 0"], required: true, default: 0 },
    mse2: { type: Number, min: [0, "MSE marks can't be less than 0"], required: true, default: 0 },
}, { _id: false });
exports.CourseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, index: false },
    course_id: { type: String, minlength: 8, maxlength: 8, required: true, lowercase: true, unique: true },
    course_title: { type: String, required: true },
    credits: { type: Number, required: true },
    year: { type: Number, required: true },
    semester: { type: String, required: true, enum: ['odd', 'even'] },
    faculty_incharge: { type: String, required: true },
    marks: [MarksSchema],
});
//# sourceMappingURL=course.schema.js.map