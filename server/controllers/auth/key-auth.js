const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/index");

require("dotenv").config();

const generateToken = data => {
	return new Promise((resolve, reject) => {
		jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: 60 * 60 * 24 }, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};

const loginOrCreate = context => {
	return new Promise(async (resolve, reject) => {
		try {
			let { username, password } = context.request.body;
			let user = await User.findOne({ username: username })
				.lean()
				.exec();
			if (user) {
				let response = await bcrypt.compare(password, user.password);
				if (response) {
					resolve({
						_id: user._id,
						username: user.username,
						designation: user.designation
					});
				} else {
					let err = new Error(`Invalid Credentials : Wrong Password`);
					err.name = "Unauthorized";
					throw err;
				}
			} else {
				let { username, password, fname, lname, designation, dob, usn } = context.request.body;
				let hash = await bcrypt.hash(password, 12);
				let user = await new User({
					username: username,
					password: hash,
					fname: fname,
					lname: lname,
					designation: designation,
					dob: new Date(dob).toDateString(),
					usn: usn,
					created_by: username
				}).save();
				resolve({
					_id: user._id,
					username: user.username,
					designation: user.designation
				});
			}
		} catch (err) {
			reject(err);
		}
	});
};

const getKey = async context => {
	try {
		let tokenData = await loginOrCreate(context);
		let token = await generateToken(tokenData);
		context.status = 200;
		context.app.emit(
			"response",
			{ AccessToken: token, designation: tokenData.designation, username: tokenData.username },
			context
		);
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

const verifyKey = async (context, next) => {
	try {
		let { authorization } = context.request.headers;
		if (authorization) {
			let token = authorization.split(" ")[1];
			var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
			context.decoded = decoded;
			return next();
		} else {
			context.status = 500;
			context.app.emit("error", { message: "Authorization token missing" }, context);
		}
	} catch (err) {
		context.status = err.status || 500;
		context.app.emit("error", err, context);
	}
};

module.exports = {
	getKey,
	verifyKey
};
