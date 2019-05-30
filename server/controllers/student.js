const Student = require("../models/index").student;

const getStudents = async (context, next) => {
	try {
		let response = await Student.find().exec();
		context.body = {
			message: "Students Found",
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

const getStudent = async (context, next) => {
	try {
		let response = await Student.find({
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

const addStudent = async (context, next) => {
	try {
		let response = await new Student({
			username: context.request.body.username,
			password: context.request.body.password,
			fname: context.request.body.fname,
			lname: context.request.body.lname,
			dob: new Date(context.request.body.dob)
		}).save();
		context.body = {
			message: "Student Added",
			data: response
		};
	} catch (err) {
		context.body = {
			message: "There was an error",
			error: err
		};
	}
};

const deleteStudent = async (context, next) => {
	try {
		let response = await Student.deleteOne({
			username: context.params.username
		}).exec();
		context.body = {
			message: "Student Deleted",
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

const updateStudent = async (context, next) => {
	try {
		let response = await Student.findOneAndUpdate(
			context.params.username,
			context.request.body.query
		).exec();
		context.body = {
			message: "Student Updated",
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
	getStudents: getStudents,
	getStudent: getStudent,
	addStudent: addStudent,
	deleteStudent: deleteStudent,
	updateStudent: updateStudent
};
