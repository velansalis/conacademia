const Course = require("../models/index").course;
const Faculty = require("../models/index").faculty;
const fs = require("fs");
const path = require("path");
const promisePipe = require("promisepipe");

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
				_id: context.params.id
			}).exec();
			context.body = {
				message: "Course Found",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	},
	addCourse: async (context, next) => {
		const uploadfile = context.request.files.file;
		const savefile = Date.now().toString() + uploadfile.name;
		try {
			const stream = await promisePipe(
				fs.createReadStream(uploadfile.path).on("error", () => {
					console.log("Read Error");
				}),
				fs
					.createWriteStream(path.join("uploads", savefile))
					.on("error", () => {
						console.log("Write Error");
					})
			);
			let response = await new Course({
				title: context.request.body.title,
				xlfile_name: savefile,
				course_id: Date.now().toString()
			}).save();
			context.body = {
				message: "Course Added",
				data: response
			};
		} catch (err) {
			if (err.name == "MongoError") {
				fs.unlink(path.join("uploads", savefile), () => {
					console.log(`Removed ${savefile}`);
				});
			}
			context.body = {
				message: "There was an error",
				error: err
			};
		}
	},
	// DELETE
	deleteCourse: async (context, next) => {
		try {
			let response = await Course.find({
				_id: context.params.id
			}).exec();
			let file = response[0].xlfile_name;
			response = await Course.deleteOne({
				_id: context.params.id
			}).exec();
			fs.unlinkSync(path.join("uploads", file));
			context.body = {
				message: "Course Deleted",
				data: response
			};
		} catch (err) {
			context.body = {
				message: "There was an error",
				error: err
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
