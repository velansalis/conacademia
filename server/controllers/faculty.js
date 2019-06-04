const bcrypt = require("bcrypt");

const Faculty = require("../models/index").faculty;

const getFaculties = async (context, next) => {
	try {
		let response = await Faculty.find().exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.body = {
			errors: err
		};
	}
};

const getFaculty = async (context, next) => {
	try {
		let response = await Faculty.find({
			username: context.params.username
		}).exec();
		context.body = {
			data: response._doc
		};
	} catch (err) {
		context.body = {
			errors: err
		};
	}
};

const addFaculty = async (context, next) => {
	try {
		const body = context.request.body;
		const hashedPassword = await bcrypt.hash(body.password, 12);
		const response = await new Faculty({
			username: body.username,
			password: hashedPassword,
			fname: body.fname,
			lname: body.lname,
			dob: new Date(body.dob)
		}).save();
		context.body = {
			data: response
		};
	} catch (err) {
		context.body = {
			errors: err.toString()
		};
	}
};

const deleteFaculty = async (context, next) => {
	try {
		let response = await Faculty.deleteOne({
			username: context.params.username
		}).exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.body = {
			errors: err
		};
	}
};

const updateFaculty = async (context, next) => {
	try {
		let response = await Faculty.findOneAndUpdate(
			context.params.username,
			context.request.body
		).exec();
		context.body = {
			data: response
		};
	} catch (err) {
		context.body = {
			errors: err
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
