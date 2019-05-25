const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DatasetSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		default: new mongoose.Types.ObjectId()
	},
	title: { type: String, required: true },
	description: { type: String },
	file: { type: Buffer },
	tags: [{ type: String }],
	size: { type: String },
	link: { type: String }
});

module.exports = mongoose.model("Dataset", DatasetSchema);
