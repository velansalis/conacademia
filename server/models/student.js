const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true
	},
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	dob: { type: Date, required: true },
	usn: { type: String, required: true },
	age: { type: Number },
	doj: { type: Date },
	college: { type: String },
	department: { type: String },
	activities: [
		{
			method: { type: String },
			url: { type: String }
		}
	]
});

module.exports = mongoose.model("Student", StudentSchema);
