const { Student } = require("../models/index");
const bcrypt = require("bcrypt");

const getStudents = async (context, next) => {
	try {
		console.log(context.requested);
		let response = await Student.find().exec();
		response.map(object => {
			return (object.password = null);
		});
		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const getStudent = async (context, next) => {
	try {
		let response = await Student.find({
			username: context.params.username
		}).exec();
		response.map(object => {
			return (object.password = null);
		});
		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const addStudent = async (context, next) => {
	try {
		let {
			username,
			password,
			fname,
			lname,
			dob,
			usn
		} = context.request.body;

		let hash = await bcrypt.hash(password, 12);

		let response = await new Student({
			username: username,
			password: hash,
			fname: fname,
			lname: lname,
			dob: new Date(dob).toDateString(),
			usn: usn
		}).save();

		[response].map(object => {
			return (object.password = null);
		});

		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const deleteStudent = async (context, next) => {
	try {
		let response = await Student.deleteOne({
			username: context.params.username
		}).exec();
		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.body = {
			error: err,
			data: []
		};
	}
};

const updateStudent = async (context, next) => {
	try {
		let response = await Student.updateObe(
			context.params.username,
			context.request.body.query
		).exec();
		context.status = 200;
		context.app.emit("response", response, context);
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
