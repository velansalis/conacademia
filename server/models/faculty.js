const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		default: new mongoose.Types.ObjectId()
	},
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	dob: { type: Date, required: true },
	age: { type: Number },
	doj: { type: Date },
	college: { type: String },
	department: { type: String },
	datasets_published: [{ type: Schema.Types.ObjectId, ref: "Dataset" }],
	datasets_saved: [{ type: Schema.Types.ObjectId, ref: "Dataset" }],
	datasets_downloaded: [{ type: Schema.Types.ObjectId, ref: "Dataset" }]
});

module.exports = mongoose.model("Faculty", FacultySchema);
