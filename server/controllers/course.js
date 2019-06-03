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
				throw new Error("Read Error");
			}),
			writeStream.on("error", () => {
				throw new Error("Write Error");
			})
		);
		return savefile;
	} catch (err) {
		throw new Error({
			name: "UploadError",
			message: "There was an error uploading the file",
			error: err
		});
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
		let response = await Course.findOne({
			course_id: context.params.course_id
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
			message: "Course Added",
			data: response
		};
	} catch (err) {
		console.log(err);
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
	let savefile = null;
	try {
		if (context.request.body.query != undefined) {
			if (context.request.body.query.details) {
				delete context.request.body.query.details;
			}
			Object.assign(updateQuery, context.request.body.query);
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
			message: "Course Updated",
			data: response
		};
	} catch (err) {
		console.log(err);
		context.body = {
			error: true,
			message: err
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
