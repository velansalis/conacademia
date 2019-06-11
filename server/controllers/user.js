const { User } = require("../models/index");
const bcrypt = require("bcrypt");

const getUsers = async (context, next) => {
	try {
		const { limit, offset, order } = context.request.query;
		const avoidQuery = { password: 0, activities: 0, __v: 0, owner: 0 };

		let response = await User.find({}, avoidQuery)
			.sort({ fname: order == "dsc" ? 0 : 1 })
			.skip(offset == undefined ? 0 : parseInt(offset))
			.limit(limit == undefined ? 10 : parseInt(limit))
			.exec();

		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const getUser = async (context, next) => {
	try {
		const { order } = context.request.query;
		const avoidQuery = { password: 0, activities: 0, __v: 0, owner: 0 };

		let response = await User.find({ username: context.params.username }, avoidQuery)
			.sort({ fname: order == "dsc" ? 0 : 1 })
			.exec();

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

const filterQuery = async context => {
	const { activities, _id, owner, designation, oldPassword, newPassword, ...updateObject } = context.request.body;
	let user = await User.findOne({ username: context.params.username })
		.lean()
		.exec();
	if (oldPassword && newPassword) {
		let response = await bcrypt.compare(oldPassword, user.password);
		if (!response) {
			let err = new Error("Invalid old password");
			err.name = "CredentialError";
			throw err;
		} else {
			let hash = await bcrypt.hash(newPassword, 12);
			updateObject.password = hash;
		}
	}
	if (updateObject.dob) {
		updateObject.age = parseInt((new Date().getTime() - new Date(updateObject.dob)) / (1000 * 60 * 60 * 24 * 365));
		updateObject.dob = new Date(updateObject.dob).toDateString();
	}
	return updateObject;
};

const updateUser = async (context, next) => {
	try {
		let updateObject = await filterQuery(context);
		let updateQuery = { username: context.params.username };
		let options = {
			fields: { password: 0, activities: 0, __v: 0, owner: 0 },
			new: true
		};
		let response = await User.findOneAndUpdate(updateQuery, updateObject, options)
			.lean()
			.exec();

		context.status = 200;
		context.app.emit("response", response, context);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getUsers,
	getUser,
	addUser,
	updateUser,
	deleteUser
};
