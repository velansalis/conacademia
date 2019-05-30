const fs = require("fs");
const path = require("path");
const promisePipe = require("promisepipe");

const Course = require("../models/index").course;
const Faculty = require("../models/index").faculty;

const uploadFile = async context => {
	try {
		const uploadfile = context.request.files.file;
		const savefile = Date.now().toString() + uploadfile.name;
		let readStream = fs.createReadStream(uploadfile.path);
		let writeStream = fs.createWriteStream(path.join("uploads", savefile));
		await promisePipe(
			readStream.on("error", () => {
				console.log("Read Error");
			}),
			writeStream.on("error", () => {
				console.log("Write Error");
			})
		);
		return savefile;
	} catch (err) {
		context.body = {
			name: "UploadError",
			message: "There was an error uploading the file",
			error: err
		};
	}
};

const getCourses = async (context, next) => {
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
};

const getCourse = async (context, next) => {
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
};

const addCourse = async (context, next) => {
	let saveObject = new Object();
	try {
		if (Object.keys(context.request.files).length != 0) {
			let savefile = await uploadFile(context);
			Object.assign(saveObject, {
				xlfile_name: savefile
			});
		} else {
			Object.assign(saveObject, {
				course_id: context.request.body.course_id,
				course_title: context.request.body.course_title,
				credits: context.request.body.credits,
				year: context.request.body.year,
				semester: context.request.body.semester
			});
		}
		let response = await new Course(saveObject).save();
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
};

const updateCourse = async (context, next) => {
	let updateQuery = new Object();
	let response = null;
	try {
		if (context.request.files) {
			let savefile = await uploadFile(context);
			Object.assign(updateQuery, {
				xlfile_name: savefile
			});
		} else if (context.request.body.query.details) {
			let detailsObject = JSON.parse(
				JSON.stringify(context.request.body.query.details)
			);
			delete context.request.body.query.details;
			let _detailsObject = context.request.body.query;
			let value = await Course.findOne({
				_id: context.params.id
			}).exec();
			value = value.details.filter(
				record => record.usn == detailsObject.usn
			);
			if (value.length != 0) {
				console.log("Inside");
				response = await Course.update(
					{ _id: context.params.id },
					Object.assign(_detailsObject, { details: detailsObject })
				).exec();
			} else {
				response = await Course.update(
					{ _id: context.params.id },
					Object.assign(_detailsObject, {
						$push: { details: detailsObject }
					})
				).exec();
			}
		} else {
			Object.assign(updateQuery, context.request.body.query);
			response = await Course.findOneAndUpdate(
				context.params.id,
				updateQuery
			).exec();
		}
		context.body = {
			message: "Course Updated",
			data: response
		};
	} catch (err) {
		context.body = {
			error: true,
			message: err.toString()
		};
	}
};

const deleteCourse = async (context, next) => {
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
		console.log(err);
		context.body = {
			message: "There was an error",
			error: err
		};
	}
};

module.exports = {
	getCourses: getCourses,
	getCourse: getCourse,
	addCourse: addCourse,
	deleteCourse: deleteCourse,
	updateCourse: updateCourse
};
