const Course = require("../models/index").course;

module.exports = {
	// GET
	getCourses: async (context, next) => {
		try {
			let response = await Course.find().exec();
			context.body = {
				message: "Courses Found",
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
	getCourse: async (context, next) => {
		try {
			let response = await Course.find({
				username: context.params.id
			}).exec();
			context.body = {
				message: "Course Found",
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
	addCourse: async (context, next) => {
		try {
			let response = await new Course({
				title: context.request.body.title
			}).save();
			context.body = {
				message: "Course Added",
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
	deleteCourse: async (context, next) => {
		try {
			let response = await Course.deleteOne({
				_id: context.params.id
			}).exec();
			context.body = {
				message: "Course Deleted",
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
	updateCourse: async (context, next) => {
		try {
			let response = await Course.findOneAndUpdate(
				context.params.id,
				context.request.body.query
			).exec();
			context.body = {
				message: "Course Updated",
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
