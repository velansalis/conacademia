const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	// Auto Generated ID
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true
	},

	// Required Fields
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	dob: { type: Date, required: true },
	designation: { type: String, required: true, enum: ["student", "faculty"] },

	// Student Special Field
	usn: { type: String, required: true },

	// Optional fields to be filled later
	age: { type: Number },
	college: { type: String },
	department: { type: String },
	doj: { type: Date },
	courses: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
	activities: [
		{
			method: { type: String },
			url: { type: String },
			timestamp: { type: Date }
		}
	],
	created_by: { type: String }
});

module.exports = mongoose.model("User", UserSchema);
