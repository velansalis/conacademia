const Dataset = require("../models/index").dataset;

module.exports = {
	// GET
	getDatasets: async (context, next) => {
		try {
			let response = await Dataset.find().exec();
			context.body = {
				message: "Datasets Found",
				count: response.length,
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	// GET specific
	getDataset: async (context, next) => {
		try {
			let response = await Dataset.find({
				username: context.params.id
			}).exec();
			context.body = {
				message: "Dataset Found",
				count: response.length,
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	// POST
	addDataset: async (context, next) => {
		try {
			let response = await new Dataset({
				title: context.request.body.title
			}).save();
			context.body = {
				message: "Dataset Added",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	},
	// DELETE
	deleteDataset: async (context, next) => {
		try {
			let response = await Dataset.deleteOne({
				id: context.params.id
			}).exec();
			context.body = {
				message: "Dataset Deleted",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err,
				data: response
			};
		}
	},
	// PATCH
	updateDataset: async (context, next) => {
		try {
			let response = await Dataset.findOneAndUpdate(
				context.request.body.query,
				context.request.body.value
			).exec();
			context.body = {
				message: "Dataset Updated",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	}
};
