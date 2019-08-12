const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarksSchema = new Schema(
	{
		// Required fields
		usn: { type: String, required: true, lowercase: true, ref: "User", unique: true },
		attendance: { type: Number, min: 0, required: true, default: 0 },
		task: [{ type: Number, min: [0, "Task marks can't be less than 0"], required: false, default: 0 }],
		mse1: { type: Number, min: [0, "MSE marks can't be less than 0"], required: true, default: 0 },
		mse2: { type: Number, min: [0, "MSE marks can't be less than 0"], required: true, default: 0 }
	},
	{ _id: false }
);

const CourseSchema = new Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true, index: false },

	// Required Fields
	course_id: { type: String, minlength: 8, maxlength: 8, required: true, lowercase: true, unique: true },
	course_title: { type: String, required: true },
	credits: { type: Number, required: true },
	year: { type: Number, required: true },
	semester: { type: Number, required: true },
	faculty_incharge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	owner: { type: String, required: true },

	// Optionals
	marksheet: { type: String },
	marks: [MarksSchema]
});

module.exports = mongoose.model("Course", CourseSchema);
