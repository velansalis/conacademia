const { upload, removeUploads } = require("./utils/file-util");
const { Course } = require("../models/index");

const getCourses = async (context, next) => {
	let response = null;
	const { limit, offset, order } = context.request.query;
	const avoidQuery = { _id: 0, marks: 0, __v: 0, owner: 0 };
	const sortQuery = { course_title: order == "dsc" ? 0 : 1 };
	const skipQuery = offset == undefined ? 0 : parseInt(offset);
	const limitQuery = limit == undefined ? 5 : parseInt(limit);
	try {
		response = await Course.find({}, avoidQuery)
			.sort(sortQuery)
			.skip(skipQuery)
			.limit(limitQuery)
			.lean()
			.exec();
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err.toString(), context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

const getCourse = async (context, next) => {
	let response = null;
	const { populate } = context.request.query;
	const course_id = context.params.course_id.toLowerCase();
	const findQuery = { course_id: course_id };
	const populateQuery = populate == "true" ? "faculty_incharge" : "";
	const populateFields = ["fname", "lname", "username", "designation", "dob", "age"];
	try {
		response = await Course.findOne(findQuery)
			.populate(populateQuery, populateFields)
			.lean()
			.exec();
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

const addCourse = async (context, next) => {
	let body = context.request.body;
	let response = null;
	let saveQuery = {
		course_id: body.course_id,
		course_title: body.course_title,
		credits: body.credits,
		year: body.year,
		semester: body.semester,
		faculty_incharge: context.decoded._id,
		owner: context.decoded.username
	};
	try {
		response = await Course.create(saveQuery);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

const updateCourse = async (context, next) => {
	let response = null;
	let { marks, marksheet, ...updateQuery } = context.request.body;
	let findQuery = { course_id: context.params.course_id.toLowerCase() };
	let options = { fields: { __v: 0, owner: 0 }, new: true };
	let file = context.request.files.marksheet;
	try {
		if (file) {
			let marksheet = await upload(file);
			updateQuery["marksheet"] = marksheet;
		}
		response = await Course.findOneAndUpdate(findQuery, updateQuery, options).exec();
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

const deleteCourse = async (context, next) => {
	let deleteQuery = { course_id: context.params.course_id };
	let response = null;
	try {
		response = await Course.findOneAndRemove(deleteQuery).exec();
		if (response.marksheet) await removeUploads(response.marksheet);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

// PENDING : Fetching only usn from one query
const getDetail = async (context, next) => {
	let response = null;
	let { course_id, usn } = context.params;
	let findQuery = { course_id: course_id, "marks.usn": usn };
	try {
		response = await Course.findOne(findQuery)
			.lean()
			.exec();
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	} finally {
		context.status = 201;
		context.app.emit("response", response, context);
	}
};

const addDetail = async (context, next) => {
	try {
		let updateQuery = context.request.body;
		let response = await Course.updateOne(
			{
				course_id: context.params.course_id.toLowerCase(),
				"marks.usn": { $ne: updateQuery.usn }
			},
			{ $push: { marks: updateQuery } }
		).exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const updateDetail = async (context, next) => {
	try {
		let updateQuery = context.request.body;
		let response = await Course.findOne({
			course_id: context.params.course_id,
			"marks.usn": { $ne: context.params.usn }
		})
			.lean()
			.exec();
		console.log(response.marks);
		// response = await Course.findOneAndUpdate(
		// 	{
		// 		course_id: context.params.course_id,
		// 		"marks.usn": { $ne: context.params.usn }
		// 	},
		// 	{ $push: { marks: updateQuery } }
		// ).exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const deleteDetail = async (context, next) => {
	try {
		let response = await Course.updateOne(
			{
				course_id: context.params.course_id
			},
			{ $pull: { marks: { usn: context.params.usn } } }
		).exec();

		context.body = {
			data: response
		};
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getCourses,
	getCourse,
	addCourse,
	deleteCourse,
	updateCourse,
	getDetail,
	addDetail,
	updateDetail,
	deleteDetail
};
