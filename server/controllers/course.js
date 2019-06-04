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
				throw new Error({
					errors: "File Read Error"
				});
			}),
			writeStream.on("error", () => {
				throw new Error({
					errors: "Write Error"
				});
			})
		);
		return savefile;
	} catch (err) {
		context.response.status = 500;
		throw new Error({
			errors: err.toString()
		});
	}
};

const getCourses = async (context, next) => {
	try {
		let response = await Course.find()
			.lean()
			.exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.response.status = 500;
		context.body = {
			errors: err,
			data: response
		};
	}
};

const getCourse = async (context, next) => {
	try {
		let course_id = context.params.course_id.toLowerCase();
		let response = await Course.findOne({
			course_id: course_id
		})
			.lean()
			.exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.body = {
			errors: err,
			data: response
		};
	}
};

const addCourse = async (context, next) => {
	let saveObject = new Object();
	try {
		if (context.request.files != undefined) {
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
			data: response
		};
	} catch (err) {
		if (err.name == "MongoError") {
			fs.unlink(path.join("uploads", savefile), () => {
				console.log(`Removed ${savefile}`);
			});
		}
		context.body = {
			errors: err,
			data: response
		};
	}
};

const updateCourse = async (context, next) => {
	let updateQuery = new Object();
	let response = null;
	let savefile = null;
	try {
		if (Object.keys(context.request.body).length == 0) {
			if (context.request.body.details) {
				delete context.request.body.details;
			}
			Object.assign(updateQuery, context.request.body);
		}
		if (context.request.files != undefined) {
			savefile = await uploadFile(context);
			Object.assign(updateQuery, {
				xlfile_name: savefile
			});
		}
		response = await Course.findOneAndUpdate(
			context.params.course_id,
			updateQuery
		).exec();
		context.body = {
			data: response
		};
	} catch (err) {
		console.log(err);
		context.body = {
			errors: err.toString(),
			data: response
		};
	}
};

const deleteCourse = async (context, next) => {
	try {
		let response = await Course.findOne({
			course_id: context.params.course_id
		})
			.lean()
			.exec();
		if (response[0] && response[0].xlfile_name) {
			let file = response[0].xlfile_name;
			fs.unlinkSync(path.join("uploads", file));
		}
		response = await Course.deleteOne({
			course_id: context.params.course_id
		}).exec();
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

const getDetail = async (context, next) => {
	try {
		let response = await Course.findOne({
			course_id: context.params.course_id
		})
			.lean()
			.exec();
		response = response.details.filter(records => {
			return records.usn == context.params.usn;
		});
		context.response.status = 200;
		context.body = {
			err: false,
			statusCode: 200,
			count: response.length,
			data: response
		};
	} catch (err) {
		context.response.status = 500;
		context.body = {
			error: true,
			statusCode: 500,
			errorMessage: err.toString(),
			data: []
		};
	}
};

const addDetail = async (context, next) => {
	try {
		let updateQuery = context.request.body.query;
		let response = await Course.updateOne(
			{
				course_id: context.params.course_id,
				"details.usn": { $ne: updateQuery.usn }
			},
			{ $push: { details: updateQuery } }
		).exec();
		context.body = {
			err: false,
			title: "Success",
			statusCode: 200,
			count: response.length,
			data: response
		};
	} catch (err) {
		context.body = {
			error: true,
			title: "ServerError",
			statusCode: 500,
			message: err.toString()
		};
	}
};

const updateDetail = async (context, next) => {
	let requestQuery = context.request.body.query;
	try {
		let updateQuery = context.request.body.query;
		let response = await Course.updateOne(
			{
				course_id: context.params.course_id
			},
			{ $pull: { details: { usn: updateQuery.usn } } }
		).exec();
		response = await Course.updateOne(
			{
				course_id: context.params.course_id,
				"details.usn": { $ne: updateQuery.usn }
			},
			{ $push: { details: updateQuery } }
		).exec();
		context.body = {
			err: false,
			title: "Success",
			statusCode: 200,
			count: response.length,
			data: response
		};
	} catch (err) {
		context.body = {
			error: true,
			title: "ServerError",
			statusCode: 500,
			message: err.toString()
		};
	}
};

const deleteDetail = async (context, next) => {
	try {
		let response = await Course.updateOne(
			{
				course_id: context.params.course_id
			},
			{ $pull: { details: { usn: context.params.usn } } }
		).exec();

		context.body = {
			err: false,
			title: "Success",
			statusCode: 200,
			count: response.length,
			data: response
		};
	} catch (err) {
		context.body = {
			error: true,
			title: "ServerError",
			statusCode: 500,
			message: err.toString()
		};
	}
};

module.exports = {
	getCourses: getCourses,
	getCourse: getCourse,
	addCourse: addCourse,
	deleteCourse: deleteCourse,
	updateCourse: updateCourse,
	getDetail: getDetail,
	addDetail: addDetail,
	updateDetail: updateDetail,
	deleteDetail: deleteDetail
};
