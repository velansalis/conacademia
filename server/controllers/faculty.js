const Faculty = require("../models/index").faculty;

const getFaculties = async (context, next) => {
	try {
		let response = await Faculty.find().exec();
		context.body = {
			message: "Faculty Found",
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

const getFaculty = async (context, next) => {
	try {
		let response = await Faculty.find({
			username: context.params.username
		}).exec();
		context.body = {
			message: "Users Found",
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

const addFaculty = async (context, next) => {
	try {
		let response = await new Faculty({
			username: context.request.body.username,
			password: context.request.body.password,
			fname: context.request.body.fname,
			lname: context.request.body.lname,
			dob: new Date(context.request.body.dob)
		}).save();
		context.body = {
			message: "Faculty Added",
			data: response
		};
	} catch (err) {
		context.body = {
			message: "There was an error",
			error: err
		};
	}
};

const deleteFaculty = async (context, next) => {
	try {
		let response = await Faculty.deleteOne({
			username: context.params.username
		}).exec();
		context.body = {
			message: "Faculty Deleted",
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

const updateFaculty = async (context, next) => {
	try {
		let response = await Faculty.findOneAndUpdate(
			context.params.username,
			context.request.body.query
		).exec();
		context.body = {
			message: "Faculty Updated",
			data: response
		};
	} catch (err) {
		context.body = {
			message: "There was an error",
			error: err
		};
	}
};

module.exports = {
	getFaculties: getFaculties,
	getFaculty: getFaculty,
	addFaculty: addFaculty,
	deleteFaculty: deleteFaculty,
	updateFaculty: updateFaculty
};
