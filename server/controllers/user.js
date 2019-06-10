const { User } = require("../models/index");
const bcrypt = require("bcrypt");

const getUsers = async (context, next) => {
	try {
		let response = await User.find().exec();
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

const getUser = async (context, next) => {
	try {
		let response = await User.find({
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

const addUser = async (context, next) => {
	try {
		let { username, password, fname, lname, dob, usn } = context.request.body;
		let hash = await bcrypt.hash(password, 12);
		if (!usn && designation.toLowercase() == "student") throw new Error();
		let response = await new User({
			username: username,
			password: hash,
			fname: fname,
			lname: lname,
			dob: new Date(dob).toDateString(),
			usn: usn,
			created_by: username
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

const deleteUser = async (context, next) => {
	try {
		let response = await User.deleteOne({
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

const updateUser = async (context, next) => {
	try {
		let response = await User.updateObe(context.params.username, context.request.body.query).exec();
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
	getUsers,
	getUser,
	addUser,
	updateUser,
	deleteUser
};
