const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
		index: false
	},
	course_id: { type: String, required: true },
	course_title: { type: String, required: true },
	credits: { type: Number, required: true },
	year: { type: Number, required: true },
	semester: { type: Number, required: true },
	xlfile_name: { type: String },
	faculty_incharge: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
	details: [
		{
			usn: { type: String, ref: "Student" },
			attendance: { type: Number },
			task: [{ type: Number }],
			mse1: { type: Number },
			mse2: { type: Number },
			total: { type: Number },
			remarks: { type: String, default: null }
		}
	]
});

module.exports = mongoose.model("Course", CourseSchema);
