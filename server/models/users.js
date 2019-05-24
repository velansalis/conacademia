const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: { type: Schema.Types.ObjectId },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	dob: { type: Date, required: true },
	age: { type: Number },
	designation: { type: String },
	doj: { type: Date },
	college: { type: String },
	department: { type: String },
	usn: { type: Number, required: true },
	datasets_published: [{ type: Schema.Types.ObjectId, ref: "Datasets" }],
	datasets_saved: [{ type: Schema.Types.ObjectId, ref: "Datasets" }],
	datasets_downloaded: [{ type: Schema.Types.ObjectId, ref: "Datasets" }]
});

module.exports = mongoose.model("User", UserSchema);
