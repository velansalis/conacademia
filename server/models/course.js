const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
		required: true
	},
	semester: {
		type: Number,
		required: true
	},
	xlfile_name: {
		type: String
	},
	faculty_incharge: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Faculty"
	},
	marks: [
		{
			usn: {
				type: String,
				required: true,
				lowercase: true,
				ref: "Student"
			},
			attendance: {
				type: Number
			},
			task: [
				{
					type: Number,
					min: [0, "Task marks can't be less than 0"]
				}
			],
			mse1: {
				type: Number,
				min: [0, "MSE marks can't be less than 0"]
			},
			mse2: {
				type: Number,
				min: [0, "MSE marks can't be less than 0"]
			},
			total: {
				type: Number
			},
			remarks: {
				type: String
			}
		}
	],
	created_by: { type: String, required: true }
});

module.exports = mongoose.model("Course", CourseSchema);
