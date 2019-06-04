const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Marks = new Schema({
	usn: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		ref: "Student"
	},
	attendance: {
		type: Number,
		default: 0
	},
	task: [
		{
			type: Number,
			min: [0, "Task marks can't be less than 0"],
			default: 0
		}
	],
	mse1: {
		type: Number,
		min: [0, "MSE marks can't be less than 0"],
		default: 0
	},
	mse2: {
		type: Number,
		min: [0, "MSE marks can't be less than 0"],
		default: 0
	},
	total: {
		type: Number,
		default: 0
	},
	remarks: {
		type: String,
		default: null
	}
});

const CourseSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
		index: false
	},
	course_id: {
		type: String,
		minlength: 8,
		maxlength: 8,
		required: true,
		lowercase: true
	},
	course_title: {
		type: String,
		required: true
	},
	credits: {
		type: Number,
		required: true
	},
	year: {
		type: Number,
		default: new Date().getFullYear(),
		required: true
	},
	semester: {
		type: Number,
		required: true
	},
	xlfile_name: {
		type: String,
		default: null
	},
	faculty_incharge: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Faculty"
	},
	marks: [Marks]
});

module.exports = mongoose.model("Course", CourseSchema);
