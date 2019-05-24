const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DatasetSchema = new Schema({
	_id: { type: Schema.Types.ObjectId },
	title: { type: String, required: true },
	description: { type: String },
	file: { type: Buffer, required: true },
	tags: [{ type: String, required: true }],
	size: { type: String },
	link: { type: String, required: true }
});

module.exports = mongoose.model("Dataset", DatasetSchema);
