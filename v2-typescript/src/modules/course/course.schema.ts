import * as mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
    {
        // Required fields
        usn: { type: String, required: true, lowercase: true, unique: true },
        marks: [
            {
                exam_name: { type: String, required: true, unique: true },
                acquired_marks: { type: Number, required: true },
                total_marks: { type: Number, required: true },
            },
        ],
    },
    { _id: false },
);

export const CourseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, index: false },
    course_id: { type: String, minlength: 8, maxlength: 8, required: true, lowercase: true, unique: true },
    course_title: { type: String, required: true },
    credits: { type: Number, required: true },
    year: { type: Number, required: true },
    semester: { type: String, required: true, enum: ['odd', 'even'] },
    faculty_incharge: { type: String, required: true },
    student_details: [StudentSchema],
});
