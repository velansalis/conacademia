const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
	_id: { type: Schema.Types.ObjectId },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	date_of_birth: { type: Date, required: true },
	age: { type: Number },
	date_of_join: { type: Date },
	college: { type: String },
	department: { type: String },
	usn: { type: Number },
	datasets_saved: [{ type: Schema.Types.ObjectId, ref: "Datasets" }],
	datasets_downloaded: [{ type: Schema.Types.ObjectId, ref: "Datasets" }]
});

const FacultySchema = new Schema({
	_id: { type: Schema.Types.ObjectId },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	date_of_birth: { type: Date, required: true },
	age: { type: Number },
	date_of_join: { type: Date },
	college: { type: String },
	department: { type: String },
	datasets_published: [{ type: Schema.Types.ObjectId, ref: "Datasets" }]
});

module.exports = {
	student: mongoose.model("Student", StudentSchema),
	faculty: mongoose.model("Faculty", FacultySchema)
};
