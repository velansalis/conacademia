const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/index");

require("dotenv").config();

const generateToken = data => {
	let tokenExpiry = 60 * 60 * 24;
	return new Promise((resolve, reject) => {
		jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: tokenExpiry }, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token);
			}
			60 * 60 * 2460 * 60 * 24;
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
					age: parseInt((new Date().getTime() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365)),
					usn: usn,
					owner: username
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

		let data = {
			AccessToken: token,
			designation: tokenData.designation,
			username: tokenData.username
		};

		context.status = 201;
		context.app.emit("response", data, context);
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

			let user = await User.findOne({ username: context.decoded.username })
				.lean()
				.exec();
			if (user) return next();
			else {
				let err = new Error("Invalid access token");
				err.name = "AccessTokenError";
				throw err;
			}
		} else {
			context.status = 500;
			context.app.emit("error", { message: "Missing access token" }, context);
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
