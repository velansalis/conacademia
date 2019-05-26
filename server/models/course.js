const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
		index: true
	},
	uploaded_faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
	course_id: { type: String, unique: true },
	title: { type: String },
	year: { type: Number },
	semester: { type: Number },
	xlfile_name: { type: String }
});

module.exports = mongoose.model("Course", CourseSchema);
